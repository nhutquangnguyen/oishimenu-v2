import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔍 Firebase Configuration Diagnostics');
console.log('=====================================');

// Check configuration
console.log('📋 Configuration Check:');
Object.entries(firebaseConfig).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
});

async function runDiagnostics() {
  try {
    // Initialize Firebase
    console.log('\n🚀 Initializing Firebase...');
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    console.log('✅ Firebase app initialized');

    // Initialize Firestore
    console.log('\n🗄️ Initializing Firestore...');
    const db = getFirestore(app);
    console.log('✅ Firestore initialized');

    // Test 1: Check if we can create a collection reference
    console.log('\n📁 Test 1: Collection Reference Test');
    try {
      const testCollection = collection(db, 'test-collection');
      console.log('✅ Can create collection reference');
    } catch (error) {
      console.log('❌ Cannot create collection reference:', error);
      return;
    }

    // Test 2: Try to read from a collection (this tests permissions)
    console.log('\n📖 Test 2: Read Permission Test');
    try {
      const testCollection = collection(db, 'test-collection');
      const snapshot = await getDocs(testCollection);
      console.log(`✅ Can read collection (${snapshot.size} documents found)`);
    } catch (error) {
      console.log('❌ Cannot read collection:', error);

      if (error instanceof Error) {
        if (error.message.includes('NOT_FOUND')) {
          console.log('💡 This suggests either:');
          console.log('   - Firestore database is not enabled in Firebase Console');
          console.log('   - Project ID is incorrect');
          console.log('   - Database doesn\'t exist');
        } else if (error.message.includes('PERMISSION_DENIED')) {
          console.log('💡 This suggests:');
          console.log('   - Firestore security rules are blocking access');
          console.log('   - Authentication is required but not provided');
        }
      }
      return;
    }

    // Test 3: Try to write a simple document
    console.log('\n✍️ Test 3: Write Permission Test');
    try {
      const testDoc = {
        message: 'Hello from diagnostics',
        timestamp: new Date(),
        test: true
      };

      const docRef = await addDoc(collection(db, 'test-collection'), testDoc);
      console.log('✅ Can write documents, ID:', docRef.id);

      // Clean up - try to delete the test document
      try {
        // Note: We're not deleting here to avoid permission issues
        console.log('✅ Test document created successfully');
      } catch (cleanupError) {
        console.log('⚠️ Created test document but couldn\'t clean up');
      }

    } catch (error) {
      console.log('❌ Cannot write documents:', error);

      if (error instanceof Error) {
        if (error.message.includes('PERMISSION_DENIED')) {
          console.log('💡 Write permission denied. Check Firestore security rules.');
        }
      }
    }

    // Test 4: Test menu collections specifically
    console.log('\n🍽️ Test 4: Menu Collections Test');
    try {
      const menuItems = collection(db, 'menu-items');
      const menuCategories = collection(db, 'menu-categories');

      const [itemsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(menuItems),
        getDocs(menuCategories)
      ]);

      console.log(`✅ Menu items collection: ${itemsSnapshot.size} documents`);
      console.log(`✅ Menu categories collection: ${categoriesSnapshot.size} documents`);

      if (itemsSnapshot.size === 0 && categoriesSnapshot.size === 0) {
        console.log('💡 Collections exist but are empty - this is normal for a new setup');
      }

    } catch (error) {
      console.log('❌ Cannot access menu collections:', error);
    }

    // Test 5: Try adding a simple menu item
    console.log('\n🧪 Test 5: Add Test Menu Item');
    try {
      const testMenuItem = {
        id: 'test-item-' + Date.now(),
        name: 'Test Coffee',
        price: 25000,
        categoryName: 'Test Category',
        availableStatus: 'AVAILABLE',
        description: 'Test item from diagnostics',
        photos: [],
        optionGroups: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = doc(collection(db, 'menu-items'), testMenuItem.id);
      await setDoc(docRef, testMenuItem);
      console.log('✅ Successfully added test menu item:', testMenuItem.id);

    } catch (error) {
      console.log('❌ Failed to add test menu item:', error);
    }

    console.log('\n🎉 Diagnostics completed!');

  } catch (error) {
    console.error('❌ Fatal error during diagnostics:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key not valid')) {
        console.log('💡 Invalid API key - check your Firebase configuration');
      } else if (error.message.includes('Project not found')) {
        console.log('💡 Project not found - check your project ID');
      }
    }
  }
}

// Run diagnostics
runDiagnostics().catch(console.error);