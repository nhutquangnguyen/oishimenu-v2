"use client"

import { Info } from "lucide-react"

export function AvoidableCancellationRate() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Avoidable cancellation rate</h2>
          <button className="rounded-full p-1 hover:bg-gray-100">
            <Info className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:underline">
          See store breakdown
        </button>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900">0.00</span>
        <span className="text-2xl text-gray-500">%</span>
        <span className="ml-4 text-sm text-gray-500">0.00 pp</span>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        0 of 131 Orders cancelled · You're doing great!
      </p>

      <div className="mt-6 rounded-lg bg-green-50 p-4">
        <p className="text-sm text-green-800">
          ✨ Excellent performance! Keep up the great work in maintaining zero cancellations.
        </p>
      </div>
    </div>
  )
}