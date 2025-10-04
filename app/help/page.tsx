"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessageCircle, Book, Phone, Mail, ExternalLink } from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function HelpPage() {
  const { t } = useTranslation()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('help.title')}</h1>
          <p className="text-gray-600">{t('help.subtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Book className="h-5 w-5 text-blue-600" />
{t('help.documentation')}
              </CardTitle>
              <CardDescription>
{t('help.documentationDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('help.learnFeatures')}
              </p>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                {t('help.viewDocumentation')}
                <ExternalLink className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
{t('help.liveChat')}
              </CardTitle>
              <CardDescription>
{t('help.liveChatDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('help.instantHelp')}
              </p>
              <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
                {t('help.startChat')}
                <MessageCircle className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-purple-600" />
{t('help.faq')}
              </CardTitle>
              <CardDescription>
                {t('help.faqDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('help.quickAnswers')}
              </p>
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                {t('help.browseFAQ')}
                <ExternalLink className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('help.contactSupport')}</CardTitle>
              <CardDescription>{t('help.contactSupportDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{t('help.phoneSupport')}</p>
                  <p className="text-sm text-gray-600">{t('help.phoneNumber')}</p>
                  <p className="text-xs text-gray-500">{t('help.phoneHours')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{t('help.emailSupport')}</p>
                  <p className="text-sm text-gray-600">{t('help.emailAddress')}</p>
                  <p className="text-xs text-gray-500">{t('help.responseTime')}</p>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
{t('help.submitTicket')}
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('help.quickHelp')}</CardTitle>
              <CardDescription>{t('help.quickHelpDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">{t('help.topic1')}</h3>
                <p className="text-sm text-gray-600">{t('help.topic1Desc')}</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">{t('help.googleAuth')}</h3>
                <p className="text-sm text-gray-600">{t('help.googleAuthDesc')}</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">{t('help.inventoryManagement')}</h3>
                <p className="text-sm text-gray-600">{t('help.inventoryDesc')}</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">{t('help.orderProcessing')}</h3>
                <p className="text-sm text-gray-600">{t('help.orderProcessingDesc')}</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">{t('help.analyticsReports')}</h3>
                <p className="text-sm text-gray-600">{t('help.analyticsDesc')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('help.systemStatus')}</CardTitle>
            <CardDescription>{t('help.systemStatusDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">{t('help.apiServices')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">{t('help.database')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">{t('help.paymentProcessing')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">{t('help.notifications')}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
{t('help.allOperational')} {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}