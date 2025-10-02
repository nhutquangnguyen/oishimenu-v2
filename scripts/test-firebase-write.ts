#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testFirebaseWrite() {
  console.log('🧪 Testing Firebase write with minimal data...')

  try {
    // Test 1: Simple category
    console.log('1. Testing category write...')
    const testCategory = {
      id: 'test_category',
      name: 'Test Category',
      displayOrder: 0,
      isActive: true,
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    }

    await setDoc(doc(db, 'menuCategories', 'test_category'), testCategory)
    console.log('✅ Category write successful')

    // Test 2: Simple menu item
    console.log('2. Testing menu item write...')
    const testMenuItem = {
      id: 'test_item_123',
      name: 'Test Item',
      price: 25000,
      categoryName: 'Test Category',
      availableStatus: 'AVAILABLE',
      description: 'Test description',
      photos: ['https://example.com/photo.jpg'],
      optionGroups: [],
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    }

    await setDoc(doc(db, 'menuItems', 'test_item_123'), testMenuItem)
    console.log('✅ Menu item write successful')

    // Test 3: Menu item with option groups
    console.log('3. Testing menu item with option groups...')
    const testMenuItemWithOptions = {
      id: 'test_item_456',
      name: 'Test Item With Options',
      price: 35000,
      categoryName: 'Test Category',
      availableStatus: 'AVAILABLE',
      description: 'Test item with options',
      photos: [],
      optionGroups: [
        {
          name: 'Size',
          minSelection: 1,
          maxSelection: 1,
          options: [
            { name: 'Large', price: 5000 },
            { name: 'Medium', price: 0 }
          ]
        }
      ],
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    }

    await setDoc(doc(db, 'menuItems', 'test_item_456'), testMenuItemWithOptions)
    console.log('✅ Menu item with options write successful')

    console.log('🎉 All Firebase tests passed!')

  } catch (error) {
    console.error('❌ Firebase write test failed:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    await testFirebaseWrite()
    process.exit(0)
  } catch (error) {
    console.error('💥 Test failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}