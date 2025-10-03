import { initializeApp, getApps } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc, collection, getDocs, writeBatch, query, where } from 'firebase/firestore'

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
const auth = getAuth(app)
const db = getFirestore(app)

const TEST_EMAIL = 'test@gmail.com'
const TEST_PASSWORD = 'test123'
const TEST_NAME = 'Test User'
const SOURCE_EMAIL = 'nguyenquang.btr@gmail.com'

interface UserData {
  uid: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
  storeId?: string
  createdAt: Date
  updatedAt: Date
}

async function createTestAccount() {
  console.log('🔥 Creating test account...')

  try {
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD)
    const user = userCredential.user
    console.log(`✅ Created Firebase auth user: ${user.uid}`)

    // Update display name
    await updateProfile(user, { displayName: TEST_NAME })
    console.log('✅ Updated user profile')

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: TEST_EMAIL,
      name: TEST_NAME,
      role: 'admin', // Give admin role for testing
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await setDoc(doc(db, 'users', user.uid), userData)
    console.log('✅ Created user document in Firestore')

    return user.uid
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ Test account already exists, proceeding with data copy...')
      // Find existing user by email
      const usersQuery = query(collection(db, 'users'), where('email', '==', TEST_EMAIL))
      const usersSnapshot = await getDocs(usersQuery)

      if (!usersSnapshot.empty) {
        const existingUser = usersSnapshot.docs[0]
        console.log(`✅ Found existing user: ${existingUser.id}`)
        return existingUser.id
      }
    }
    throw error
  }
}

async function findSourceUser() {
  console.log(`🔍 Finding source user: ${SOURCE_EMAIL}`)

  const usersQuery = query(collection(db, 'users'), where('email', '==', SOURCE_EMAIL))
  const usersSnapshot = await getDocs(usersQuery)

  if (usersSnapshot.empty) {
    throw new Error(`Source user ${SOURCE_EMAIL} not found`)
  }

  const sourceUser = usersSnapshot.docs[0]
  console.log(`✅ Found source user: ${sourceUser.id}`)
  return sourceUser.id
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
    return
  }

  console.log(`📋 Found ${menuItems.length} menu items to copy`)

  // Create batch for menu items
  const batch = writeBatch(db)

  menuItems.forEach(doc => {
    const data = doc.data()
    const newDocRef = doc(db, 'menuItems', doc.id + '_test') // Add suffix to avoid conflicts

    // Update the data to belong to test user
    const updatedData = {
      ...data,
      createdBy: targetUserId,
      userId: targetUserId,
      updatedAt: new Date(),
      // Keep original timestamps for reference
      originalCreatedAt: data.createdAt,
      originalUpdatedAt: data.updatedAt
    }

    batch.set(newDocRef, updatedData)
  })

  await batch.commit()
  console.log(`✅ Copied ${menuItems.length} menu items`)
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
    return
  }

  console.log(`🛒 Found ${orders.length} orders to copy`)

  // Create batch for orders (Firebase batch limit is 500)
  const batchSize = 450 // Stay under limit

  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = writeBatch(db)
    const ordersBatch = orders.slice(i, i + batchSize)

    ordersBatch.forEach(doc => {
      const data = doc.data()
      const newDocRef = doc(db, 'orders', doc.id + '_test') // Add suffix to avoid conflicts

      // Update the data to belong to test user
      const updatedData = {
        ...data,
        createdBy: targetUserId,
        userId: targetUserId,
        updatedAt: new Date(),
        // Keep original timestamps for reference
        originalCreatedAt: data.createdAt,
        originalUpdatedAt: data.updatedAt
      }

      batch.set(newDocRef, updatedData)
    })

    await batch.commit()
    console.log(`✅ Copied batch ${i + 1}-${Math.min(i + batchSize, orders.length)} orders`)
  }

  console.log(`✅ Copied ${orders.length} orders total`)
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
    return
  }

  console.log(`📦 Found ${inventoryItems.length} inventory items to copy`)

  const batch = writeBatch(db)

  inventoryItems.forEach(doc => {
    const data = doc.data()
    const newDocRef = doc(db, 'inventory', doc.id + '_test')

    const updatedData = {
      ...data,
      createdBy: targetUserId,
      userId: targetUserId,
      updatedAt: new Date(),
      originalCreatedAt: data.createdAt,
      originalUpdatedAt: data.updatedAt
    }

    batch.set(newDocRef, updatedData)
  })

  await batch.commit()
  console.log(`✅ Copied ${inventoryItems.length} inventory items`)
}

async function main() {
  console.log('🚀 Starting test account setup...')
  console.log(`📧 Email: ${TEST_EMAIL}`)
  console.log(`🔑 Password: ${TEST_PASSWORD}`)
  console.log(`👤 Name: ${TEST_NAME}`)
  console.log(`📋 Source data from: ${SOURCE_EMAIL}`)
  console.log('')

  try {
    // Step 1: Create test account
    const targetUserId = await createTestAccount()

    // Step 2: Find source user
    const sourceUserId = await findSourceUser()

    // Step 3: Copy data
    await copyMenuData(sourceUserId, targetUserId)
    await copyOrderData(sourceUserId, targetUserId)
    await copyInventoryData(sourceUserId, targetUserId)

    console.log('')
    console.log('🎉 Test account setup completed successfully!')
    console.log('📋 Login credentials:')
    console.log(`   Email: ${TEST_EMAIL}`)
    console.log(`   Password: ${TEST_PASSWORD}`)
    console.log('')
    console.log('✅ You can now log in with these credentials and access copied data')

  } catch (error) {
    console.error('❌ Error setting up test account:', error)
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

export { main as createTestAccount }