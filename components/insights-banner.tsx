"use client"

import { X } from "lucide-react"
import { useState } from "react"

export function InsightsBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative mb-6 rounded-lg bg-yellow-50 p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-yellow-100 p-2">
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#FFC107"
                stroke="#FFA000"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Get more out of your business today!</h3>
          <p className="mt-1 text-sm text-gray-600">
            Discover insights into your sales, customers, offers and more. Use these to optimise your business performance and plan your next move.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 rounded-md p-1 hover:bg-yellow-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
        <button className="flex-shrink-0 rounded-md bg-grab-green px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
          Learn More
        </button>
      </div>
    </div>
  )
}