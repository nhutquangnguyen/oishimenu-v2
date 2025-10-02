"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StockAlerts } from "@/components/stock-alerts"
import { Bell, BellOff, Check, AlertTriangle } from "lucide-react"

export default function NotificationsPage() {
  const [showAll, setShowAll] = useState(false)
  const [alertCount, setAlertCount] = useState(0)

  const handleAlertCountChange = (count: number) => {
    setAlertCount(count)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="h-7 w-7 text-purple-600" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor stock levels and inventory alerts
              </p>
            </div>

            <div className="flex items-center gap-4">
              {alertCount > 0 && (
                <div className="bg-red-100 border border-red-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-800">
                      {alertCount} pending alert{alertCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={showAll}
                    onChange={(e) => setShowAll(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Show acknowledged alerts
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {/* This would be calculated from alerts */}
                  --
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Critical/Out of Stock</p>
                <p className="text-2xl font-bold text-red-900">
                  {/* This would be calculated from alerts */}
                  --
                </p>
              </div>
              <BellOff className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Acknowledged Today</p>
                <p className="text-2xl font-bold text-green-900">
                  {/* This would be calculated from alerts */}
                  --
                </p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {showAll ? 'All Stock Alerts' : 'Pending Stock Alerts'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {showAll
                ? 'View all stock alerts including acknowledged ones'
                : 'Review and acknowledge pending stock alerts'
              }
            </p>
          </div>

          <div className="p-6">
            <StockAlerts
              showAll={showAll}
              onAlertCountChange={handleAlertCountChange}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            About Stock Alerts
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Low Stock:</strong> Ingredient quantity is at or below the minimum threshold
            </p>
            <p>
              <strong>Critical:</strong> Ingredient quantity is 50% or less of the minimum threshold
            </p>
            <p>
              <strong>Out of Stock:</strong> Ingredient quantity is zero or negative
            </p>
            <p className="mt-3">
              Stock alerts are automatically created when ingredients are used in orders.
              Acknowledge alerts to remove them from the pending list.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}