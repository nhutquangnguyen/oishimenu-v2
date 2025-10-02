import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'
import { getStorage as getFirebaseStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if Firebase is disabled
const isFirebaseDisabled = process.env.NEXT_PUBLIC_FIREBASE_DISABLED === 'true'

// Validate Firebase configuration (measurementId is optional)
const requiredFields = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
}
const isValidConfig = !isFirebaseDisabled && Object.values(requiredFields).every(value =>
  value !== undefined && value !== null && value !== ''
)

if (isFirebaseDisabled) {
  console.log('Firebase is disabled - running in development mode')
} else if (!isValidConfig) {
  console.warn('Firebase configuration is incomplete. Some features may not work.')
}

// Initialize Firebase only if it hasn't been initialized yet and Firebase is not disabled
let app: any = null
if (!isFirebaseDisabled && isValidConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
} else {
  // Create a mock app for development
  app = null
}

// Initialize Firebase services - only if app is available
export const auth = app ? getAuth(app) : null

// Initialize Firestore with optimized settings - LAZY LOADED
let firestoreInstance: ReturnType<typeof getFirestore> | null = null
export const getDb = () => {
  // Return null immediately if Firebase is disabled or app is null
  if (isFirebaseDisabled || !app) {
    return null
  }

  if (!firestoreInstance && isValidConfig) {
    try {
      firestoreInstance = initializeFirestore(app, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
        experimentalForceLongPolling: true, // Force long polling to avoid WebChannel issues
      })

      // Connect to emulator if needed
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
        try {
          connectFirestoreEmulator(firestoreInstance, 'localhost', 8080)
        } catch (error) {
          console.log('Firestore emulator already connected')
        }
      }
    } catch (error) {
      console.warn('Failed to initialize Firestore:', error)
      try {
        // If already initialized, just get it
        firestoreInstance = getFirestore(app)
      } catch (fallbackError) {
        console.error('Firestore completely unavailable:', fallbackError)
        return null
      }
    }
  }
  return firestoreInstance
}

// Export db - will be initialized on first use
export const db = getDb()

let storageInstance: ReturnType<typeof getFirebaseStorage> | null = null
export const getStorageInstance = () => {
  if (isFirebaseDisabled || !app) {
    return null
  }

  if (!storageInstance) {
    storageInstance = getFirebaseStorage(app)

    // Connect to emulator if needed
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      try {
        connectStorageEmulator(storageInstance, 'localhost', 9199)
      } catch (error) {
        console.log('Storage emulator already connected')
      }
    }
  }
  return storageInstance
}

export const storage = getStorageInstance()

// Connect auth to emulator if needed
if (!isFirebaseDisabled && auth && typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  } catch (error) {
    console.log('Auth emulator already connected')
  }
}

// Initialize Analytics only on client side and if supported
export const initAnalytics = async () => {
  if (!isFirebaseDisabled && app && typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app)
  }
  return null
}

export default app