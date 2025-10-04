import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

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

async function checkAllUsers() {
  console.log('👥 Checking all users in database...')

  const usersSnapshot = await getDocs(collection(db, 'users'))

  console.log(`📊 Found ${usersSnapshot.docs.length} users total`)
  console.log('')

  usersSnapshot.docs.forEach((doc, index) => {
    const data = doc.data()
    console.log(`${index + 1}. User ID: ${doc.id}`)
    console.log(`   Email: ${data.email}`)
    console.log(`   Name: ${data.name}`)
    console.log(`   Role: ${data.role}`)
    console.log(`   Created: ${data.createdAt?.toDate?.() || data.createdAt}`)
    console.log('')
  })
}

async function checkMenuData() {
  console.log('📋 Checking menu data by user...')

  const menuSnapshot = await getDocs(collection(db, 'menuItems'))
  const usersSnapshot = await getDocs(collection(db, 'users'))

  console.log(`📊 Found ${menuSnapshot.docs.length} menu items total`)
  console.log('')

  // Group by user
  const menuByUser: { [key: string]: any[] } = {}

  menuSnapshot.docs.forEach(doc => {
    const data = doc.data()
    const userId = data.createdBy || data.userId

    if (userId) {
      if (!menuByUser[userId]) {
        menuByUser[userId] = []
      }
      menuByUser[userId].push({
        id: doc.id,
        name: data.name,
        price: data.price,
        category: data.category,
        createdAt: data.createdAt
      })
    }
  })

  // Find user emails
  const userEmails: { [key: string]: string } = {}
  usersSnapshot.docs.forEach(doc => {
    const data = doc.data()
    userEmails[doc.id] = data.email
  })

  console.log('📋 Menu items by user:')
  Object.keys(menuByUser).forEach(userId => {
    const email = userEmails[userId] || 'Unknown email'
    const items = menuByUser[userId]

    console.log(`\n🍽️  ${email} (${userId}):`)
    console.log(`   📊 ${items.length} menu items`)

    items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - ₫${item.price?.toLocaleString()} (${item.category})`)
    })
  })

  if (Object.keys(menuByUser).length === 0) {
    console.log('⚠️  No menu items found for any user')
  }
}

async function checkOrderData() {
  console.log('\n🛒 Checking order data by user...')

  const ordersSnapshot = await getDocs(collection(db, 'orders'))
  const usersSnapshot = await getDocs(collection(db, 'users'))

  console.log(`📊 Found ${ordersSnapshot.docs.length} orders total`)

  // Group by user
  const ordersByUser: { [key: string]: any[] } = {}

  ordersSnapshot.docs.forEach(doc => {
    const data = doc.data()
    const userId = data.createdBy || data.userId

    if (userId) {
      if (!ordersByUser[userId]) {
        ordersByUser[userId] = []
      }
      ordersByUser[userId].push({
        id: doc.id,
        total: data.total,
        status: data.status,
        createdAt: data.createdAt
      })
    }
  })

  // Find user emails
  const userEmails: { [key: string]: string } = {}
  usersSnapshot.docs.forEach(doc => {
    const data = doc.data()
    userEmails[doc.id] = data.email
  })

  console.log('\n🛒 Orders by user:')
  Object.keys(ordersByUser).forEach(userId => {
    const email = userEmails[userId] || 'Unknown email'
    const orders = ordersByUser[userId]

    console.log(`\n📦 ${email} (${userId}):`)
    console.log(`   📊 ${orders.length} orders`)

    const totalValue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    console.log(`   💰 Total value: ₫${totalValue.toLocaleString()}`)
  })

  if (Object.keys(ordersByUser).length === 0) {
    console.log('⚠️  No orders found for any user')
  }
}

async function main() {
  console.log('🔍 Comprehensive database analysis')
  console.log('=====================================\n')

  try {
    await checkAllUsers()
    await checkMenuData()
    await checkOrderData()

    console.log('\n✅ Database analysis completed!')

  } catch (error) {
    console.error('❌ Error analyzing database:', error)
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

export { main as checkAllUserData }