"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { InventoryItems } from "@/components/inventory-items"
import { InventoryOptionGroups } from "@/components/inventory-option-groups"
import { InventoryBulkUpdate } from "@/components/inventory-bulk-update"
import { InventoryManagement } from "@/components/inventory-management"
import { OptionManagement } from "@/components/option-management"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function InventoryPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("ingredients")

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('inventory.title')}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="border-b bg-transparent p-0">
            <TabsTrigger
              value="ingredients"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('inventory.tabs.ingredients')}
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('inventory.tabs.items')}
            </TabsTrigger>
            <TabsTrigger
              value="options"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('inventory.tabs.options')}
            </TabsTrigger>
            <TabsTrigger
              value="option-groups"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('inventory.tabs.optionGroups')}
            </TabsTrigger>
            <TabsTrigger
              value="bulk-update"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              {t('inventory.tabs.bulkUpdate')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="mt-6">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="items" className="mt-6">
            <InventoryItems />
          </TabsContent>

          <TabsContent value="options" className="mt-6">
            <OptionManagement />
          </TabsContent>

          <TabsContent value="option-groups" className="mt-6">
            <InventoryOptionGroups />
          </TabsContent>

          <TabsContent value="bulk-update" className="mt-6">
            <InventoryBulkUpdate />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}