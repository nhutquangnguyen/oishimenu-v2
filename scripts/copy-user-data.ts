import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, writeBatch, query, where, doc } from 'firebase/firestore'

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

const SOURCE_EMAIL = 'nguyenquang.btr@gmail.com'
const TARGET_EMAIL = 'test@gmail.com'

interface UserData {
  uid: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
  storeId?: string
  createdAt: any
  updatedAt: any
}

async function findUserByEmail(email: string): Promise<string | null> {
  console.log(`🔍 Finding user: ${email}`)

  const usersQuery = query(collection(db, 'users'), where('email', '==', email))
  const usersSnapshot = await getDocs(usersQuery)

  if (usersSnapshot.empty) {
    console.log(`❌ User ${email} not found`)
    return null
  }

  const user = usersSnapshot.docs[0]
  console.log(`✅ Found user: ${user.id}`)
  return user.id
}

async function copyMenuData(sourceUserId: string, targetUserId: string) {
  console.log('📋 Copying menu data...')

  // Get all menu items from source user
  const menuSnapshot = await getDocs(collection(db, 'menuItems'))
  const menuItems = menuSnapshot.docs.filter(doc => {
    const data = doc.data()
    return data.createdBy === sourceUserId || data.userId === sourceUserId
  })

  if (menuItems.length === 0) {
    console.log('⚠️ No menu items found for source user')
    return 0
  }

  console.log(`📋 Found ${menuItems.length} menu items to copy`)

  // Create batch for menu items
  const batch = writeBatch(db)
  let itemCount = 0

  menuItems.forEach(docSnap => {
    const data = docSnap.data()
    const newDocRef = doc(collection(db, 'menuItems')) // Let Firestore generate new ID

    // Update the data to belong to test user
    const updatedData = {
      ...data,
      createdBy: targetUserId,
      userId: targetUserId,
      updatedAt: new Date(),
      // Keep original timestamps for reference
      originalCreatedAt: data.createdAt,
      originalUpdatedAt: data.updatedAt,
      originalDocId: docSnap.id
    }

    batch.set(newDocRef, updatedData)
    itemCount++
  })

  await batch.commit()
  console.log(`✅ Copied ${itemCount} menu items`)
  return itemCount
}

async function copyOrderData(sourceUserId: string, targetUserId: string) {
  console.log('🛒 Copying order data...')

  // Get all orders from source user
  const ordersSnapshot = await getDocs(collection(db, 'orders'))
  const orders = ordersSnapshot.docs.filter(doc => {
    const data = doc.data()
    return data.createdBy === sourceUserId || data.userId === sourceUserId
  })

  if (orders.length === 0) {
    console.log('⚠️ No orders found for source user')
    return 0
  }

  console.log(`🛒 Found ${orders.length} orders to copy`)

  // Create batch for orders (Firebase batch limit is 500)
  const batchSize = 450 // Stay under limit
  let totalCopied = 0

  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = writeBatch(db)
    const ordersBatch = orders.slice(i, i + batchSize)

    ordersBatch.forEach(docSnap => {
      const data = docSnap.data()
      const newDocRef = doc(collection(db, 'orders')) // Let Firestore generate new ID

      // Update the data to belong to test user
      const updatedData = {
        ...data,
        createdBy: targetUserId,
        userId: targetUserId,
        updatedAt: new Date(),
        // Keep original timestamps for reference
        originalCreatedAt: data.createdAt,
        originalUpdatedAt: data.updatedAt,
        originalDocId: docSnap.id
      }

      batch.set(newDocRef, updatedData)
      totalCopied++
    })

    await batch.commit()
    console.log(`✅ Copied batch ${i + 1}-${Math.min(i + batchSize, orders.length)} orders`)
  }

  console.log(`✅ Copied ${totalCopied} orders total`)
  return totalCopied
}

async function copyInventoryData(sourceUserId: string, targetUserId: string) {
  console.log('📦 Copying inventory data...')

  // Get all inventory items from source user
  const inventorySnapshot = await getDocs(collection(db, 'inventory'))
  const inventoryItems = inventorySnapshot.docs.filter(doc => {
    const data = doc.data()
    return data.createdBy === sourceUserId || data.userId === sourceUserId
  })

  if (inventoryItems.length === 0) {
    console.log('⚠️ No inventory items found for source user')
    return 0
  }

  console.log(`📦 Found ${inventoryItems.length} inventory items to copy`)

  const batch = writeBatch(db)
  let itemCount = 0

  inventoryItems.forEach(docSnap => {
    const data = docSnap.data()
    const newDocRef = doc(collection(db, 'inventory')) // Let Firestore generate new ID

    const updatedData = {
      ...data,
      createdBy: targetUserId,
      userId: targetUserId,
      updatedAt: new Date(),
      originalCreatedAt: data.createdAt,
      originalUpdatedAt: data.updatedAt,
      originalDocId: docSnap.id
    }

    batch.set(newDocRef, updatedData)
    itemCount++
  })

  await batch.commit()
  console.log(`✅ Copied ${itemCount} inventory items`)
  return itemCount
}

async function main() {
  console.log('🚀 Starting data copy process...')
  console.log(`📋 Source user: ${SOURCE_EMAIL}`)
  console.log(`🎯 Target user: ${TARGET_EMAIL}`)
  console.log('')

  try {
    // Step 1: Find source user
    const sourceUserId = await findUserByEmail(SOURCE_EMAIL)
    if (!sourceUserId) {
      throw new Error(`Source user ${SOURCE_EMAIL} not found`)
    }

    // Step 2: Find target user
    const targetUserId = await findUserByEmail(TARGET_EMAIL)
    if (!targetUserId) {
      throw new Error(`Target user ${TARGET_EMAIL} not found. Please create the account first at http://localhost:3000/signup`)
    }

    console.log('')
    console.log('📋 Starting data copy...')

    // Step 3: Copy data
    const menuCount = await copyMenuData(sourceUserId, targetUserId)
    const orderCount = await copyOrderData(sourceUserId, targetUserId)
    const inventoryCount = await copyInventoryData(sourceUserId, targetUserId)

    console.log('')
    console.log('🎉 Data copy completed successfully!')
    console.log('📊 Summary:')
    console.log(`   📋 Menu items copied: ${menuCount}`)
    console.log(`   🛒 Orders copied: ${orderCount}`)
    console.log(`   📦 Inventory items copied: ${inventoryCount}`)
    console.log('')
    console.log('✅ You can now log in with:')
    console.log(`   Email: ${TARGET_EMAIL}`)
    console.log(`   Password: test123`)

  } catch (error) {
    console.error('❌ Error copying data:', error)
    throw error
  }
}

// Export for direct execution
if (require.main === module) {
  main()
    .then(() => {
      console.log('Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}

export { main as copyUserData }