"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Star, TrendingUp, MessageSquare, Gift } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function MarketingPage() {
  const { t } = useTranslation()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('marketing.title')}</h1>
          <p className="text-gray-600">{t('marketing.subtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('marketing.customerAcquisition')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+248</div>
              <p className="text-xs text-muted-foreground">
                {t('marketing.fromLastMonth', { value: '+12%' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('marketing.customerRetention')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">
                {t('marketing.fromLastMonth', { value: '+2.1%' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('marketing.averageRating')}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground">
                {t('marketing.fromLastMonth', { value: '+0.2' })}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {t('marketing.activePromotions')}
              </CardTitle>
              <CardDescription>{t('marketing.activePromotionsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-green-800">{t('marketing.promotion1Title')}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('marketing.statusActive')}</span>
                </div>
                <p className="text-sm text-green-700 mb-2">{t('marketing.promotion1Time')}</p>
                <p className="text-xs text-green-600">{t('marketing.usedTimes', { count: 245 })}</p>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-blue-800">{t('marketing.promotion2Title')}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{t('marketing.statusActive')}</span>
                </div>
                <p className="text-sm text-blue-700 mb-2">{t('marketing.promotion2Desc')}</p>
                <p className="text-xs text-blue-600">{t('marketing.usedTimes', { count: 89 })}</p>
              </div>

              <button className="w-full mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                {t('marketing.createNewPromotion')}
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t('marketing.customerFeedback')}
              </CardTitle>
              <CardDescription>{t('marketing.customerFeedbackDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{t('marketing.hoursAgo', { hours: 2 })}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{t('marketing.feedback1Quote')}</p>
                <p className="text-xs text-gray-500">- {t('marketing.feedback1Author')}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4].map(i => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="text-xs text-gray-500">{t('marketing.hoursAgo', { hours: 5 })}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{t('marketing.feedback2Quote')}</p>
                <p className="text-xs text-gray-500">- {t('marketing.feedback2Author')}</p>
              </div>

              <button className="w-full mt-4 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50">
                {t('marketing.viewAllFeedback')}
              </button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('marketing.campaignPerformance')}
            </CardTitle>
            <CardDescription>{t('marketing.campaignPerformanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">{t('marketing.socialMedia')}</h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">1,234</div>
                <p className="text-sm text-gray-600">{t('marketing.followersGained')}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">{t('marketing.emailMarketing')}</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">45.2%</div>
                <p className="text-sm text-gray-600">{t('marketing.openRate')}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">{t('marketing.referralProgram')}</h3>
                <div className="text-2xl font-bold text-purple-600 mb-1">23</div>
                <p className="text-sm text-gray-600">{t('marketing.newReferrals')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}