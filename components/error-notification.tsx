"use client"

import { useState, useEffect } from "react"
import { X, AlertTriangle, Bug } from "lucide-react"

interface ErrorInfo {
  id: string
  message: string
  stack?: string
  timestamp: Date
  type: 'error' | 'warning' | 'log'
}

// Safe JSON stringify that handles circular references
function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        // Handle circular references by replacing with a placeholder
        if (typeof value.constructor === 'function' && value.constructor.name) {
          return `[${value.constructor.name} object]`
        }
      }
      return value
    }, 2)
  } catch (error) {
    return String(obj)
  }
}

export function ErrorNotificationProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<ErrorInfo[]>([])
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Only enable in development mode
    if (process.env.NODE_ENV !== 'development') return

    // Store original console methods
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log

    // Override console.error
    console.error = (...args) => {
      originalError(...args)

      const message = args.map(arg =>
        typeof arg === 'object' ? safeStringify(arg) : String(arg)
      ).join(' ')

      const error: ErrorInfo = {
        id: `error-${Date.now()}-${Math.random()}`,
        message: message,
        stack: args.find(arg => arg instanceof Error)?.stack,
        timestamp: new Date(),
        type: 'error'
      }

      setErrors(prev => [...prev.slice(-9), error]) // Keep last 10 errors
    }

    // Override console.warn for warnings
    console.warn = (...args) => {
      originalWarn(...args)

      const message = args.map(arg =>
        typeof arg === 'object' ? safeStringify(arg) : String(arg)
      ).join(' ')

      // Only show Firebase warnings and other important warnings
      if (message.includes('Firebase') || message.includes('Firestore') || message.includes('failed') || message.includes('error')) {
        const warning: ErrorInfo = {
          id: `warn-${Date.now()}-${Math.random()}`,
          message: message,
          timestamp: new Date(),
          type: 'warning'
        }

        setErrors(prev => [...prev.slice(-9), warning])
      }
    }

    // Global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      const error: ErrorInfo = {
        id: `global-${Date.now()}-${Math.random()}`,
        message: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        stack: event.error?.stack,
        timestamp: new Date(),
        type: 'error'
      }

      setErrors(prev => [...prev.slice(-9), error])
    }

    // Global promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error: ErrorInfo = {
        id: `promise-${Date.now()}-${Math.random()}`,
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date(),
        type: 'error'
      }

      setErrors(prev => [...prev.slice(-9), error])
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      // Restore original console methods
      console.error = originalError
      console.warn = originalWarn
      console.log = originalLog

      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id))
  }

  const clearAllErrors = () => {
    setErrors([])
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Bug className="h-4 w-4 text-blue-500" />
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (process.env.NODE_ENV !== 'development' || errors.length === 0) {
    return <>{children}</>
  }

  return (
    <>
      {children}

      {/* Error Notification Panel */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-12 h-12' : 'w-96 max-h-96'}`}>
        {isMinimized ? (
          // Minimized view - just a red dot with count
          <button
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-red-600 transition-colors"
          >
            {errors.length}
          </button>
        ) : (
          // Full panel
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Debug Console</span>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {errors.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearAllErrors}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Error List */}
            <div className="max-h-80 overflow-y-auto">
              {errors.slice(-5).reverse().map((error) => (
                <div
                  key={error.id}
                  className={`p-3 border-b border-gray-100 ${getColors(error.type)}`}
                >
                  <div className="flex items-start gap-2">
                    {getIcon(error.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {error.timestamp.toLocaleTimeString()}
                        </span>
                        <button
                          onClick={() => removeError(error.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs font-mono mt-1 break-words">
                        {error.message}
                      </p>
                      {error.stack && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-gray-600 hover:text-gray-800">
                            Stack trace
                          </summary>
                          <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-x-auto whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors.length > 5 && (
              <div className="p-2 text-center text-xs text-gray-500 bg-gray-50 rounded-b-lg">
                Showing last 5 of {errors.length} errors
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}