"use client"

import { Info, TrendingUp } from "lucide-react"

export function OfflineRate() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Offline rate</h2>
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
        0 minutes · You're doing great!
      </p>
    </div>
  )
}