// Load environment variables manually
require('dotenv').config({ path: '.env.local' });

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

console.log('🔍 Simple Firebase Test');
console.log('======================');

// Firebase configuration with explicit environment variable loading
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('📋 Configuration:');
console.log('  Project ID:', firebaseConfig.projectId);
console.log('  API Key:', firebaseConfig.apiKey ? 'Set ✅' : 'Missing ❌');
console.log('  Auth Domain:', firebaseConfig.authDomain);

async function simpleTest() {
  try {
    // Initialize Firebase
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    console.log('\n✅ Firebase initialized successfully');

    // Test 1: Read existing data
    console.log('\n📖 Testing read access...');
    const menuItemsRef = collection(db, 'menu-items');
    const snapshot = await getDocs(menuItemsRef);
    console.log(`✅ Can read menu-items collection (${snapshot.size} documents)`);

    // Test 2: Add a very simple document
    console.log('\n✍️ Testing write access...');
    const simpleDoc = {
      name: 'Test Item',
      price: 25000,
      category: 'Test',
      status: 'AVAILABLE',
      created: new Date().toISOString(), // Use ISO string instead of Date object
    };

    const docId = 'test-' + Date.now();
    const docRef = doc(collection(db, 'menu-items'), docId);

    await setDoc(docRef, simpleDoc);
    console.log('✅ Successfully wrote test document:', docId);

    // Test 3: Verify the document was created
    const verifySnapshot = await getDocs(menuItemsRef);
    console.log(`✅ Verification: ${verifySnapshot.size} documents now in collection`);

    console.log('\n🎉 All tests passed! Firebase is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);

    if (error instanceof Error) {
      console.log('Error details:', {
        message: error.message,
        code: (error as any).code,
        name: error.name
      });
    }
  }
}

simpleTest();