"use client"

import { usePathname } from "next/navigation"
import { FirebaseAuthProvider } from "@/contexts/firebase-auth-context"

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
    return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
  }

  return <>{children}</>
}