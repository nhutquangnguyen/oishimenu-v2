"use client"

import { Edit, Download, Package } from "lucide-react"

export function InventoryBulkUpdate() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk update</h2>
        <p className="text-gray-600 mb-6">
          Bulk update helps you manage an extensive menu efficiently. Update the stock of up to 20,000 items in one go.{" "}
          <button className="text-blue-600 hover:underline">
            Learn how to do a bulk update.
          </button>
        </p>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-lg border border-purple-600 bg-white px-6 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50">
            <Edit className="h-4 w-4" />
            Edit inventory in bulk
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Download current inventory
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>

        <div className="rounded-lg border bg-white">
          <div className="border-b p-4">
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600">
              <div>FILE NAME</div>
              <div>NO. OF ITEMS</div>
              <div>STATUS</div>
              <div>DATE</div>
              <div>USER EMAIL</div>
              <div>DOWNLOAD</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-lg bg-yellow-100 p-4">
              <Package className="h-12 w-12 text-yellow-600" />
            </div>
            <p className="text-gray-600">Your bulk updates will show up here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}