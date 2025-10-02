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
        signInWithRedirect,
        getRedirectResult,
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

      // Hybrid Google sign-in: Try popup first, fallback to redirect
      const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider()
        provider.addScope('email')
        provider.addScope('profile')

        console.log('🚀 Starting Google authentication...')
        console.log('   Current URL:', window.location.href)
        console.log('   Current domain:', window.location.hostname)

        // Check if we're already in a redirect flow
        if (sessionStorage.getItem('pendingGoogleAuth') === 'true') {
          console.log('⏳ Authentication already in progress, skipping...')
          return
        }

        // Try popup first (more reliable when it works)
        let popupFailed = false
        try {
          console.log('🚀 Attempting Google sign-in with popup...')

          const result = await signInWithPopup(auth, provider)
          console.log('✅ Popup authentication successful:', result.user.email)
          await createUserDocument(result.user)
          router.push('/dashboard')
          return
        } catch (popupError: any) {
          popupFailed = true
          console.log('⚠️ Popup failed:', popupError.code || popupError.message)

          // Provide specific guidance for unauthorized domain error
          if (popupError.code === 'auth/unauthorized-domain') {
            console.error('🚨 UNAUTHORIZED DOMAIN ERROR')
            console.error('   Current domain:', window.location.hostname)
            console.error('   → This domain must be added to Firebase Console authorized domains')
            console.error('   → Go to: https://console.firebase.google.com/project/oishimenu-g-c6fd5/authentication/settings')
            throw new Error('Domain not authorized. Please configure Firebase authorized domains.')
          }

          // Check for COOP-related errors (broader detection)
          const isCOOPError = popupError.code === 'auth/popup-blocked' ||
                             popupError.code === 'auth/popup-closed-by-user' ||
                             popupError.code === 'auth/cancelled-popup-request' ||
                             popupError.message?.includes('Cross-Origin-Opener-Policy') ||
                             popupError.message?.includes('window.closed')

          if (isCOOPError) {
            console.log('🔄 COOP policy detected, falling back to redirect authentication...')

            try {
              console.log('   Redirect will take user to Google, then back to:', window.location.origin)

              // Set flag to track that we're expecting a redirect result
              sessionStorage.setItem('pendingGoogleAuth', 'true')

              await signInWithRedirect(auth, provider)
              console.log('✅ Redirect initiated successfully - user will be redirected to Google')
              return
            } catch (redirectError: any) {
              console.error('❌ Both popup and redirect failed:', redirectError)
              sessionStorage.removeItem('pendingGoogleAuth')

              if (redirectError.code === 'auth/unauthorized-domain') {
                console.error('🚨 UNAUTHORIZED DOMAIN ERROR in redirect')
                console.error('   → Firebase authorized domains must include:', window.location.hostname)
                throw new Error('Domain not authorized for redirects. Please configure Firebase authorized domains.')
              }

              throw new Error(getAuthErrorMessage(redirectError.code))
            }
          } else {
            // For other popup errors, throw immediately
            console.error('❌ Popup authentication failed:', popupError)
            throw new Error(getAuthErrorMessage(popupError.code))
          }
        }
      }

      // Handle redirect result after user returns from Google auth
      const handleRedirectResult = async () => {
        try {
          console.log('🔍 Checking for redirect result...')
          const result = await getRedirectResult(auth)
          console.log('🔍 Redirect result:', result)

          if (result && result.user) {
            console.log('✅ User found in redirect result:', result.user.email)
            await createUserDocument(result.user)
            console.log('✅ Redirecting to dashboard...')
            router.push('/dashboard')
          } else {
            console.log('ℹ️ No redirect result found')

            // Check if we expected a redirect (came from Google auth)
            if (typeof window !== 'undefined') {
              const urlParams = new URLSearchParams(window.location.search)
              const hasAuthParams = urlParams.has('code') || urlParams.has('error') ||
                                   window.location.pathname === '/login'

              if (hasAuthParams || sessionStorage.getItem('pendingGoogleAuth')) {
                console.error('🚨 REDIRECT AUTHENTICATION FAILED')
                console.error('   Expected: User data from Google redirect')
                console.error('   Actual: Redirect result is null')
                console.error('   🔧 SOLUTION: Configure Firebase authorized domains')
                console.error('   📋 Go to: https://console.firebase.google.com/project/oishimenu-g-c6fd5/authentication/settings')
                console.error('   ➕ Add domains: localhost, 127.0.0.1, oishimenu.com, merchant.oishimenu.com')

                // Clear the pending auth flag
                sessionStorage.removeItem('pendingGoogleAuth')
              }

              if (urlParams.has('error')) {
                console.warn('⚠️ Error parameter found in URL:', urlParams.get('error'))
              }
            }
          }
        } catch (error: any) {
          console.error('❌ Redirect result error:', error)

          // Provide specific error handling for common issues
          if (error.code === 'auth/unauthorized-domain') {
            console.error('🚨 UNAUTHORIZED DOMAIN ERROR: This domain is not authorized in Firebase Console')
            console.error('   → Go to Firebase Console → Authentication → Settings → Authorized domains')
            console.error('   → Add your domain to the authorized domains list')
          } else if (error.code === 'auth/operation-not-allowed') {
            console.error('🚨 OPERATION NOT ALLOWED: Google sign-in is not enabled in Firebase Console')
            console.error('   → Go to Firebase Console → Authentication → Sign-in method → Google → Enable')
          }

          // Handle error but don't throw, as this runs on every page load
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

      // Check for redirect result on app load
      await handleRedirectResult()

      // Monitor auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('🔄 Auth state changed:', user ? `User: ${user.email}` : 'No user')
        setUser(user)
        if (user) {
          console.log('👤 Creating user document for:', user.email)
          await createUserDocument(user)
        } else {
          console.log('👤 No user, clearing user data')
          setUserData(null)
        }
        setLoading(false)
        console.log('✅ Auth state change processed, loading set to false')
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
      case 'auth/cancelled-popup-request':
        return 'Đăng nhập bị hủy'
      case 'auth/popup-blocked':
        return 'Popup bị chặn, vui lòng kiểm tra trình duyệt'
      case 'auth/redirect-cancelled-by-user':
        return 'Đăng nhập bị hủy'
      case 'auth/redirect-operation-pending':
        return 'Đang xử lý đăng nhập, vui lòng chờ'
      case 'auth/unauthorized-domain':
        return 'Domain chưa được cấu hình trong Firebase Console'
      case 'auth/operation-not-allowed':
        return 'Phương thức đăng nhập Google chưa được bật'
      case 'auth/account-exists-with-different-credential':
        return 'Tài khoản đã tồn tại với phương thức đăng nhập khác'
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng'
      case 'auth/user-disabled':
        return 'Tài khoản đã bị vô hiệu hóa'
      case 'auth/user-not-found':
        return 'Tài khoản không tồn tại'
      case 'auth/invalid-email':
        return 'Email không hợp lệ'
      case 'auth/too-many-requests':
        return 'Quá nhiều yêu cầu, vui lòng thử lại sau'
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
      console.log('🔥 Initializing Firebase...')
      initializeFirebase().then((unsub) => {
        unsubscribe = unsub
        console.log('🔥 Firebase initialization complete')
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