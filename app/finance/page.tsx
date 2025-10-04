"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, CreditCard, PieChart } from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function FinancePage() {
  const { t } = useTranslation()
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('finance.title')}</h1>
          <p className="text-gray-600">{t('finance.description')}</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.totalRevenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫45,231,000</div>
              <p className="text-xs text-muted-foreground">
                {t('finance.fromLastMonth', { percent: '+20.1%' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.netProfit')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫12,234,000</div>
              <p className="text-xs text-muted-foreground">
                {t('finance.fromLastMonth', { percent: '+15.3%' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.expenses')}</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫33,997,000</div>
              <p className="text-xs text-muted-foreground">
                {t('finance.fromLastMonth', { percent: '+7%' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.profitMargin')}</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27.1%</div>
              <p className="text-xs text-muted-foreground">
                {t('finance.fromLastMonth', { percent: '+2.5%' })}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('finance.financialReports')}</CardTitle>
              <CardDescription>{t('finance.financialReportsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('finance.monthlyPLStatement')}</h3>
                <p className="text-sm text-gray-600 mb-3">{t('finance.monthlyPLDescription')}</p>
                <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  {t('finance.downloadPDF')}
                </button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('finance.taxSummary')}</h3>
                <p className="text-sm text-gray-600 mb-3">{t('finance.taxSummaryDescription')}</p>
                <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  {t('finance.downloadPDF')}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('finance.paymentMethods')}</CardTitle>
              <CardDescription>{t('finance.paymentMethodsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('finance.cash')}</span>
                <span className="text-sm">₫18,500,000 (41%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('finance.card')}</span>
                <span className="text-sm">₫15,200,000 (34%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('finance.digitalWallet')}</span>
                <span className="text-sm">₫8,800,000 (19%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('finance.bankTransfer')}</span>
                <span className="text-sm">₫2,731,000 (6%)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}