import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore'

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

async function addSampleMenuData(userId: string) {
  console.log('📋 Adding sample menu data...')

  const sampleMenuItems = [
    {
      name: 'Phở Bò',
      description: 'Traditional Vietnamese beef noodle soup',
      price: 85000,
      category: 'Main Dishes',
      available: true,
      image: '',
      ingredients: ['beef', 'rice noodles', 'herbs', 'broth']
    },
    {
      name: 'Bánh Mì',
      description: 'Vietnamese sandwich with various fillings',
      price: 35000,
      category: 'Sandwiches',
      available: true,
      image: '',
      ingredients: ['bread', 'pate', 'vegetables', 'meat']
    },
    {
      name: 'Cà Phê Sữa Đá',
      description: 'Vietnamese iced coffee with condensed milk',
      price: 25000,
      category: 'Beverages',
      available: true,
      image: '',
      ingredients: ['coffee', 'condensed milk', 'ice']
    },
    {
      name: 'Gỏi Cuốn',
      description: 'Fresh spring rolls with shrimp and herbs',
      price: 45000,
      category: 'Appetizers',
      available: true,
      image: '',
      ingredients: ['rice paper', 'shrimp', 'herbs', 'lettuce']
    },
    {
      name: 'Bún Chả',
      description: 'Grilled pork with noodles and herbs',
      price: 75000,
      category: 'Main Dishes',
      available: true,
      image: '',
      ingredients: ['grilled pork', 'rice noodles', 'herbs', 'dipping sauce']
    }
  ]

  let addedCount = 0

  for (const item of sampleMenuItems) {
    try {
      const menuItem = {
        ...item,
        createdBy: userId,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: `menu-${Date.now()}-${addedCount}`
      }

      await addDoc(collection(db, 'menuItems'), menuItem)
      console.log(`✅ Added: ${item.name}`)
      addedCount++
    } catch (error) {
      console.error(`❌ Failed to add ${item.name}:`, error)
    }
  }

  console.log(`📋 Added ${addedCount} menu items total`)
  return addedCount
}

async function main() {
  console.log('🚀 Adding test menu data for nguyenquang.btr@gmail.com')

  try {
    // Find the source user
    const userId = await findUserByEmail('nguyenquang.btr@gmail.com')
    if (!userId) {
      throw new Error('Source user not found')
    }

    // Add sample menu data
    const addedCount = await addSampleMenuData(userId)

    console.log('')
    console.log('🎉 Sample data added successfully!')
    console.log(`📋 Total menu items added: ${addedCount}`)
    console.log('')
    console.log('✅ Now you can run the copy script again to copy this data to test@gmail.com')

  } catch (error) {
    console.error('❌ Error adding sample data:', error)
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

export { main as addTestMenuData }