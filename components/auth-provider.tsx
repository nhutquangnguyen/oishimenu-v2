"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserData {
  uid: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
  storeId?: string
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: FirebaseUser | null
  userData: UserData | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const ROLE_PERMISSIONS = {
  admin: ['all'],
  manager: ['menu:read', 'menu:write', 'orders:read', 'orders:write', 'inventory:read', 'inventory:write', 'employees:read', 'dashboard:read', 'feedback:read', 'feedback:write'],
  staff: ['orders:read', 'orders:write', 'menu:read', 'pos:use', 'dashboard:read']
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email || 'no user')
      setLoading(true)

      if (firebaseUser) {
        setUser(firebaseUser)
        await handleUserSignIn(firebaseUser)

        // If we're on the login page and user is authenticated, redirect to dashboard
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
          console.log('User authenticated on login page, redirecting to dashboard')
          router.push('/dashboard')
        }
      } else {
        setUser(null)
        setUserData(null)
      }

      setLoading(false)
    })

    // Check for redirect result on page load
    const checkRedirectResult = async () => {
      try {
        console.log('Checking redirect result...')
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('Redirect result found:', result.user.email)
          console.log('User authenticated successfully via redirect')
          // The onAuthStateChanged will handle the redirect to dashboard
        } else {
          console.log('No redirect result found')
        }
      } catch (error) {
        console.error('Redirect result error:', error)
        setLoading(false)

        // Handle specific redirect errors
        if (error.code === 'auth/unauthorized-domain') {
          console.error('Unauthorized domain - check Firebase console for authorized domains')
        } else if (error.code === 'auth/operation-not-allowed') {
          console.error('Google sign-in not enabled in Firebase console')
        }
      }
    }

    // Only check redirect result if we're not already authenticated
    if (!user) {
      checkRedirectResult()
    }

    return () => unsubscribe()
  }, [router])

  const handleUserSignIn = async (firebaseUser: FirebaseUser) => {
    console.log('Handling user sign in for:', firebaseUser.email)
    // Fetch user data from Firestore
    try {
      if (db) {
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as UserData
          console.log('Found existing user data:', userData.role)
          setUserData({
            ...userData,
            createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt),
            updatedAt: userData.updatedAt instanceof Date ? userData.updatedAt : new Date(userData.updatedAt)
          })
        } else {
          // Create default user data if not exists
          let role: 'admin' | 'manager' | 'staff' = 'staff'

          // Determine role based on email domain
          if (firebaseUser.email?.includes('admin@') || firebaseUser.email?.includes('owner@')) {
            role = 'admin'
          } else if (firebaseUser.email?.includes('manager@')) {
            role = 'manager'
          }

          console.log('Creating new user with role:', role)
          const defaultUserData: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role,
            createdAt: new Date(),
            updatedAt: new Date()
          }

          await setDoc(userDocRef, defaultUserData)
          setUserData(defaultUserData)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUserData(null)
    }
  }

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Authentication not available')
    }

    console.log('Starting Google sign-in...')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')

      // Try popup first for development, fall back to redirect
      let result;
      try {
        console.log('Attempting popup sign-in...')
        result = await signInWithPopup(auth, provider)
        console.log('Popup sign-in successful:', result.user.email)

        // Handle user creation/update immediately for popup flow
        await handleUserSignIn(result.user)

        // Redirect to dashboard
        router.push('/dashboard')

      } catch (popupError: any) {
        console.log('Popup failed, trying redirect...', popupError.code)

        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          // Fall back to redirect
          console.log('Using redirect method...')
          await signInWithRedirect(auth, provider)
          // Note: The actual sign-in result will be handled by getRedirectResult in useEffect
          return
        } else {
          throw popupError
        }
      }

    } catch (error: any) {
      console.error('Sign-in error:', error)
      setLoading(false)

      // Handle specific Google auth errors
      switch (error.code) {
        case 'auth/cancelled-popup-request':
        case 'auth/popup-closed-by-user':
          throw new Error('Đăng nhập bị hủy')
        case 'auth/account-exists-with-different-credential':
          throw new Error('Tài khoản đã tồn tại với phương thức đăng nhập khác')
        case 'auth/operation-not-allowed':
          throw new Error('Google Sign-in chưa được bật. Vui lòng liên hệ quản trị viên')
        case 'auth/unauthorized-domain':
          throw new Error('Domain không được ủy quyền. Vui lòng liên hệ quản trị viên')
        default:
          console.error('Unknown error code:', error.code)
          throw new Error(`Đăng nhập với Google thất bại: ${error.message}`)
      }
    }
  }

  const logout = async () => {
    if (!auth) return

    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const hasRole = (role: string): boolean => {
    if (!userData) return false
    return userData.role === role || userData.role === 'admin'
  }

  const hasPermission = (permission: string): boolean => {
    if (!userData) return false

    const userPermissions = ROLE_PERMISSIONS[userData.role] || []
    return userPermissions.includes('all') || userPermissions.includes(permission)
  }

  const value = {
    user,
    userData,
    loading,
    signInWithGoogle,
    logout,
    hasRole,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}