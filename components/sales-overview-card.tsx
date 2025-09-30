"use client"

import { Info } from "lucide-react"

interface SalesMetricProps {
  title: string
  value: string
  prefix?: string
  change?: string
  changeColor?: string
}

function SalesMetric({ title, value, prefix = "", change, changeColor = "text-red-500" }: SalesMetricProps) {
  return (
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <div className="mt-1 flex items-baseline gap-1">
        {prefix && <span className="text-2xl font-bold text-gray-900">{prefix}</span>}
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      {change && (
        <p className={`mt-1 text-sm ${changeColor}`}>{change}</p>
      )}
    </div>
  )
}

export function SalesOverviewCard() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Sales overview</h2>

      <div className="grid grid-cols-4 gap-6">
        <SalesMetric
          title="Gross sales"
          prefix="₫"
          value="15.048.000"
          change="-39.34% from previous 7 days"
        />
        <SalesMetric
          title="Net sales"
          prefix="₫"
          value="12.103.200"
          change="-39.68% from previous 7 days"
        />
        <SalesMetric
          title="Number of transactions"
          value="147"
          change="-34.67% from previous 7 days"
        />
        <SalesMetric
          title="Average transaction amount"
          prefix="₫"
          value="82.335"
          change="-7.68% from previous 7 days"
        />
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Net sales</p>
            <p className="mt-1 text-sm text-gray-600">
              The total sales after deducting merchant-funded discounts, delivery charges and payment refunds.
            </p>
            <button className="mt-2 text-sm font-medium text-blue-600 hover:underline">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}