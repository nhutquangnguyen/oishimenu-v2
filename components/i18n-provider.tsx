"use client"

import { useEffect } from 'react'
import '@/lib/i18n' // Initialize i18n

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      const i18n = require('@/lib/i18n').default
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  return <>{children}</>
}