import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import {
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore'
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
        localCache: persistentLocalCache({
          cacheSizeBytes: CACHE_SIZE_UNLIMITED,
          tabManager: persistentMultipleTabManager()
        }),
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

// Network management utilities for offline support
export const networkUtils = {
  // Enable Firestore network connectivity
  enableFirestore: async () => {
    const db = getDb()
    if (db) {
      try {
        await enableNetwork(db)
        console.log('Firestore network enabled')
        return true
      } catch (error) {
        console.error('Failed to enable Firestore network:', error)
        return false
      }
    }
    return false
  },

  // Disable Firestore network connectivity (offline mode)
  disableFirestore: async () => {
    const db = getDb()
    if (db) {
      try {
        await disableNetwork(db)
        console.log('Firestore network disabled (offline mode)')
        return true
      } catch (error) {
        console.error('Failed to disable Firestore network:', error)
        return false
      }
    }
    return false
  },

  // Check if browser is online
  isOnline: () => {
    if (typeof window !== 'undefined') {
      return window.navigator.onLine
    }
    return true // Assume online on server
  },

  // Listen for online/offline events
  onNetworkChange: (callback: (isOnline: boolean) => void) => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => callback(true)
      const handleOffline = () => callback(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      // Return cleanup function
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
    return () => {} // No-op cleanup for server
  }
}

// Cache management utilities
export const cacheUtils = {
  // Clear Firestore cache
  clearFirestoreCache: async () => {
    try {
      // Firestore cache is cleared when we disable/enable network
      await networkUtils.disableFirestore()
      await networkUtils.enableFirestore()
      console.log('Firestore cache cleared')
      return true
    } catch (error) {
      console.error('Failed to clear Firestore cache:', error)
      return false
    }
  },

  // Get cache info (approximate)
  getCacheInfo: () => {
    if (typeof window !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      return navigator.storage.estimate()
    }
    return Promise.resolve({ usage: 0, quota: 0 })
  }
}

export default app