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

async function seedTables() {
  try {
    console.log('🌱 Seeding sample tables...')

    // Import the createTable function
    const { createTable } = await import('@/lib/services/table')

    const sampleTables = [
      // Main Floor Tables
      { name: 'Table 1', seats: 2, location: 'Main Floor', description: 'Window table for 2' },
      { name: 'Table 2', seats: 4, location: 'Main Floor', description: 'Center table for 4' },
      { name: 'Table 3', seats: 2, location: 'Main Floor', description: 'Corner table for 2' },
      { name: 'Table 4', seats: 6, location: 'Main Floor', description: 'Large table for 6' },
      { name: 'Table 5', seats: 4, location: 'Main Floor', description: 'Near entrance' },

      // Terrace Tables
      { name: 'Terrace A', seats: 2, location: 'Terrace', description: 'Outdoor seating with garden view' },
      { name: 'Terrace B', seats: 4, location: 'Terrace', description: 'Outdoor table for 4' },
      { name: 'Terrace C', seats: 2, location: 'Terrace', description: 'Cozy outdoor spot' },

      // VIP Room
      { name: 'VIP 1', seats: 8, location: 'VIP Room', description: 'Private dining room' },
      { name: 'VIP 2', seats: 6, location: 'VIP Room', description: 'Executive meeting table' },

      // Bar Area
      { name: 'Bar 1', seats: 2, location: 'Bar Area', description: 'High bar table' },
      { name: 'Bar 2', seats: 3, location: 'Bar Area', description: 'Counter seating' },

      // Second Floor
      { name: 'Upper 1', seats: 4, location: 'Second Floor', description: 'Quiet dining area' },
      { name: 'Upper 2', seats: 2, location: 'Second Floor', description: 'Intimate setting' },
      { name: 'Upper 3', seats: 6, location: 'Second Floor', description: 'Family table' },
    ]

    let createdCount = 0

    for (const tableData of sampleTables) {
      try {
        const tableId = await createTable(tableData)
        if (tableId) {
          console.log(`✅ Created table: ${tableData.name} (${tableData.seats} seats) - ${tableData.location}`)
          createdCount++
        } else {
          console.log(`❌ Failed to create table: ${tableData.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creating table ${tableData.name}:`, error)
      }
    }

    console.log(`\n🎯 Successfully created ${createdCount} out of ${sampleTables.length} tables`)

  } catch (error) {
    console.error('❌ Error seeding tables:', error)
    throw error
  }
}

// Run the script
if (require.main === module) {
  seedTables()
    .then(() => {
      console.log('\n🌟 Table seeding completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Table seeding failed:', error)
      process.exit(1)
    })
}

export { seedTables }