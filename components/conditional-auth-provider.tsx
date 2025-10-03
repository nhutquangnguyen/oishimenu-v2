"use client"

import { usePathname } from "next/navigation"
import { AuthProvider } from "@/components/auth-provider"

export function ConditionalAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Routes that need authentication context (including auth pages)
  const authRoutes = [
    '/login',
    '/signup',
    '/dashboard',
    '/insights',
    '/orders',
    '/pos',
    '/feedback',
    '/menu',
    '/inventory',
    '/employees',
    '/finance',
    '/marketing',
    '/help'
  ]

  const needsAuth = authRoutes.some(route => pathname.startsWith(route))

  if (needsAuth) {
    return <AuthProvider>{children}</AuthProvider>
  }

  return <>{children}</>
}