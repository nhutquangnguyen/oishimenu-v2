import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, collection, doc, writeBatch, addDoc, setDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import type { MenuItem, MenuCategory } from '@/lib/types/menu';

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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

interface CSVRow {
  [key: string]: string;
}

export async function POST(request: NextRequest) {
  try {
    const { csvData } = await request.json();

    if (!csvData || !Array.isArray(csvData)) {
      return NextResponse.json({ error: 'Invalid CSV data' }, { status: 400 });
    }

    const processedItems: MenuItem[] = [];
    const processedCategories: Set<string> = new Set();
    const errors: string[] = [];

    // Process each row
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i] as CSVRow;

      try {
        // Validate required fields
        if (!row['*ItemName'] || !row['*Price'] || !row['*CategoryName'] || !row['*AvailableStatus']) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        // Parse price
        const price = parseInt(row['*Price']);
        if (isNaN(price) || price < 0) {
          errors.push(`Row ${i + 2}: Invalid price value`);
          continue;
        }

        // Validate availability status
        const availableStatus = row['*AvailableStatus'] as MenuItem['availableStatus'];
        if (!['AVAILABLE', 'UNAVAILABLE_TODAY', 'UNAVAILABLE_PERMANENTLY'].includes(availableStatus)) {
          errors.push(`Row ${i + 2}: Invalid availability status`);
          continue;
        }

        // Create menu item
        const menuItem: MenuItem = {
          id: row['*ItemID'] || `item-${Date.now()}-${i}`,
          name: row['*ItemName'].trim(),
          price: price,
          categoryName: row['*CategoryName'].trim(),
          availabilitySchedule: row['AvailabilitySchedule'] || undefined,
          availableStatus: availableStatus,
          description: row['Description'] || undefined,
          photos: [
            row['Photo1'],
            row['Photo2'],
            row['Photo3'],
            row['Photo4']
          ].filter(photo => photo && photo.trim() !== ''),
          optionGroups: [], // Option groups would need to be handled separately
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        processedItems.push(menuItem);
        processedCategories.add(row['*CategoryName'].trim());

      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (processedItems.length === 0) {
      return NextResponse.json({
        error: 'No valid items to process',
        errors: errors
      }, { status: 400 });
    }

    // Save to Firebase
    const batch = writeBatch(db);
    let operationCount = 0;

    // Create categories first
    for (const categoryName of processedCategories) {
      const categoryRef = doc(collection(db, 'menu-categories'), `category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
      const category: MenuCategory = {
        id: `category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
        name: categoryName,
        displayOrder: Array.from(processedCategories).indexOf(categoryName) + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      batch.set(categoryRef, category);
      operationCount++;

      // Commit batch if approaching limit
      if (operationCount >= 450) {
        await batch.commit();
        operationCount = 0;
      }
    }

    // Add menu items
    for (const item of processedItems) {
      const itemRef = doc(collection(db, 'menu-items'), item.id);
      batch.set(itemRef, item);
      operationCount++;

      // Commit batch if approaching limit
      if (operationCount >= 450) {
        await batch.commit();
        operationCount = 0;
      }
    }

    // Commit remaining operations
    if (operationCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${processedItems.length} items`,
      itemsProcessed: processedItems.length,
      categoriesCreated: processedCategories.size,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}