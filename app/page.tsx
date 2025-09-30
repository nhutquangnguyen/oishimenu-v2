"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BusinessGlanceCard } from "@/components/business-glance-card"
import { MetricCard } from "@/components/metric-card"
import { TransactionChart } from "@/components/transaction-chart"
import { TopPerformerCard } from "@/components/top-performer-card"
import { TopSellingItem } from "@/components/top-selling-item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarDays, Store, Info } from "lucide-react"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
        </div>

        <div className="mb-6 flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grab services</SelectItem>
              <SelectItem value="food">GrabFood</SelectItem>
              <SelectItem value="mart">GrabMart</SelectItem>
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

        <div className="mb-8">
          <BusinessGlanceCard />
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Business insights</h2>
              <p className="text-sm text-gray-600">Based on data taken on 28 Sep</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CalendarDays className="h-4 w-4" />
                22 Sep - 28 Sep
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-orange-500 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
                <Info className="h-4 w-4" />
                2 Data Exclusion(s)
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Net sales"
              prefix="₫"
              value="12.103.200"
              subtitle="-39.68% from previous 7 days"
              showInfo
            />
            <MetricCard
              title="Avoidable cancellation rate"
              value="0.00%"
              subtitle="0.00pp from previous 7 days"
              showInfo
            />
            <MetricCard
              title="Total customers"
              value="128"
              change={-39.62}
              changeLabel="from previous 7 days"
            />
            <TransactionChart />
            <MetricCard
              title="Gross sales"
              prefix="₫"
              value="15.048.000"
              change={-39.34}
              changeLabel="from previous 7 days"
            />
            <MetricCard
              title="Net sales from offers"
              prefix="₫"
              value="11.762.200"
              change={-36.04}
              changeLabel="from previous 7 days"
            />
            <div className="md:col-span-2 lg:col-span-1">
              <MetricCard
                title="Driver waiting time"
                value="2 min 16 s"
                change={-20.16}
                changeLabel="from previous 7 days"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <MetricCard
                title="Average transaction amount"
                prefix="₫"
                value="82.335"
                change={-7.88}
                changeLabel="from previous 7 days"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TopPerformerCard />
          <TopSellingItem />
        </div>
      </div>
    </DashboardLayout>
  )
}