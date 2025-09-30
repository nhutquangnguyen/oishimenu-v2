"use client"

import { TrendingUp, TrendingDown, Users, UserCheck, RotateCcw } from "lucide-react"

interface CustomerMetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative"
  description?: string
  icon?: React.ReactNode
}

function CustomerMetricCard({
  title,
  value,
  change,
  changeType = "negative",
  description,
  icon
}: CustomerMetricCardProps) {
  return (
    <div className="flex-1">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="mb-1 text-2xl font-bold text-gray-900">{value}</div>
      {change && (
        <div className={`text-sm ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
          {change}
        </div>
      )}
      {description && (
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}

export function CustomerMetrics() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Total customers</h2>
            <p className="text-3xl font-bold text-gray-900">120</p>
            <p className="text-sm text-red-500">-35.48% from previous 7 days</p>
          </div>
          <p className="max-w-xs text-right text-sm text-gray-500">
            Customers are grouped by week on graph, info previous Monday
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Customers who placed at least 1 order with you in the specified time period.
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex gap-8">
          <CustomerMetricCard
            title="New"
            icon={<div className="h-2 w-2 rounded-full bg-green-600" />}
            value="86"
            change="-41.10% from previous 7 days"
            changeType="negative"
            description="Customers who placed their first order with you in the past 90 days, including those returning after 180 days."
          />

          <CustomerMetricCard
            title="Repeat"
            icon={<div className="h-2 w-2 rounded-full bg-blue-600" />}
            value="33"
            change="-13.16% from previous 7 days"
            changeType="negative"
            description="Customers who placed more than 1 order with you in the past 90 days."
          />

          <CustomerMetricCard
            title="Reactivated"
            icon={<div className="h-2 w-2 rounded-full bg-yellow-600" />}
            value="1"
            change="-50.00% from previous 7 days"
            changeType="negative"
            description="Customers who placed an order with you after more than 90 days of not ordering from you."
          />
        </div>
      </div>
    </div>
  )
}