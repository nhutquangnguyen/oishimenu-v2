"use client"

import React, { createContext, useContext, useState } from 'react'
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

// Simple mock auth provider for development (when Firebase has issues)
export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Mock Google Sign-In
  const signInWithGoogle = async () => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock successful authentication
      const mockUser = {
        uid: 'mock-user-123',
        email: 'demo@oishimenu.com',
        displayName: 'Demo User',
        photoURL: 'https://via.placeholder.com/40'
      }

      const mockUserData = {
        uid: 'mock-user-123',
        email: 'demo@oishimenu.com',
        name: 'Demo User',
        role: 'merchant',
        provider: 'google'
      }

      setUser(mockUser)
      setUserData(mockUserData)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Mock auth error:', error)
      throw new Error('Đăng nhập thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  // Mock logout
  const logout = async () => {
    setUser(null)
    setUserData(null)
    router.push('/')
  }

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