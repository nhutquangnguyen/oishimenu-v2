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
import { useTranslation } from "react-i18next"

export default function InsightsPage() {
  const { t } = useTranslation()
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('insights.title')}</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-orange-500 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
              <Info className="h-4 w-4" />
              {t('insights.dataExclusions', { count: 2 })}
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <HelpCircle className="h-4 w-4" />
              {t('insights.helpSupport')}
            </button>
          </div>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="mb-6 border-b bg-transparent p-0">
            <TabsTrigger
              value="sales"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('insights.tabs.sales')}
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('insights.tabs.menu')}
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('insights.tabs.customers')}
            </TabsTrigger>
            <TabsTrigger
              value="operations"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('insights.tabs.operations')}
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('insights.tabs.offers')}
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
                  <SelectValue placeholder={t('insights.filters.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('insights.filters.allServices')}</SelectItem>
                  <SelectItem value="food">{t('insights.filters.oishiDelivery')}</SelectItem>
                  <SelectItem value="mart">{t('insights.filters.oishiMart')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('insights.filters.selectStore')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">{t('insights.filters.allStores')}</SelectItem>
                  <SelectItem value="store1">{t('insights.filters.store1')}</SelectItem>
                  <SelectItem value="store2">{t('insights.filters.store2')}</SelectItem>
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
                  <SelectValue placeholder={t('insights.filters.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('insights.filters.allServices')}</SelectItem>
                  <SelectItem value="food">{t('insights.filters.oishiDelivery')}</SelectItem>
                  <SelectItem value="mart">{t('insights.filters.oishiMart')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('insights.filters.selectStore')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">{t('insights.filters.allStores')}</SelectItem>
                  <SelectItem value="store1">{t('insights.filters.store1')}</SelectItem>
                  <SelectItem value="store2">{t('insights.filters.store2')}</SelectItem>
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
                  <SelectValue placeholder={t('insights.filters.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('insights.filters.allServices')}</SelectItem>
                  <SelectItem value="food">{t('insights.filters.oishiDelivery')}</SelectItem>
                  <SelectItem value="mart">{t('insights.filters.oishiMart')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('insights.filters.selectStore')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">{t('insights.filters.allStores')}</SelectItem>
                  <SelectItem value="store1">{t('insights.filters.store1')}</SelectItem>
                  <SelectItem value="store2">{t('insights.filters.store2')}</SelectItem>
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
                  <SelectValue placeholder={t('insights.filters.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('insights.filters.allServices')}</SelectItem>
                  <SelectItem value="food">{t('insights.filters.oishiDelivery')}</SelectItem>
                  <SelectItem value="mart">{t('insights.filters.oishiMart')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('insights.filters.selectStore')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">{t('insights.filters.allStores')}</SelectItem>
                  <SelectItem value="store1">{t('insights.filters.store1')}</SelectItem>
                  <SelectItem value="store2">{t('insights.filters.store2')}</SelectItem>
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
                  <SelectValue placeholder={t('insights.filters.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('insights.filters.allServices')}</SelectItem>
                  <SelectItem value="food">{t('insights.filters.oishiDelivery')}</SelectItem>
                  <SelectItem value="mart">{t('insights.filters.oishiMart')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('insights.filters.selectStore')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">{t('insights.filters.allStores')}</SelectItem>
                  <SelectItem value="store1">{t('insights.filters.store1')}</SelectItem>
                  <SelectItem value="store2">{t('insights.filters.store2')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-offer-types">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('insights.filters.allOfferTypes')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-offer-types">{t('insights.filters.allOfferTypes')}</SelectItem>
                  <SelectItem value="discount">{t('insights.filters.discountOffers')}</SelectItem>
                  <SelectItem value="free-item">{t('insights.filters.freeItemOffers')}</SelectItem>
                  <SelectItem value="delivery">{t('insights.filters.deliveryOffers')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-offers">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('insights.filters.allOffers')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-offers">{t('insights.filters.allOffers')}</SelectItem>
                  <SelectItem value="active">{t('insights.filters.activeOffers')}</SelectItem>
                  <SelectItem value="ended">{t('insights.filters.endedOffers')}</SelectItem>
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