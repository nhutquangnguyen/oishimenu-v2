"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  DollarSign,
  Target,
  Menu,
  Package,
  Users,
  HelpCircle,
  Settings,
  ShoppingCart,
  Bell,
} from "lucide-react"
import { UserProfile } from "./user-profile"
import { getStockAlerts } from "@/lib/services/inventory"
import type { StockAlert } from "@/lib/types/inventory"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Insights", href: "/insights", icon: TrendingUp },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "POS", href: "/pos", icon: ShoppingCart },
  { name: "Feedback", href: "/feedback", icon: MessageSquare },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Marketing", href: "/marketing", icon: Target },
  { name: "Menu", href: "/menu", icon: Menu },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Help Centre", href: "/help", icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    const loadAlertCount = async () => {
      try {
        const alerts = await getStockAlerts()
        const unacknowledgedCount = alerts.filter(alert => !alert.isAcknowledged).length
        setAlertCount(unacknowledgedCount)
      } catch (error) {
        console.error('Error loading alert count:', error)
      }
    }

    loadAlertCount()
    // Refresh alert count every minute
    const interval = setInterval(loadAlertCount, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            OishiMenu
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const isNotifications = item.name === "Notifications"
          const showBadge = isNotifications && alertCount > 0

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              {showBadge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50">
          Get the App
        </button>
      </div>

      <div className="border-t p-4">
        <UserProfile />
      </div>
    </div>
  )
}