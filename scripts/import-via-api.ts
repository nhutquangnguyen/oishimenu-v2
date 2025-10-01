import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import type { MenuItem, MenuCategory, OptionGroup, MenuOption, CSVMenuItem } from '../lib/types/menu';

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
 * Call API to add menu data
 */
async function callMenuAPI(action: string, data: any) {
  const response = await fetch('http://localhost:3000/api/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API call failed: ${errorData.error} - ${errorData.details || ''}`);
  }

  return await response.json();
}

/**
 * Main import function using API
 */
async function importMenuViaAPI(csvFilePath: string, limit: number = 10) {
  try {
    console.log('🚀 Starting menu import via API...');
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

    // Take only specified number of items
    const limitedRecords = validRecords.slice(0, limit);
    console.log(`🔢 Using top ${limitedRecords.length} items for import`);

    // Convert CSV data to our types
    const menuItems = limitedRecords.map(csvToMenuItem);
    const categories = extractCategories(menuItems);

    console.log(`📊 Will create:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Menu Items: ${menuItems.length}`);

    // Add categories first
    console.log('\n📂 Adding categories...');
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      console.log(`  ${i + 1}/${categories.length}: ${category.name}`);

      try {
        const result = await callMenuAPI('add-category', category);
        console.log(`  ✅ ${result.message}`);
      } catch (error) {
        console.error(`  ❌ Failed to add category: ${error}`);
      }
    }

    // Add menu items one by one
    console.log('\n🍽️ Adding menu items...');
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      console.log(`  ${i + 1}/${menuItems.length}: ${item.name}`);

      try {
        const result = await callMenuAPI('add-item', item);
        console.log(`  ✅ ${result.message}`);
      } catch (error) {
        console.error(`  ❌ Failed to add item: ${error}`);
      }

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Menu import completed!');
    console.log(`📈 Summary:`);
    console.log(`   - Categories added: ${categories.length}`);
    console.log(`   - Menu items added: ${menuItems.length}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import if called directly
if (require.main === module) {
  const csvFilePath = process.argv[2];
  const limitStr = process.argv[3];
  const limit = limitStr ? parseInt(limitStr, 10) : 10;

  if (!csvFilePath) {
    console.error('❌ Please provide CSV file path as argument');
    console.log('Usage: npx tsx scripts/import-via-api.ts <csv-file-path> [limit]');
    console.log('Example: npx tsx scripts/import-via-api.ts menu.csv 5');
    process.exit(1);
  }

  if (isNaN(limit) || limit <= 0) {
    console.error('❌ Invalid limit. Please provide a positive number.');
    process.exit(1);
  }

  importMenuViaAPI(csvFilePath, limit);
}

export { importMenuViaAPI };