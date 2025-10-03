import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// Firebase config
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

async function listCollections() {
  console.log('🔍 Checking Firestore collections...')

  const collectionsToCheck = [
    'menu-categories',
    'categories',
    'menu-items',
    'items'
  ]

  for (const collectionName of collectionsToCheck) {
    try {
      console.log(`\n📂 Checking collection: ${collectionName}`)
      const ref = collection(db, collectionName)
      const snapshot = await getDocs(ref)

      console.log(`  📊 Found ${snapshot.size} documents`)

      if (snapshot.size > 0) {
        snapshot.docs.slice(0, 3).forEach((doc, index) => {
          const data = doc.data()
          console.log(`  ${index + 1}. ID: ${doc.id}`)
          if (data.name) console.log(`     Name: ${data.name}`)
          if (data.title) console.log(`     Title: ${data.title}`)
          console.log(`     Keys: ${Object.keys(data).join(', ')}`)
        })

        if (snapshot.size > 3) {
          console.log(`     ... and ${snapshot.size - 3} more documents`)
        }
      }
    } catch (error) {
      console.log(`  ❌ Error accessing ${collectionName}:`, error.message)
    }
  }
}

// Run the script
listCollections()
  .then(() => {
    console.log('\n✅ Collection listing completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })