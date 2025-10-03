"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, CreditCard, PieChart } from "lucide-react"

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Finance</h1>
          <p className="text-gray-600">Manage your financial reports and analytics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫45,231,000</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫12,234,000</div>
              <p className="text-xs text-muted-foreground">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫33,997,000</div>
              <p className="text-xs text-muted-foreground">
                +7% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27.1%</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Download and view detailed financial reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Monthly P&L Statement</h3>
                <p className="text-sm text-gray-600 mb-3">Detailed profit and loss for October 2024</p>
                <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Download PDF
                </button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Tax Summary</h3>
                <p className="text-sm text-gray-600 mb-3">VAT and tax calculations for Q3 2024</p>
                <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Download PDF
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Revenue breakdown by payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cash</span>
                <span className="text-sm">₫18,500,000 (41%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Card</span>
                <span className="text-sm">₫15,200,000 (34%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Digital Wallet</span>
                <span className="text-sm">₫8,800,000 (19%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bank Transfer</span>
                <span className="text-sm">₫2,731,000 (6%)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}