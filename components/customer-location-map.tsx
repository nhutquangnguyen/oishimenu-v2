"use client"

import { MapPin } from "lucide-react"
import { useState } from "react"

export function CustomerLocationMap() {
  const [orderFilter, setOrderFilter] = useState("more")

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your customers' location</h2>
          <p className="text-sm text-gray-600">
            See where your customers are ordering from. You can zoom in and out of the map.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">More orders</span>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="h-3 w-3 rounded-full bg-green-600" />
          </div>
          <span className="text-sm text-gray-600">Fewer orders</span>
        </div>
      </div>

      <div className="relative h-96 overflow-hidden rounded-lg bg-gray-100">
        {/* Placeholder map with overlay dots to simulate customer locations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          {/* Simulate map background */}
          <svg className="h-full w-full" viewBox="0 0 800 400">
            {/* Simple map lines */}
            <line x1="200" y1="0" x2="200" y2="400" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="400" y1="0" x2="400" y2="400" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="600" y1="0" x2="600" y2="400" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="300" x2="800" y2="300" stroke="#e5e7eb" strokeWidth="1" />

            {/* Customer location clusters */}
            <circle cx="400" cy="200" r="40" fill="#10B981" opacity="0.3" />
            <circle cx="400" cy="200" r="30" fill="#10B981" opacity="0.4" />
            <circle cx="400" cy="200" r="20" fill="#10B981" opacity="0.5" />

            <circle cx="350" cy="180" r="25" fill="#10B981" opacity="0.3" />
            <circle cx="450" cy="220" r="25" fill="#10B981" opacity="0.3" />
            <circle cx="380" cy="240" r="20" fill="#10B981" opacity="0.4" />
            <circle cx="420" cy="160" r="20" fill="#10B981" opacity="0.4" />

            <circle cx="300" cy="150" r="15" fill="#34D399" opacity="0.5" />
            <circle cx="500" cy="250" r="15" fill="#34D399" opacity="0.5" />
            <circle cx="450" cy="180" r="12" fill="#34D399" opacity="0.5" />
            <circle cx="380" cy="200" r="12" fill="#34D399" opacity="0.5" />

            {/* Smaller scattered dots */}
            <circle cx="320" cy="190" r="8" fill="#6EE7B7" opacity="0.6" />
            <circle cx="480" cy="210" r="8" fill="#6EE7B7" opacity="0.6" />
            <circle cx="360" cy="220" r="8" fill="#6EE7B7" opacity="0.6" />
            <circle cx="410" cy="190" r="8" fill="#6EE7B7" opacity="0.6" />
            <circle cx="390" cy="170" r="8" fill="#6EE7B7" opacity="0.6" />
            <circle cx="430" cy="230" r="8" fill="#6EE7B7" opacity="0.6" />
          </svg>
        </div>

        {/* Map overlay text */}
        <div className="absolute bottom-4 left-4 rounded bg-white px-3 py-2 shadow-md">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Ho Chi Minh City</span>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-1">
          <button className="rounded bg-white px-2 py-1 shadow-md hover:bg-gray-50">
            <span className="text-lg font-bold">+</span>
          </button>
          <button className="rounded bg-white px-2 py-1 shadow-md hover:bg-gray-50">
            <span className="text-lg font-bold">−</span>
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Note: This is a simulated map view. In production, this would integrate with a real mapping service like Google Maps or Mapbox.
      </p>
    </div>
  )
}