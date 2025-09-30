"use client"

import { Trophy } from "lucide-react"

export function TopPerformerCard() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-sm font-medium text-gray-700">Top-performing store</h3>
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-900">
          Dinh Barista - Coffee & Tea - 46A Đường số 22
        </p>
      </div>
    </div>
  )
}