import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch, connectFirestoreEmulator } from 'firebase/firestore'
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

interface Category {
  id: string
  name: string
  description?: string
  createdAt?: any
  updatedAt?: any
}

async function cleanDuplicateCategories() {
  try {
    console.log('🔍 Fetching all categories from Firestore...')

    // Get all categories
    const categoriesRef = collection(db, 'menu-categories')
    const snapshot = await getDocs(categoriesRef)

    const categories: Category[] = []
    snapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data()
      } as Category)
    })

    console.log(`📊 Found ${categories.length} total categories`)

    // Group categories by name to find duplicates
    const categoryGroups = new Map<string, Category[]>()

    categories.forEach(category => {
      const name = category.name
      if (!categoryGroups.has(name)) {
        categoryGroups.set(name, [])
      }
      categoryGroups.get(name)!.push(category)
    })

    // Find duplicates
    const duplicateGroups = Array.from(categoryGroups.entries())
      .filter(([name, categories]) => categories.length > 1)

    console.log(`🔍 Found ${duplicateGroups.length} categories with duplicates:`)
    duplicateGroups.forEach(([name, categories]) => {
      console.log(`  - "${name}": ${categories.length} duplicates`)
      categories.forEach((cat, index) => {
        // Helper function to safely format date
        const formatDate = (item: Category) => {
          if (!item.createdAt) return 'N/A'
          if (typeof item.createdAt.toDate === 'function') {
            return item.createdAt.toDate().toISOString()
          }
          if (item.createdAt instanceof Date) {
            return item.createdAt.toISOString()
          }
          if (typeof item.createdAt === 'string') {
            return new Date(item.createdAt).toISOString()
          }
          return 'N/A'
        }

        console.log(`    ${index + 1}. ID: ${cat.id}, Created: ${formatDate(cat)}`)
      })
    })

    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicate categories found!')
      return
    }

    // Ask for confirmation
    console.log('\n⚠️  CLEANUP PLAN:')
    console.log('For each duplicate group, we will:')
    console.log('1. Keep the FIRST category (oldest or first created)')
    console.log('2. Delete all other duplicates')
    console.log('')

    const categoriesToDelete: string[] = []

    duplicateGroups.forEach(([name, categories]) => {
      // Sort by createdAt (oldest first) or by ID if no createdAt
      const sorted = categories.sort((a, b) => {
        // Helper function to safely get timestamp
        const getTimestamp = (item: Category) => {
          if (!item.createdAt) return 0
          if (typeof item.createdAt.toDate === 'function') {
            return item.createdAt.toDate().getTime()
          }
          if (item.createdAt instanceof Date) {
            return item.createdAt.getTime()
          }
          if (typeof item.createdAt === 'string') {
            return new Date(item.createdAt).getTime()
          }
          return 0
        }

        const aTime = getTimestamp(a)
        const bTime = getTimestamp(b)

        if (aTime && bTime) {
          return aTime - bTime
        }
        // If no valid timestamps, sort by ID
        return a.id.localeCompare(b.id)
      })

      const [keep, ...toDelete] = sorted
      console.log(`📌 "${name}": Keeping ID ${keep.id}, deleting ${toDelete.length} duplicates`)

      toDelete.forEach(cat => {
        categoriesToDelete.push(cat.id)
        console.log(`   🗑️  Will delete: ${cat.id}`)
      })
    })

    console.log(`\n📋 Summary: Will delete ${categoriesToDelete.length} duplicate categories`)
    console.log('💾 The original categories will be preserved')

    // Perform the cleanup
    if (categoriesToDelete.length > 0) {
      console.log('\n🧹 Starting cleanup...')

      // Use batch delete for efficiency
      const batch = writeBatch(db)

      categoriesToDelete.forEach(categoryId => {
        const categoryRef = doc(db, 'menu-categories', categoryId)
        batch.delete(categoryRef)
      })

      await batch.commit()

      console.log(`✅ Successfully deleted ${categoriesToDelete.length} duplicate categories!`)
      console.log('🎉 Database cleanup completed!')
    }

    // Verify cleanup
    console.log('\n🔍 Verifying cleanup...')
    const verifySnapshot = await getDocs(categoriesRef)
    const remainingCategories = verifySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }))

    console.log(`📊 Remaining categories: ${remainingCategories.length}`)
    remainingCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.id})`)
    })

    // Check for any remaining duplicates
    const remainingNames = remainingCategories.map(cat => cat.name)
    const uniqueNames = [...new Set(remainingNames)]

    if (remainingNames.length === uniqueNames.length) {
      console.log('✅ No duplicates remaining!')
    } else {
      console.log('⚠️  Warning: Some duplicates may still exist')
    }

  } catch (error) {
    console.error('❌ Error cleaning duplicate categories:', error)
    throw error
  }
}

// Run the cleanup
if (require.main === module) {
  cleanDuplicateCategories()
    .then(() => {
      console.log('🎯 Cleanup script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Cleanup script failed:', error)
      process.exit(1)
    })
}

export { cleanDuplicateCategories }