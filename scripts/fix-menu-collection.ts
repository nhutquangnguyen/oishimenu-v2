import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDv48Hr01iZ2kMna_kQkdsRPi1Wq6PInfs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "oishimenu-g-c6fd5.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "oishimenu-g-c6fd5",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "oishimenu-g-c6fd5.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "530239620821",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:530239620821:web:a94ccac71b1dcdc5bc845c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3DD9PLTRG5",
}

// Firebase setup
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

async function fixMenuCollection() {
  console.log('🔧 Fixing Menu Collection Names')
  console.log('================================\n')

  try {
    // Check data in menuItems (camelCase) collection
    console.log('1. Checking menuItems collection...')
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'))
    console.log(`   Found ${menuItemsSnapshot.docs.length} items in 'menuItems'`)

    if (menuItemsSnapshot.docs.length > 0) {
      console.log('   Items in menuItems:')
      menuItemsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`     ${index + 1}. ${data.name} - ₫${data.price?.toLocaleString()}`)
      })
    }

    // Check data in menu-items (kebab-case) collection
    console.log('\n2. Checking menu-items collection...')
    const menuItemsKebabSnapshot = await getDocs(collection(db, 'menu-items'))
    console.log(`   Found ${menuItemsKebabSnapshot.docs.length} items in 'menu-items'`)

    if (menuItemsKebabSnapshot.docs.length > 0) {
      console.log('   Items in menu-items:')
      menuItemsKebabSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`     ${index + 1}. ${data.name} - ₫${data.price?.toLocaleString()}`)
      })
    }

    // Copy data from menuItems to menu-items if needed
    if (menuItemsSnapshot.docs.length > 0 && menuItemsKebabSnapshot.docs.length === 0) {
      console.log('\n3. Copying data from menuItems to menu-items...')

      for (const docSnap of menuItemsSnapshot.docs) {
        const data = docSnap.data()

        // Transform the data to match expected format
        const transformedData = {
          id: docSnap.id,
          name: data.name,
          description: data.description || '',
          price: data.price,
          categoryName: data.category,
          availableStatus: data.available ? 'AVAILABLE' : 'UNAVAILABLE',
          photos: data.image ? [data.image] : [],
          ingredients: data.ingredients || [],
          optionGroups: data.optionGroups || [],
          createdAt: data.createdAt || new Date(),
          updatedAt: data.updatedAt || new Date(),
          createdBy: data.createdBy,
          userId: data.userId
        }

        await addDoc(collection(db, 'menu-items'), transformedData)
        console.log(`   ✅ Copied: ${data.name}`)
      }

      console.log('\n✅ Data copy completed!')
    }

    // Create default categories if needed
    console.log('\n4. Checking menu-categories collection...')
    const categoriesSnapshot = await getDocs(collection(db, 'menu-categories'))
    console.log(`   Found ${categoriesSnapshot.docs.length} categories in 'menu-categories'`)

    if (categoriesSnapshot.docs.length === 0) {
      console.log('\n5. Creating default categories...')

      const categories = [
        { name: 'Main Dishes', displayOrder: 1, isVisible: true, isActive: true },
        { name: 'Sandwiches', displayOrder: 2, isVisible: true, isActive: true },
        { name: 'Beverages', displayOrder: 3, isVisible: true, isActive: true },
        { name: 'Appetizers', displayOrder: 4, isVisible: true, isActive: true }
      ]

      for (const category of categories) {
        const categoryData = {
          ...category,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        await addDoc(collection(db, 'menu-categories'), categoryData)
        console.log(`   ✅ Created category: ${category.name}`)
      }
    }

    console.log('\n🎉 Menu collection fix completed!')

  } catch (error) {
    console.error('❌ Error fixing menu collection:', error)
    throw error
  }
}

// Export for direct execution
if (require.main === module) {
  fixMenuCollection()
    .then(() => {
      console.log('Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}

export { fixMenuCollection }