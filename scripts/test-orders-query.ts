import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Firebase config - using the same as your app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Connect to emulator if running locally
if (process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    console.log('Connected to Firebase emulator on localhost:8080')
  } catch (error) {
    console.log('Emulator already connected or not available')
  }
}

async function testOrdersQuery() {
  try {
    console.log('🧪 Testing orders query directly with Firebase...')

    // Import and test the getOrders function
    const { getOrders } = await import('@/lib/services/order')

    console.log('\n1️⃣ Testing query for CONFIRMED orders (should appear in preparing tab):')
    const confirmedOrders = await getOrders({
      status: ['CONFIRMED'],
      limit: 10
    })
    console.log(`Found ${confirmedOrders.length} CONFIRMED orders:`)
    confirmedOrders.forEach(order => {
      console.log(`  - ${order.orderNumber} (${order.status}) - Customer: ${order.customer.name}`)
    })

    console.log('\n2️⃣ Testing query for preparing tab statuses:')
    const preparingOrders = await getOrders({
      status: ['PENDING', 'CONFIRMED', 'PREPARING'],
      limit: 10
    })
    console.log(`Found ${preparingOrders.length} orders for preparing tab:`)
    preparingOrders.forEach(order => {
      console.log(`  - ${order.orderNumber} (${order.status}) - Customer: ${order.customer.name}`)
    })

    console.log('\n3️⃣ Testing query for all orders (no status filter):')
    const allOrders = await getOrders({
      limit: 10
    })
    console.log(`Found ${allOrders.length} total orders:`)
    allOrders.forEach(order => {
      console.log(`  - ${order.orderNumber} (${order.status}) - Customer: ${order.customer.name}`)
    })

    console.log('\n4️⃣ Testing query for history tab statuses:')
    const historyOrders = await getOrders({
      status: ['DELIVERED', 'CANCELLED', 'FAILED'],
      limit: 10
    })
    console.log(`Found ${historyOrders.length} orders for history tab:`)
    historyOrders.forEach(order => {
      console.log(`  - ${order.orderNumber} (${order.status}) - Customer: ${order.customer.name}`)
    })

  } catch (error) {
    console.error('❌ Error testing orders query:', error)
    throw error
  }
}

// Run the test
if (require.main === module) {
  testOrdersQuery()
    .then(() => {
      console.log('\n🎯 Orders query test completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Orders query test failed:', error)
      process.exit(1)
    })
}

export { testOrdersQuery }