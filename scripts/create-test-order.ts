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

async function createTestOrder() {
  try {
    console.log('🔨 Creating test order...')

    // Import the createOrder function
    const { createOrder } = await import('@/lib/services/order')

    const testOrderData = {
      customer: {
        name: 'Test Customer',
        phone: '0123456789',
        email: 'test@example.com'
      },
      items: [
        {
          id: `item-${Date.now()}-${Math.random()}`,
          menuItemId: 'test-item-1',
          menuItemName: 'Test Coffee',
          basePrice: 35000,
          quantity: 2,
          selectedOptions: [],
          subtotal: 70000
        },
        {
          id: `item-${Date.now()}-${Math.random()}`,
          menuItemId: 'test-item-2',
          menuItemName: 'Test Tea',
          basePrice: 25000,
          quantity: 1,
          selectedOptions: [],
          subtotal: 25000
        }
      ],
      subtotal: 95000,
      deliveryFee: 0,
      discount: 0,
      tax: Math.round(95000 * 0.1),
      total: 95000 * 1.1,
      orderType: 'DINE_IN',
      status: 'CONFIRMED',
      notes: 'Test order created via script',
      tableNumber: '5',
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      platform: 'direct'
    }

    const orderId = await createOrder(testOrderData)

    if (orderId) {
      console.log(`✅ Test order created successfully with ID: ${orderId}`)
      console.log(`📋 Order details:`)
      console.log(`   Customer: ${testOrderData.customer.name} (${testOrderData.customer.phone})`)
      console.log(`   Total: ${testOrderData.total}₫`)
      console.log(`   Status: ${testOrderData.status}`)
      console.log(`   Items: ${testOrderData.items.length}`)
      testOrderData.items.forEach((item, index) => {
        console.log(`     ${index + 1}. ${item.quantity}x ${item.menuItemName} - ${item.subtotal}₫`)
      })
    } else {
      console.log('❌ Failed to create test order')
    }

  } catch (error) {
    console.error('❌ Error creating test order:', error)
    throw error
  }
}

// Run the script
if (require.main === module) {
  createTestOrder()
    .then(() => {
      console.log('\n🎯 Test order creation completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Test order creation failed:', error)
      process.exit(1)
    })
}

export { createTestOrder }