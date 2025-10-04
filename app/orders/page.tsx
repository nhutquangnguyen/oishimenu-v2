"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersTable } from "@/components/orders-table"
import { StoreStatusSelector } from "@/components/store-status-selector"
import { ReceiptFilterModal } from "@/components/receipt-filter-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Grid, List, ChevronDown } from "lucide-react"

export default function OrdersPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("preparing")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [showReceiptFilter, setShowReceiptFilter] = useState(false)
  const [showStatusSelector, setShowStatusSelector] = useState(false)

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('orders.storeName')}
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowStatusSelector(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-600 hover:to-purple-700 shadow-md"
            >
              {t('orders.statusNormal')}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <TabsList className="border-b bg-transparent p-0">
              <TabsTrigger
                value="preparing"
                className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
              >
                {t('orders.tabPreparing')}
              </TabsTrigger>
              <TabsTrigger
                value="ready"
                className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
              >
                {t('orders.tabReady')}
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
              >
                {t('orders.tabUpcoming')}
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
              >
                {t('orders.tabHistory')}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg border p-2 ${
                  viewMode === "grid"
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-purple-50"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg border p-2 ${
                  viewMode === "list"
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-purple-50"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <TabsContent value="preparing">
            <OrdersTable
              status="preparing"
              showReceiptFilter={() => setShowReceiptFilter(true)}
              viewMode={viewMode}
            />
          </TabsContent>

          <TabsContent value="ready">
            <OrdersTable
              status="ready"
              showReceiptFilter={() => setShowReceiptFilter(true)}
              viewMode={viewMode}
            />
          </TabsContent>

          <TabsContent value="upcoming">
            <OrdersTable
              status="upcoming"
              showReceiptFilter={() => setShowReceiptFilter(true)}
              viewMode={viewMode}
            />
          </TabsContent>

          <TabsContent value="history">
            <OrdersTable
              status="history"
              showReceiptFilter={() => setShowReceiptFilter(true)}
              viewMode={viewMode}
            />
          </TabsContent>
        </Tabs>

        {showStatusSelector && (
          <StoreStatusSelector
            isOpen={showStatusSelector}
            onClose={() => setShowStatusSelector(false)}
          />
        )}

        {showReceiptFilter && (
          <ReceiptFilterModal
            isOpen={showReceiptFilter}
            onClose={() => setShowReceiptFilter(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}