"use client"

import { ShoppingBag } from "lucide-react"

export function TopSellingItem() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-blue-500" />
        <h3 className="text-sm font-medium text-gray-700">Top-selling item</h3>
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-900">Matcha latte</p>
      </div>
    </div>
  )
}