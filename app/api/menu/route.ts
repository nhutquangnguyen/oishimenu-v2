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

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'add-item':
        return await addMenuItem(data);
      case 'add-category':
        return await addMenuCategory(data);
      case 'add-batch':
        return await addMenuBatch(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Add timestamps
    const menuItemWithTimestamps = {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Use addDoc to auto-generate an ID
    const docRef = await addDoc(collection(db, 'menu-items'), menuItemWithTimestamps);

    return NextResponse.json({
      success: true,
      message: 'Menu item added successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json(
      { error: 'Failed to add menu item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function addMenuCategory(category: MenuCategory) {
  try {
    const docRef = doc(collection(db, 'menu-categories'), category.id);
    await setDoc(docRef, category);

    return NextResponse.json({
      success: true,
      message: 'Menu category added successfully',
      id: category.id
    });
  } catch (error) {
    console.error('Error adding menu category:', error);
    return NextResponse.json(
      { error: 'Failed to add menu category', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function addMenuBatch(data: { items: MenuItem[], categories: MenuCategory[] }) {
  try {
    const batch = writeBatch(db);
    let operationCount = 0;

    // Add categories first
    for (const category of data.categories) {
      const categoryRef = doc(collection(db, 'menu-categories'), category.id);
      batch.set(categoryRef, category);
      operationCount++;

      // Firestore batch limit is 500 operations
      if (operationCount >= 450) {
        await batch.commit();
        console.log(`Committed batch with ${operationCount} operations`);
        operationCount = 0;
      }
    }

    // Add menu items
    for (const item of data.items) {
      const itemRef = doc(collection(db, 'menu-items'), item.id);
      batch.set(itemRef, item);
      operationCount++;

      // Firestore batch limit is 500 operations
      if (operationCount >= 450) {
        await batch.commit();
        console.log(`Committed batch with ${operationCount} operations`);
        operationCount = 0;
      }
    }

    // Commit remaining operations
    if (operationCount > 0) {
      await batch.commit();
      console.log(`Committed final batch with ${operationCount} operations`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${data.categories.length} categories and ${data.items.length} menu items`,
      categories: data.categories.length,
      items: data.items.length
    });
  } catch (error) {
    console.error('Error adding menu batch:', error);
    return NextResponse.json(
      { error: 'Failed to add menu batch', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}