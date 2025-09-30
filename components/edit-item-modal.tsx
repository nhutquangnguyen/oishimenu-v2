"use client"

import { useState } from "react"
import { X, Upload, Check, Edit3 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MenuItem {
  id: string
  name: string
  price: string
  image: string
}

interface EditItemModalProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
}

export function EditItemModal({ item, isOpen, onClose }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: item.name,
    description: "",
    category: "Combo năng lượng",
    price: "48000",
    availability: "all-opening-hours"
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">EDIT ITEM</h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src="/api/placeholder/80/80"
                    alt="Item"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </div>
                <button className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-md">
                  <Upload className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">ADD PHOTO</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NAME *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DESCRIPTION
            </label>
            <textarea
              placeholder="Item description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TRANSLATIONS
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Item name and description are translated to 4 languages.
            </p>
            <button className="text-sm text-blue-600 hover:underline">
              Edit translations
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CATEGORY *
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Combo năng lượng">Combo năng lượng</SelectItem>
                <SelectItem value="Combo Trà Chiều">Combo Trà Chiều</SelectItem>
                <SelectItem value="MÓN MỚI">MÓN MỚI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AVAILABILITY SCHEDULE *
            </label>
            <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-opening-hours">All opening hours</SelectItem>
                <SelectItem value="weekdays">Weekdays only</SelectItem>
                <SelectItem value="weekends">Weekends only</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <span>Mon - Sun</span>
              <span>When store opens - When store closes</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AVAILABLE FOR
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">Delivery</span>
              </label>
              <label className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">Scheduled Delivery</span>
              </label>
              <label className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">Dine-in</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PRICE *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">₫</span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button className="mt-2 text-sm text-blue-600 hover:underline">
              Set custom prices
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">OPTION GROUPS</h3>
              <button className="text-sm text-blue-600 hover:underline">
                Edit
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>= Đá</span>
                <span>1 options, pick up to 1 (optional)</span>
              </div>
              <div className="flex justify-between">
                <span>= Kích cỡ</span>
                <span>2 options, pick 1</span>
              </div>
              <div className="flex justify-between">
                <span>= Ban dừng thêm bánh...</span>
                <span>1 options, pick up to 1 (optional)</span>
              </div>
              <div className="flex justify-between">
                <span>= Độ ngọt</span>
                <span>2 options, pick 1</span>
              </div>
              <div className="flex justify-between">
                <span>= Topping</span>
                <span>9 options, pick up to 9 (optional)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t p-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            Delete Item
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-grab-green px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            Save and add category info
          </button>
        </div>
      </div>
    </div>
  )
}