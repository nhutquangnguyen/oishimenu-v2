// Load environment variables
require('dotenv').config({ path: '.env.local' });

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🧪 Testing Firebase with Current Rules');
console.log('=====================================');
console.log('Project:', firebaseConfig.projectId);

async function testFirebase() {
  try {
    // Initialize
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    console.log('✅ Firebase initialized');

    // Test 1: Simple write test
    console.log('\n📝 Test 1: Adding a simple document...');
    const testDoc = {
      name: 'Test Coffee',
      price: 25000,
      createdAt: new Date().toISOString()
    };

    // Use addDoc which auto-generates ID
    const docRef = await addDoc(collection(db, 'test-items'), testDoc);
    console.log('✅ Document added with ID:', docRef.id);

    // Test 2: Read it back
    console.log('\n📖 Test 2: Reading documents...');
    const snapshot = await getDocs(collection(db, 'test-items'));
    console.log(`✅ Found ${snapshot.size} documents`);

    snapshot.forEach(doc => {
      console.log('  -', doc.id, ':', doc.data());
    });

    // Test 3: Add to menu-items collection
    console.log('\n🍽️ Test 3: Adding to menu-items collection...');
    const menuItem = {
      id: 'test-menu-' + Date.now(),
      name: 'Cà Phê Sữa Đá',
      price: 25000,
      categoryName: 'Cà Phê - Coffee',
      availableStatus: 'AVAILABLE',
      description: 'Traditional Vietnamese iced coffee with condensed milk',
      photos: [],
      optionGroups: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const menuDocRef = doc(collection(db, 'menu-items'), menuItem.id);
    await setDoc(menuDocRef, menuItem);
    console.log('✅ Menu item added:', menuItem.id);

    // Test 4: Verify menu items
    console.log('\n📋 Test 4: Checking menu-items collection...');
    const menuSnapshot = await getDocs(collection(db, 'menu-items'));
    console.log(`✅ Menu items collection has ${menuSnapshot.size} documents`);

    console.log('\n🎉 ALL TESTS PASSED! Firebase is working correctly.');
    console.log('💡 You can now use the app menu interface to add items.');

  } catch (error) {
    console.error('❌ Test failed:', error);

    if (error instanceof Error) {
      console.log('\n🔍 Error Analysis:');
      console.log('Message:', error.message);
      console.log('Name:', error.name);
      if ('code' in error) {
        console.log('Code:', (error as any).code);
      }

      // Specific error guidance
      if (error.message.includes('not-found')) {
        console.log('\n💡 NOT_FOUND suggests:');
        console.log('1. Firestore database not fully enabled');
        console.log('2. Go to Firebase Console → Firestore Database');
        console.log('3. Make sure you see collections view, not "Get Started" button');
      }
    }
  }
}

testFirebase();