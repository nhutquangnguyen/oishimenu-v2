"use client"

import { useTranslation } from "react-i18next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BusinessGlanceCard } from "@/components/business-glance-card"
import { StockAlertsSummary } from "@/components/stock-alerts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp, Info } from "lucide-react"

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("dashboard.welcome")}</h1>

          <div className="flex gap-4 mb-6">
            <Select defaultValue="all-services">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-services">{t("dashboard.allServices")}</SelectItem>
                <SelectItem value="oishidelivery">{t("dashboard.oishiDelivery")}</SelectItem>
                <SelectItem value="shopeefood">{t("dashboard.shopeeFood")}</SelectItem>
                <SelectItem value="gomafood">{t("dashboard.gomaFood")}</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-stores">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-stores">{t("dashboard.allStores")}</SelectItem>
                <SelectItem value="store1">{t("dashboard.store1")}</SelectItem>
                <SelectItem value="store2">{t("dashboard.store2")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business at a Glance */}
        <BusinessGlanceCard />

        {/* Stock Alerts Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t("dashboard.inventoryStatus")}</h2>
            <a href="/notifications" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              {t("dashboard.viewAllAlerts")}
            </a>
          </div>
          <StockAlertsSummary />
        </div>

        {/* Business Insights Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t("dashboard.businessInfo")}</h2>
              <p className="text-sm text-gray-600">{t("dashboard.sampleData")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t("dashboard.last7Days")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Metrics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Net Sales and Cancellation Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{t("dashboard.netSales")}</h3>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">₫19.617.900</p>
                  <p className="text-sm text-green-600">+10.05% {t("dashboard.comparedToLast7Days")}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{t("dashboard.cancellationRate")}</h3>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">0.50%</p>
                  <p className="text-sm text-gray-500">{t("dashboard.thisWeek")}</p>
                </div>
              </div>

              {/* Number of Transactions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{t("dashboard.transactions")}</h3>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">255</p>
                <p className="text-sm text-green-600">+4.08% {t("dashboard.comparedToLast7Days")}</p>

                {/* Simple Chart Placeholder */}
                <div className="mt-4 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full relative">
                    <svg className="w-full h-full" viewBox="0 0 400 150">
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        points="20,120 60,110 100,100 140,90 180,85 220,80 260,70 300,60 340,65 380,75"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Key Trends */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t("dashboard.keyTrends")}</h3>
                <Info className="h-4 w-4 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{t("dashboard.driverWaitTime")}</p>
                  <p className="text-lg font-semibold text-gray-900">1 phút 39 giây</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">{t("dashboard.today")}</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">₫2.450.000</p>
                  <p className="text-sm text-gray-600">15 {t("dashboard.transactionsCount")}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">{t("dashboard.totalWeeklySales")}</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">₫19.617.900</p>
                  <p className="text-sm text-green-600">+10.05% {t("dashboard.comparedToLastWeek")}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">{t("dashboard.avgTransactionAmount")}</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">₫76.933</p>
                  <p className="text-sm text-gray-600">{t("dashboard.thisWeek")}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">{t("dashboard.totalCustomers")}</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">233</p>
                  <p className="text-sm text-green-600">+0.43% {t("dashboard.comparedToLastWeek")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">🏪</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("dashboard.salesThisWeek")}</p>
                <p className="font-semibold text-gray-900">₫19.617.900</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">☕</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("dashboard.topSellingItem")}</p>
                <p className="font-semibold text-gray-900">Matcha Latte Sữa Yến Mạch (₫1.183.000)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t("dashboard.explore")}</h2>
            <a href="#" className="text-purple-600 hover:text-purple-700 text-sm font-medium">{t("dashboard.viewAll")}</a>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-400 to-green-500 rounded-lg text-white">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold">{t("dashboard.exploreFeature")}</h3>
              <p className="text-sm opacity-90">{t("dashboard.exploreDescription")}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}