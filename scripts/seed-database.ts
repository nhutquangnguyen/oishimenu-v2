import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch
} from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// This script should be run locally with your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

async function seedDatabase() {
  try {
    console.log('Starting database seed...')

    // Create admin user
    const adminUser = await createUserWithEmailAndPassword(
      auth,
      'admin@oishimenu.com',
      'Admin123!'
    )

    // Seed users collection
    await setDoc(doc(db, 'users', adminUser.user.uid), {
      email: 'admin@oishimenu.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
    })

    // Seed store
    const storeRef = doc(db, 'stores', 'main-store')
    await setDoc(storeRef, {
      name: 'Dinh Barista - Coffee & Tea',
      address: '305C Phạm Văn Đồng, Ho Chi Minh City',
      phone: '+84 28 1234 5678',
      email: 'contact@dinhbarista.com',
      openingHours: {
        monday: '07:00 - 22:00',
        tuesday: '07:00 - 22:00',
        wednesday: '07:00 - 22:00',
        thursday: '07:00 - 22:00',
        friday: '07:00 - 23:00',
        saturday: '07:00 - 23:00',
        sunday: '08:00 - 22:00',
      },
      createdAt: new Date(),
    })

    // Seed menu categories
    const categories = [
      { id: 'coffee', name: 'COFFEE & COCOA', order: 1 },
      { id: 'matcha', name: 'MATCHA', order: 2 },
      { id: 'tea', name: 'TEA', order: 3 },
      { id: 'milk-tea', name: 'TRÀ SỮA - MILK TEA', order: 4 },
      { id: 'iced-blend', name: 'ICED BLEND', order: 5 },
      { id: 'fast-food', name: 'FAST FOOD', order: 6 },
    ]

    const batch = writeBatch(db)

    categories.forEach(category => {
      batch.set(doc(db, 'menu_categories', category.id), category)
    })

    // Seed menu items
    const menuItems = [
      {
        id: 'matcha-latte',
        name: 'Matcha Latte',
        nameVi: 'Matcha Latte',
        price: 29000,
        category: 'matcha',
        description: 'Creamy matcha latte with premium Japanese green tea',
        available: true,
        order: 1,
      },
      {
        id: 'vietnamese-coffee',
        name: 'Vietnamese Iced Coffee',
        nameVi: 'Cà Phê Sữa Đá',
        price: 22000,
        category: 'coffee',
        description: 'Traditional Vietnamese coffee with condensed milk',
        available: true,
        order: 1,
      },
      {
        id: 'peach-tea',
        name: 'Peach Tea',
        nameVi: 'Trà Đào',
        price: 29000,
        category: 'tea',
        description: 'Refreshing peach tea with real fruit pieces',
        available: true,
        order: 1,
      },
      {
        id: 'milk-tea-classic',
        name: 'Classic Milk Tea',
        nameVi: 'Trà Sữa Truyền Thống',
        price: 25000,
        category: 'milk-tea',
        description: 'Traditional milk tea with tapioca pearls',
        available: true,
        order: 1,
      },
    ]

    menuItems.forEach(item => {
      batch.set(doc(db, 'menu_items', item.id), {
        ...item,
        createdAt: new Date(),
      })
    })

    // Seed sample customers
    const customers = [
      {
        id: 'customer-1',
        phone: '0344270427',
        name: 'Nguyen Quang',
        email: 'nguyen.quang@example.com',
        totalOrders: 15,
        totalSpent: 850000,
        createdAt: new Date(),
      },
      {
        id: 'customer-2',
        phone: '0901234567',
        name: 'Tran Thi Mai',
        email: 'mai.tran@example.com',
        totalOrders: 8,
        totalSpent: 420000,
        createdAt: new Date(),
      },
    ]

    customers.forEach(customer => {
      batch.set(doc(db, 'customers', customer.id), customer)
    })

    // Commit all batch operations
    await batch.commit()

    console.log('✅ Database seeded successfully!')
    console.log('Admin credentials: admin@oishimenu.com / Admin123!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()