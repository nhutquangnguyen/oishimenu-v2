"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InsightsBanner } from "@/components/insights-banner"
import { SalesOverviewCard } from "@/components/sales-overview-card"
import { SalesChart } from "@/components/sales-chart"
import { StorePerformanceTable } from "@/components/store-performance-table"
import { ItemPerformanceTable } from "@/components/item-performance-table"
import { SuggestedCombosTable } from "@/components/suggested-combos-table"
import { CustomerMetrics } from "@/components/customer-metrics"
import { CustomerChart } from "@/components/customer-chart"
import { CustomerLocationMap } from "@/components/customer-location-map"
import { OfflineRate } from "@/components/offline-rate"
import { PeakHoursHeatmap } from "@/components/peak-hours-heatmap"
import { AvoidableCancellationRate } from "@/components/avoidable-cancellation-rate"
import { OffersOverview } from "@/components/offers-overview"
import { OffersSalesChart } from "@/components/offers-sales-chart"
import { TopPerformingOffersTable } from "@/components/top-performing-offers-table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarDays, Info, HelpCircle } from "lucide-react"

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-orange-500 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
              <Info className="h-4 w-4" />
              2 Data Exclusion(s)
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </button>
          </div>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="mb-6 border-b bg-transparent p-0">
            <TabsTrigger
              value="sales"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              Menu
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              Customers
            </TabsTrigger>
            <TabsTrigger
              value="operations"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              Operations
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              Offers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <InsightsBanner />

            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarDays className="h-4 w-4" />
                22 Sep - 28 Sep
              </button>

              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OishiMenu services</SelectItem>
                  <SelectItem value="food">OishiDelivery</SelectItem>
                  <SelectItem value="mart">OishiMart</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">All stores</SelectItem>
                  <SelectItem value="store1">Store 1</SelectItem>
                  <SelectItem value="store2">Store 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SalesOverviewCard />

            <SalesChart />

            <StorePerformanceTable />
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <InsightsBanner />

            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarDays className="h-4 w-4" />
                23 Sep - 29 Sep
              </button>

              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OishiMenu services</SelectItem>
                  <SelectItem value="food">OishiDelivery</SelectItem>
                  <SelectItem value="mart">OishiMart</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">All stores</SelectItem>
                  <SelectItem value="store1">Dinh Barista - Coffee & Tea</SelectItem>
                  <SelectItem value="store2">Dinh Barista - Coffee & Tea - 46A Đường số 22</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ItemPerformanceTable />

            <SuggestedCombosTable />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <InsightsBanner />

            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarDays className="h-4 w-4" />
                23 Sep - 29 Sep
              </button>

              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OishiMenu services</SelectItem>
                  <SelectItem value="food">OishiDelivery</SelectItem>
                  <SelectItem value="mart">OishiMart</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">All stores</SelectItem>
                  <SelectItem value="store1">Dinh Barista - Coffee & Tea</SelectItem>
                  <SelectItem value="store2">Dinh Barista - Coffee & Tea - 46A Đường số 22</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CustomerMetrics />

            <CustomerChart />

            <CustomerLocationMap />
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <InsightsBanner />

            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarDays className="h-4 w-4" />
                23 Sep - 29 Sep
              </button>

              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OishiMenu services</SelectItem>
                  <SelectItem value="food">OishiDelivery</SelectItem>
                  <SelectItem value="mart">OishiMart</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">All stores</SelectItem>
                  <SelectItem value="store1">Dinh Barista - Coffee & Tea</SelectItem>
                  <SelectItem value="store2">Dinh Barista - Coffee & Tea - 46A Đường số 22</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <OfflineRate />

            <PeakHoursHeatmap />

            <AvoidableCancellationRate />
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <InsightsBanner />

            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarDays className="h-4 w-4" />
                23 Sep - 29 Sep
              </button>

              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OishiMenu services</SelectItem>
                  <SelectItem value="food">OishiDelivery</SelectItem>
                  <SelectItem value="mart">OishiMart</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">All stores</SelectItem>
                  <SelectItem value="store1">Dinh Barista - Coffee & Tea</SelectItem>
                  <SelectItem value="store2">Dinh Barista - Coffee & Tea - 46A Đường số 22</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-offer-types">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All offer types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-offer-types">All offer types</SelectItem>
                  <SelectItem value="discount">Discount offers</SelectItem>
                  <SelectItem value="free-item">Free item offers</SelectItem>
                  <SelectItem value="delivery">Delivery offers</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-offers">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All offers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-offers">All offers</SelectItem>
                  <SelectItem value="active">Active offers</SelectItem>
                  <SelectItem value="ended">Ended offers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <OffersOverview />

            <OffersSalesChart />

            <TopPerformingOffersTable />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}