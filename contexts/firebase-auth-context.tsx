"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any | null
  userData: any | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseLoaded, setFirebaseLoaded] = useState(false)
  const router = useRouter()

  // Dynamically import Firebase to avoid SSR issues
  const initializeFirebase = async () => {
    // Check if Firebase is disabled before trying to initialize
    if (process.env.NEXT_PUBLIC_FIREBASE_DISABLED === 'true') {
      console.log('Firebase is disabled, using mock authentication')
      setFirebaseLoaded(false)
      setLoading(false)
      return undefined
    }

    try {
      // Import Firebase modules dynamically
      const { auth, db } = await import('@/lib/firebase')

      // Check if auth is available
      if (!auth) {
        throw new Error('Firebase auth not available')
      }

      const {
        onAuthStateChanged,
        GoogleAuthProvider,
        signInWithPopup,
        signOut
      } = await import('firebase/auth')
      const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore')

      setFirebaseLoaded(true)

      // Create user document in Firestore
      const createUserDocument = async (user: any) => {
        try {
          if (db) {
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
              await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName || '',
                photoURL: user.photoURL || '',
                role: 'merchant',
                provider: 'google',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              })
            }

            const updatedUserDoc = await getDoc(userRef)
            if (updatedUserDoc.exists()) {
              setUserData(updatedUserDoc.data())
              return
            }
          }

          // Fallback: set user data from auth user if Firestore is unavailable
          setUserData({
            uid: user.uid,
            email: user.email,
            name: user.displayName || '',
            photoURL: user.photoURL || '',
            role: 'merchant',
            provider: 'google',
          })
        } catch (error: any) {
          console.error('Error creating user document:', error)
          // Fallback: set user data from auth user if Firestore fails
          setUserData({
            uid: user.uid,
            email: user.email,
            name: user.displayName || '',
            photoURL: user.photoURL || '',
            role: 'merchant',
            provider: 'google',
          })
        }
      }

      // Sign in with Google
      const handleGoogleSignIn = async () => {
        try {
          const provider = new GoogleAuthProvider()
          provider.addScope('email')
          provider.addScope('profile')

          const result = await signInWithPopup(auth, provider)
          await createUserDocument(result.user)
          router.push('/dashboard')
        } catch (error: any) {
          console.error('Google sign-in error:', error)
          throw new Error(getAuthErrorMessage(error.code))
        }
      }

      // Logout
      const handleLogout = async () => {
        try {
          await signOut(auth)
          setUser(null)
          setUserData(null)
          router.push('/')
        } catch (error: any) {
          throw new Error('Đăng xuất thất bại')
        }
      }

      // Set auth functions
      window.__authFunctions = {
        signInWithGoogle: handleGoogleSignIn,
        logout: handleLogout
      }

      // Monitor auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)
        if (user) {
          await createUserDocument(user)
        } else {
          setUserData(null)
        }
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error('Firebase initialization error:', error)
      console.log('Falling back to mock authentication mode')
      setFirebaseLoaded(false)
      setLoading(false)

      // If Firebase fails, we still provide mock auth functionality
      return undefined
    }
  }

  // Get user-friendly error messages
  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return 'Đăng nhập bị hủy'
      case 'auth/popup-blocked':
        return 'Popup bị chặn, vui lòng kiểm tra trình duyệt'
      case 'auth/cancelled-popup-request':
        return 'Yêu cầu đăng nhập bị hủy'
      case 'auth/account-exists-with-different-credential':
        return 'Tài khoản đã tồn tại với phương thức đăng nhập khác'
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng'
      default:
        return 'Đăng nhập thất bại, vui lòng thử lại'
    }
  }

  // Mock functions for when Firebase isn't loaded
  const signInWithGoogle = async () => {
    if (firebaseLoaded && window.__authFunctions) {
      return window.__authFunctions.signInWithGoogle()
    } else {
      // Fallback mock auth
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockUser = {
        uid: 'mock-user-123',
        email: 'demo@oishimenu.com',
        displayName: 'Demo User',
        photoURL: null
      }

      setUser(mockUser)
      setUserData({ ...mockUser, role: 'merchant' })
      setLoading(false)
      router.push('/dashboard')
    }
  }

  const logout = async () => {
    if (firebaseLoaded && window.__authFunctions) {
      return window.__authFunctions.logout()
    } else {
      setUser(null)
      setUserData(null)
      router.push('/')
    }
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    // Initialize Firebase only on client side
    if (typeof window !== 'undefined') {
      initializeFirebase().then((unsub) => {
        unsubscribe = unsub
      })
    } else {
      setLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const value = {
    user,
    userData,
    loading,
    signInWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Type declarations for global auth functions
declare global {
  interface Window {
    __authFunctions?: {
      signInWithGoogle: () => Promise<void>
      logout: () => Promise<void>
    }
  }
}