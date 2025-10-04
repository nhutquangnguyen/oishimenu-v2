import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getMenuItems, getMenuCategories } from '../lib/services/menu'

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

async function testMenuDataSync() {
  console.log('🧪 Testing Menu Data Synchronization')
  console.log('=====================================\n')

  try {
    // Test the same data loading that POS component uses
    console.log('📱 Loading POS-style data (with availableOnly: true)...')
    const posData = await getMenuItems({
      availableOnly: true,
      sortBy: 'name',
      sortOrder: 'asc'
    })

    console.log(`✅ POS loaded ${posData.length} items:`)
    posData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - ₫${item.price?.toLocaleString()} (${item.categoryName || 'No category'})`)
    })

    console.log('\n📋 Loading Menu-style data (all items)...')
    const menuData = await getMenuItems({
      sortBy: 'name',
      sortOrder: 'asc'
    })

    console.log(`✅ Menu loaded ${menuData.length} items:`)
    menuData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - ₫${item.price?.toLocaleString()} (${item.categoryName || 'No category'})`)
    })

    console.log('\n🏷️ Loading categories...')
    const categories = await getMenuCategories()
    console.log(`✅ Found ${categories.length} categories:`)
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (visible: ${cat.isVisible}, active: ${cat.isActive})`)
    })

    console.log('\n🔍 Analysis:')
    console.log(`   POS shows ${posData.length} items (available only)`)
    console.log(`   Menu shows ${menuData.length} items (all items)`)

    if (posData.length !== menuData.length) {
      console.log('   ⚠️  Different counts - some items may be unavailable')
      const unavailableItems = menuData.filter(item =>
        !posData.find(posItem => posItem.id === item.id)
      )
      if (unavailableItems.length > 0) {
        console.log('   📝 Unavailable items:')
        unavailableItems.forEach(item => {
          console.log(`      - ${item.name} (status: ${item.availableStatus})`)
        })
      }
    } else {
      console.log('   ✅ Both components should show the same data')
    }

  } catch (error) {
    console.error('❌ Error testing menu data:', error)
    throw error
  }
}

// Export for direct execution
if (require.main === module) {
  testMenuDataSync()
    .then(() => {
      console.log('\n✅ Menu data sync test completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Menu data sync test failed:', error)
      process.exit(1)
    })
}

export { testMenuDataSync }