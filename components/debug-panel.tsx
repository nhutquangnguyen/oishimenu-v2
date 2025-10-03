"use client"

import { useState } from "react"
import { Bug, Zap, AlertTriangle, Info } from "lucide-react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const triggerError = () => {
    console.error('Test error triggered from debug panel:', new Error('This is a test error'))
  }

  const triggerWarning = () => {
    console.warn('Test warning triggered from debug panel: This is a test warning')
  }

  const triggerFirebaseError = () => {
    console.error('Firebase test error:', {
      code: 'test-error',
      message: 'This is a simulated Firebase error for testing'
    })
  }

  const triggerUnhandledPromise = () => {
    // Create an unhandled promise rejection
    Promise.reject(new Error('Unhandled promise rejection test'))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
        title="Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Debug Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ×
        </button>
      </div>

      <div className="p-3 space-y-2">
        <div className="text-xs text-gray-600 mb-3">
          Test error notifications:
        </div>

        <button
          onClick={triggerError}
          className="w-full flex items-center gap-2 p-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          Trigger Error
        </button>

        <button
          onClick={triggerWarning}
          className="w-full flex items-center gap-2 p-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100 transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          Trigger Warning
        </button>

        <button
          onClick={triggerFirebaseError}
          className="w-full flex items-center gap-2 p-2 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
        >
          <Zap className="h-4 w-4" />
          Firebase Error
        </button>

        <button
          onClick={triggerUnhandledPromise}
          className="w-full flex items-center gap-2 p-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
        >
          <Info className="h-4 w-4" />
          Promise Rejection
        </button>

        <div className="pt-2 border-t text-xs text-gray-500">
          Only visible in development mode
        </div>
      </div>
    </div>
  )
}