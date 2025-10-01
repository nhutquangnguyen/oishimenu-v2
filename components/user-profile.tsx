"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/firebase-auth-context"
import { User, LogOut, Settings, ChevronDown } from "lucide-react"

export function UserProfile() {
  const { user, userData, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-purple-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userData?.name || user.displayName || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                // Add profile settings logic here
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              Account Settings
            </button>

            <hr className="my-1" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}