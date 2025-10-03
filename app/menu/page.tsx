"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ArrowLeft, Plus, Search } from "lucide-react"

export default function MenuPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Menu Management
          </h1>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>
              <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="text-center py-8 text-gray-500">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Menu Management</h3>
                <p>This page is temporarily simplified while we fix system issues.</p>
                <p className="text-sm mt-2">Full menu management functionality will be restored soon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}