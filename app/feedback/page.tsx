"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
// import { CustomerRatings } from "@/components/customer-ratings"
// import { CustomerReviews } from "@/components/customer-reviews"
// import { IncidentsTab } from "@/components/incidents-tab"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        </div>

        <Tabs defaultValue="ratings" className="w-full">
          <TabsList className="mb-6 border-b bg-transparent p-0">
            <TabsTrigger
              value="ratings"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              Ratings and reviews
            </TabsTrigger>
            <TabsTrigger
              value="incidents"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm font-medium text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:shadow-none"
            >
              Incidents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ratings" className="space-y-6">
            <div className="flex gap-4">
              <Select defaultValue="ho-chi-minh">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ho-chi-minh">Ho Chi Minh</SelectItem>
                  <SelectItem value="hanoi">Hanoi</SelectItem>
                  <SelectItem value="da-nang">Da Nang</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="grabfood">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grabfood">GrabFood</SelectItem>
                  <SelectItem value="grabmart">GrabMart</SelectItem>
                  <SelectItem value="grabexpress">GrabExpress</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="delivery">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-stores">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-stores">All stores</SelectItem>
                  <SelectItem value="store1">Dinh Barista - Coffee & Tea</SelectItem>
                  <SelectItem value="store2">Dinh Barista - Coffee & Tea - 46A Đường số 22</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-500">Customer ratings component will load here</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-500">Customer reviews component will load here</p>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-500">Incidents tab component will load here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}