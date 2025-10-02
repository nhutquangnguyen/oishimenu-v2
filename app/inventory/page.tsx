"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { InventoryItems } from "@/components/inventory-items"
import { InventoryOptionGroups } from "@/components/inventory-option-groups"
import { InventoryBulkUpdate } from "@/components/inventory-bulk-update"
import { InventoryManagement } from "@/components/inventory-management"
import { OptionManagement } from "@/components/option-management"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("ingredients")

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="border-b bg-transparent p-0">
            <TabsTrigger
              value="ingredients"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              INGREDIENTS
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              ITEMS
            </TabsTrigger>
            <TabsTrigger
              value="options"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              OPTIONS
            </TabsTrigger>
            <TabsTrigger
              value="option-groups"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              OPTION GROUPS
            </TabsTrigger>
            <TabsTrigger
              value="bulk-update"
              className="rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              BULK UPDATE
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