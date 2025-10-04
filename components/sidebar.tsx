"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
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
  Grid3X3,
  X,
} from "lucide-react"
import { UserProfile } from "./user-profile"

const navigation = [
  { name: "nav.dashboard", href: "/dashboard", icon: Home },
  { name: "nav.insights", href: "/insights", icon: TrendingUp },
  { name: "nav.orders", href: "/orders", icon: ShoppingBag },
  { name: "nav.pos", href: "/pos", icon: ShoppingCart },
  { name: "nav.tables", href: "/tables", icon: Grid3X3 },
  { name: "nav.feedback", href: "/feedback", icon: MessageSquare },
  { name: "nav.finance", href: "/finance", icon: DollarSign },
  { name: "nav.marketing", href: "/marketing", icon: Target },
  { name: "nav.menu", href: "/menu", icon: Menu },
  { name: "nav.inventory", href: "/inventory", icon: Package },
  { name: "nav.employees", href: "/employees", icon: Users },
  { name: "nav.help", href: "/help", icon: HelpCircle },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps = {}) {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            OishiMenu
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              {t(item.name)}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50">
          {t("common.getApp")}
        </button>
      </div>

      <div className="border-t p-4">
        <UserProfile />
      </div>
    </div>
  )
}