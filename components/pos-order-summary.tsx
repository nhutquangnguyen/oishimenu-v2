"use client"

import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { OrderItem } from "@/app/pos/page"
import Image from "next/image"

interface POSOrderSummaryProps {
  items: OrderItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onClearOrder: () => void
  onPlaceOrder: () => void
  selectedSource: "onsite" | "takeaway"
  onSourceChange: (source: "onsite" | "takeaway") => void
}

export function POSOrderSummary({
  items,
  onUpdateQuantity,
  onClearOrder,
  onPlaceOrder,
  selectedSource,
  onSourceChange
}: POSOrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 0
  const total = subtotal - discount

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Item</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Qty</span>
            <span className="text-sm text-gray-600">Price</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <div className="bg-white px-3 py-2 rounded">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Cà Phê Caramel Kem Muối...
                Salted Caramel Cream Coffee
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value="1"
              className="w-8 text-center border rounded px-1 py-1 text-sm"
              readOnly
            />
            <button className="p-1 rounded hover:bg-gray-100">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm font-medium">35.000₫</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <div className="bg-white px-3 py-2 rounded">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-600">
              Matcha Đá Xay - Matcha Blended
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value="1"
              className="w-8 text-center border rounded px-1 py-1 text-sm"
              readOnly
            />
            <button className="p-1 rounded hover:bg-gray-100">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm font-medium">32.000₫</span>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="nguyen quang (0344270427)"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <button className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400">
          Continue Select Source
        </button>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <Image
              src="/dinh-logo.png"
              alt="DINH"
              width={60}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSourceChange("onsite")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSource === "onsite"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              On site
            </button>
            <button
              onClick={() => onSourceChange("takeaway")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSource === "takeaway"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Takeaway
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-2 bg-white rounded-lg border px-3 py-2">
            <Image
              src="/shopee-logo.png"
              alt="Shopee"
              width={80}
              height={24}
              className="object-contain"
            />
            <span className="text-xs text-gray-600">Shopee</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border px-3 py-2">
            <Image
              src="/grabfood-logo.png"
              alt="GrabFood"
              width={80}
              height={24}
              className="object-contain"
            />
            <span className="text-xs text-gray-600">Grab food</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fixed</span>
            <button className="text-blue-500 text-sm">Add Discount</button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment Method</span>
            <select className="text-sm border rounded px-2 py-1">
              <option>Cash</option>
              <option>Card</option>
              <option>Bank Transfer</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Unpaid</span>
            <span className="text-sm">-</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">POS</span>
            <span className="text-sm">-</span>
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Sub Total</span>
            <span className="text-sm font-medium">67.000₫</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Discount</span>
            <span className="text-sm">0₫</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">67.000₫</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">Order Notes</label>
          <textarea
            placeholder="Enter Order Notes"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:border-blue-500 focus:outline-none resize-none"
            rows={2}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClearOrder}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={onPlaceOrder}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 shadow-md"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  )
}