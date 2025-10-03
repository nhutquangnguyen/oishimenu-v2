import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore'
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

async function listOrders() {
  try {
    console.log('🔍 Fetching all orders from Firestore...')

    // Get all orders
    const ordersRef = collection(db, 'orders')
    const snapshot = await getDocs(ordersRef)

    console.log(`📊 Found ${snapshot.size} total orders`)

    if (snapshot.size > 0) {
      const orders = []
      snapshot.forEach(doc => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          ...data
        })
      })

      // Sort by creation date (newest first)
      orders.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          if (typeof a.createdAt.toDate === 'function') {
            return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
          }
        }
        return 0
      })

      // Display orders
      orders.forEach((order, index) => {
        console.log(`\n📦 Order ${index + 1}:`)
        console.log(`   ID: ${order.id}`)
        console.log(`   Order Number: ${order.orderNumber || 'N/A'}`)
        console.log(`   Status: ${order.status || 'N/A'}`)
        console.log(`   Customer: ${order.customer?.name || 'N/A'} (${order.customer?.phone || 'N/A'})`)
        console.log(`   Total: ${order.total || 0}₫`)
        console.log(`   Platform: ${order.platform || 'N/A'}`)

        if (order.createdAt) {
          let createdDate = 'N/A'
          if (typeof order.createdAt.toDate === 'function') {
            createdDate = order.createdAt.toDate().toISOString()
          } else if (order.createdAt instanceof Date) {
            createdDate = order.createdAt.toISOString()
          }
          console.log(`   Created: ${createdDate}`)
        }

        if (order.items && order.items.length > 0) {
          console.log(`   Items (${order.items.length}):`)
          order.items.forEach((item, i) => {
            console.log(`     ${i + 1}. ${item.quantity || 1}x ${item.menuItemName || item.name || 'Unknown Item'} - ${item.subtotal || item.basePrice || 0}₫`)
          })
        }
      })
    } else {
      console.log('📭 No orders found in the database')
    }

  } catch (error) {
    console.error('❌ Error listing orders:', error)
    throw error
  }
}

// Run the script
if (require.main === module) {
  listOrders()
    .then(() => {
      console.log('\n🎯 Orders listing completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Orders listing failed:', error)
      process.exit(1)
    })
}

export { listOrders }