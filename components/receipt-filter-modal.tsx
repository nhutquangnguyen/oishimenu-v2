"use client"

import { useState } from "react"

interface ReceiptFilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReceiptFilterModal({ isOpen, onClose }: ReceiptFilterModalProps) {
  const [selectedFilter, setSelectedFilter] = useState("printed")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xs rounded-lg bg-white shadow-lg">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">PICKUP IN</h2>
            <h2 className="font-semibold text-gray-900">RECEIPT ▼</h2>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="receipt"
                value="printed"
                checked={selectedFilter === "printed"}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-5 w-5 appearance-none rounded-full border-2 border-gray-300 checked:border-green-500 checked:bg-green-500"
              />
              {selectedFilter === "printed" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </div>
            <span className="text-gray-900">Printed</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="receipt"
                value="not-printed"
                checked={selectedFilter === "not-printed"}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-5 w-5 appearance-none rounded-full border-2 border-gray-300 checked:border-green-500 checked:bg-green-500"
              />
              {selectedFilter === "not-printed" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </div>
            <span className="text-gray-900">Not Printed</span>
          </label>
        </div>

        <div className="flex gap-3 border-t p-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-grab-green py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}