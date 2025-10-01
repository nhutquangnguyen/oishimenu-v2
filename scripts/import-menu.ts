import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, deleteDoc, getDocs } from 'firebase/firestore';
import type { MenuItem, MenuCategory, OptionGroup, MenuOption, CSVMenuItem } from '../lib/types/menu';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Sanitize string for Firestore (remove null bytes and control characters)
 */
function sanitizeString(str: string): string {
  if (!str) return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

/**
 * Generate safe Firestore document ID
 */
function generateSafeDocId(originalId: string): string {
  return sanitizeString(originalId)
    .replace(/[^\w\-._~]/g, '_') // Replace invalid characters with underscore
    .substring(0, 1500); // Firestore max doc ID length
}

/**
 * Parse option group string from CSV format
 * Format: "GroupName##minSelection-maxSelection##option1:price1#option2:price2"
 */
function parseOptionGroup(optionGroupStr: string): OptionGroup | null {
  if (!optionGroupStr || optionGroupStr.trim() === '') {
    return null;
  }

  try {
    const parts = optionGroupStr.split('##');
    if (parts.length < 3) {
      console.warn('Invalid option group format:', optionGroupStr);
      return null;
    }

    const groupName = sanitizeString(parts[0]);
    const selectionRange = parts[1].trim();
    const optionsStr = parts[2].trim();

    // Parse min-max selection
    const [minStr, maxStr] = selectionRange.split('-');
    const minSelection = parseInt(minStr, 10);
    const maxSelection = parseInt(maxStr, 10);

    if (isNaN(minSelection) || isNaN(maxSelection)) {
      console.warn('Invalid selection range:', selectionRange);
      return null;
    }

    // Parse options
    const options: MenuOption[] = [];
    const optionParts = optionsStr.split('#');

    for (const optionPart of optionParts) {
      if (!optionPart.trim()) continue;

      const colonIndex = optionPart.lastIndexOf(':');
      if (colonIndex === -1) {
        console.warn('Invalid option format:', optionPart);
        continue;
      }

      const name = sanitizeString(optionPart.substring(0, colonIndex));
      const priceStr = optionPart.substring(colonIndex + 1).trim();
      const price = parseInt(priceStr, 10);

      if (isNaN(price)) {
        console.warn('Invalid option price:', priceStr);
        continue;
      }

      options.push({ name, price });
    }

    return {
      name: groupName,
      minSelection,
      maxSelection,
      options,
    };
  } catch (error) {
    console.error('Error parsing option group:', optionGroupStr, error);
    return null;
  }
}

/**
 * Convert CSV row to MenuItem
 */
function csvToMenuItem(csvItem: CSVMenuItem): MenuItem {
  const photos: string[] = [
    csvItem.Photo1,
    csvItem.Photo2,
    csvItem.Photo3,
    csvItem.Photo4,
  ].filter(Boolean).map(sanitizeString);

  const optionGroups: OptionGroup[] = [
    csvItem.OptionGroup1,
    csvItem.OptionGroup2,
    csvItem.OptionGroup3,
    csvItem.OptionGroup4,
    csvItem.OptionGroup5,
    csvItem.OptionGroup6,
  ]
    .map(parseOptionGroup)
    .filter((group): group is OptionGroup => group !== null);

  const originalId = csvItem['﻿*ItemID'];
  const safeId = generateSafeDocId(originalId);

  return {
    id: safeId,
    name: sanitizeString(csvItem['*ItemName']),
    price: parseInt(csvItem['*Price'], 10),
    categoryName: sanitizeString(csvItem['*CategoryName']),
    availabilitySchedule: sanitizeString(csvItem.AvailabilitySchedule || ''),
    availableStatus: csvItem['*AvailableStatus'] as MenuItem['availableStatus'],
    description: sanitizeString(csvItem.Description || ''),
    photos,
    optionGroups,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Extract unique categories from menu items
 */
function extractCategories(menuItems: MenuItem[]): MenuCategory[] {
  const categoryNames = [...new Set(menuItems.map(item => item.categoryName))];

  return categoryNames.map((name, index) => ({
    id: generateSafeDocId(`category-${name.toLowerCase().replace(/\s+/g, '-')}`),
    name,
    displayOrder: index + 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

/**
 * Clear existing data from collections
 */
async function clearCollections() {
  console.log('🗑️ Clearing existing data...');

  // Clear menu items
  const menuItemsSnapshot = await getDocs(collection(db, 'menu-items'));
  const menuItemsBatch = writeBatch(db);
  menuItemsSnapshot.docs.forEach(doc => {
    menuItemsBatch.delete(doc.ref);
  });
  if (menuItemsSnapshot.docs.length > 0) {
    await menuItemsBatch.commit();
    console.log(`✅ Cleared ${menuItemsSnapshot.docs.length} existing menu items`);
  }

  // Clear categories
  const categoriesSnapshot = await getDocs(collection(db, 'menu-categories'));
  const categoriesBatch = writeBatch(db);
  categoriesSnapshot.docs.forEach(doc => {
    categoriesBatch.delete(doc.ref);
  });
  if (categoriesSnapshot.docs.length > 0) {
    await categoriesBatch.commit();
    console.log(`✅ Cleared ${categoriesSnapshot.docs.length} existing categories`);
  }
}

/**
 * Import menu data to Firestore
 */
async function importToFirestore(menuItems: MenuItem[], categories: MenuCategory[]) {
  console.log('📤 Importing data to Firestore...');

  try {
    // Import categories first
    console.log('📂 Importing categories...');
    const categoriesBatch = writeBatch(db);
    categories.forEach(category => {
      const categoryRef = doc(collection(db, 'menu-categories'), category.id);
      categoriesBatch.set(categoryRef, category);
    });
    await categoriesBatch.commit();
    console.log(`✅ Imported ${categories.length} categories`);

    // Import menu items in smaller batches to avoid timeout
    const batchSize = 10; // Reduced batch size
    const totalBatches = Math.ceil(menuItems.length / batchSize);

    for (let i = 0; i < menuItems.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchItems = menuItems.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;

      console.log(`📦 Processing batch ${batchNum}/${totalBatches} (${batchItems.length} items)...`);

      batchItems.forEach((item, index) => {
        try {
          const itemRef = doc(collection(db, 'menu-items'), item.id);
          batch.set(itemRef, item);
        } catch (error) {
          console.error(`❌ Error adding item ${i + index}:`, error);
          console.error('Item data:', JSON.stringify(item, null, 2));
        }
      });

      try {
        await batch.commit();
        console.log(`✅ Committed batch ${batchNum}/${totalBatches}`);
      } catch (error) {
        console.error(`❌ Error committing batch ${batchNum}:`, error);
        throw error;
      }
    }

    console.log(`🎉 Successfully imported ${menuItems.length} menu items`);

  } catch (error) {
    console.error('❌ Import to Firestore failed:', error);
    throw error;
  }
}

/**
 * Main import function
 */
async function importMenu(csvFilePath: string) {
  try {
    console.log('🚀 Starting menu import...');
    console.log('📂 Reading CSV file:', csvFilePath);

    // Read and parse CSV file
    const csvContent = await fs.readFile(csvFilePath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVMenuItem[];

    console.log(`📋 Found ${records.length} items in CSV`);

    // Filter out header/explanation rows
    const validRecords = records.filter((record) => {
      const itemID = record['﻿*ItemID'];
      const itemName = record['*ItemName'];
      const price = record['*Price'];

      const hasItemID = itemID && itemID.trim() !== '';
      const startsWithVNITE = hasItemID && itemID.startsWith('VNITE');
      const hasItemName = itemName && itemName.trim() !== '';
      const hasPrice = price && price.trim() !== '';
      const validPrice = hasPrice && !isNaN(parseInt(price, 10));

      return hasItemID && startsWithVNITE && hasItemName && hasPrice && validPrice;
    });

    console.log(`✅ ${validRecords.length} valid menu items found`);

    if (validRecords.length === 0) {
      throw new Error('No valid menu items found in CSV file');
    }

    // Take only top 10 items for testing
    const limitedRecords = validRecords.slice(0, 10);
    console.log(`🔢 Using top ${limitedRecords.length} items for import`);

    // Convert CSV data to our types
    const menuItems = limitedRecords.map(csvToMenuItem);
    const categories = extractCategories(menuItems);

    console.log(`📊 Extracted ${categories.length} categories:`, categories.map(c => c.name));

    // Clear existing data
    await clearCollections();

    // Import to Firestore
    await importToFirestore(menuItems, categories);

    console.log('🎉 Menu import completed successfully!');
    console.log(`📈 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Menu Items: ${menuItems.length}`);
    console.log(`   - Total Option Groups: ${menuItems.reduce((sum, item) => sum + item.optionGroups.length, 0)}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import if called directly
if (require.main === module) {
  const csvFilePath = process.argv[2];
  if (!csvFilePath) {
    console.error('❌ Please provide CSV file path as argument');
    console.log('Usage: npx tsx scripts/import-menu.ts <csv-file-path>');
    process.exit(1);
  }

  importMenu(csvFilePath);
}

export { importMenu, parseOptionGroup, csvToMenuItem, extractCategories };