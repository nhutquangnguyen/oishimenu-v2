"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    if (!db) {
      console.warn('Database not available, skipping user data fetch')
      return
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Create user document in Firestore
  const createUserDocument = async (user: User) => {
    if (!db) {
      console.warn('Database not available, setting mock user data')
      // Set fallback user data when database is not available
      setUserData({
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'merchant',
        provider: 'google'
      })
      return
    }

    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'merchant', // Default role for restaurant owners
          provider: 'google',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      fetchUserData(user.uid)
    } catch (error) {
      console.error('Error creating user document:', error)
    }
  }

  // Sign in with Google (handles both login and signup)
  const signInWithGoogle = async () => {
    if (!auth) {
      console.warn('Auth not available, using mock authentication')
      // Mock authentication when Firebase is disabled
      const mockUser = {
        uid: 'mock-user-123',
        email: 'demo@oishimenu.com',
        displayName: 'Demo User',
        photoURL: null
      } as User

      setUser(mockUser)
      await createUserDocument(mockUser)
      router.push('/dashboard')
      return
    }

    try {
      const provider = new GoogleAuthProvider()
      // Add additional scopes if needed
      provider.addScope('email')
      provider.addScope('profile')

      const result = await signInWithPopup(auth, provider)
      await createUserDocument(result.user)
      router.push('/dashboard') // Redirect to dashboard after login
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  // Logout
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth)
      }
      setUser(null)
      setUserData(null)
      router.push('/')
    } catch (error: any) {
      throw new Error('Đăng xuất thất bại')
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

  // Monitor auth state changes
  useEffect(() => {
    if (!auth) {
      console.warn('Auth not available, setting loading to false')
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await fetchUserData(user.uid)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return unsubscribe
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