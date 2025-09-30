import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Initialize admin app
if (getApps().length === 0) {
  initializeApp({
    credential: cert(firebaseAdminConfig),
  })
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()

export default { adminAuth, adminDb }