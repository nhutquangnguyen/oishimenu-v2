import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function createAdminUser() {
  try {
    console.log('Creating admin user...')

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@oishimenu.com',
      'Admin123!'
    )

    const user = userCredential.user
    console.log('User created in Firebase Auth:', user.uid)

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: 'admin@oishimenu.com',
      name: 'Admin User',
      role: 'admin',
      storeId: 'main-store',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@oishimenu.com')
    console.log('Password: Admin123!')
    console.log('Role: admin')

    process.exit(0)
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Admin user already exists!')
      console.log('Email: admin@oishimenu.com')
      console.log('Password: Admin123!')
    } else {
      console.error('❌ Error creating admin user:', error.message)
    }
    process.exit(1)
  }
}

createAdminUser()