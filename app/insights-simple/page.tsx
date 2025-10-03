"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { SalesOverviewCard } from "@/components/sales-overview-card"

export default function InsightsSimplePage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Insights (Simple)</h1>
        <SalesOverviewCard />
      </div>
    </DashboardLayout>
  )
}