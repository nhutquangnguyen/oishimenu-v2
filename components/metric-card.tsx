"use client"

import { Info, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  changeLabel?: string
  showInfo?: boolean
  prefix?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  showInfo = false,
  prefix = "",
}: MetricCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm text-gray-600">{title}</h3>
        {showInfo && <Info className="h-4 w-4 text-gray-400" />}
      </div>

      <div className="mb-1 flex items-baseline gap-1">
        {prefix && <span className="text-2xl font-bold text-gray-900">{prefix}</span>}
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      {subtitle && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}

      {change !== undefined && changeLabel && (
        <div className="mt-2 flex items-center gap-1">
          {isPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
          {isNegative && <TrendingDown className="h-4 w-4 text-red-500" />}
          <span
            className={cn(
              "text-sm",
              isPositive && "text-green-500",
              isNegative && "text-red-500",
              !isPositive && !isNegative && "text-gray-500"
            )}
          >
            {change > 0 ? "+" : ""}{change}% {changeLabel}
          </span>
        </div>
      )}
    </div>
  )
}