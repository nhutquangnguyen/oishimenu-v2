"use client"

import { useTranslation } from "react-i18next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MenuOverview } from "@/components/menu-overview"
import { OptionGroups } from "@/components/option-groups"
import { BulkUpdate } from "@/components/bulk-update"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"

export default function MenuPage() {
  const { t } = useTranslation()

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('menu.title')}
          </h1>
        </div>

        <Tabs defaultValue="menu-overview" className="w-full">
          <TabsList className="mb-6 border-b bg-transparent p-0">
            <TabsTrigger
              value="menu-overview"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('menu.tabs.menuItems')}
            </TabsTrigger>
            <TabsTrigger
              value="option-groups"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('menu.tabs.optionGroups')}
            </TabsTrigger>
            <TabsTrigger
              value="bulk-update"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('menu.tabs.bulkUpdate')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu-overview">
            <MenuOverview />
          </TabsContent>

          <TabsContent value="option-groups">
            <OptionGroups />
          </TabsContent>

          <TabsContent value="bulk-update">
            <BulkUpdate />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}