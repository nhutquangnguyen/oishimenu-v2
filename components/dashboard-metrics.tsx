"use client"

import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react"

export function DashboardMetrics() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "₫24,500,000",
      change: "+12.5%",
      icon: DollarSign,
      positive: true
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      icon: ShoppingCart,
      positive: true
    },
    {
      title: "Active Customers",
      value: "856",
      change: "+5.1%",
      icon: Users,
      positive: true
    },
    {
      title: "Avg Order Value",
      value: "₫198,000",
      change: "-2.3%",
      icon: TrendingUp,
      positive: false
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className={`text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <metric.icon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}