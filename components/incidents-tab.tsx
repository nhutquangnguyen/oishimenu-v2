"use client"

import { Package } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function IncidentsTab() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <input
          type="text"
          value="2025-09-23 → 2025-09-30"
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          readOnly
        />

        <Select defaultValue="all-incident-types">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-incident-types">Incident type</SelectItem>
            <SelectItem value="delivery-delay">Delivery delay</SelectItem>
            <SelectItem value="wrong-order">Wrong order</SelectItem>
            <SelectItem value="missing-items">Missing items</SelectItem>
            <SelectItem value="quality-issue">Quality issue</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-resolution-types">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-resolution-types">Resolution type</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
            <SelectItem value="replacement">Replacement</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="dinh-barista">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dinh-barista">Dinh Barista - Coffee & Tea</SelectItem>
            <SelectItem value="dinh-barista-46a">Dinh Barista - Coffee & Tea - 46A Đường số 22</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Date</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Short Order Number</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Description</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Resolution</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-700">No incidents reported. Well done!</p>
        </div>
      </div>
    </div>
  )
}