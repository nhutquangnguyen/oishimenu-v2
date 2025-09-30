"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface StoreStatusSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function StoreStatusSelector({ isOpen, onClose }: StoreStatusSelectorProps) {
  const [selectedStatus, setSelectedStatus] = useState("normal")

  const statusOptions = [
    {
      id: "normal",
      name: "Normal",
      color: "bg-green-500",
      description: ""
    },
    {
      id: "busy",
      name: "Busy",
      color: "bg-orange-500",
      description: "Adjust the preparation time for orders"
    },
    {
      id: "paused",
      name: "Paused",
      color: "bg-red-500",
      description: "Stop orders temporarily"
    }
  ]

  if (!isOpen) return null

  const handleConfirm = () => {
    // Handle status change logic here
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Set Store Status</h2>

        <div className="space-y-4">
          {statusOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedStatus(option.id)}
              className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className={`h-4 w-4 rounded-full ${option.color}`} />
                <div>
                  <h3 className="font-medium text-gray-900">{option.name}</h3>
                  {option.description && (
                    <p className="text-sm text-gray-600">{option.description}</p>
                  )}
                </div>
              </div>
              {selectedStatus === option.id && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className="mt-6 w-full rounded-lg bg-grab-green py-3 text-white font-medium hover:bg-green-600"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}