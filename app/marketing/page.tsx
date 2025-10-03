"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Star, TrendingUp, MessageSquare, Gift } from "lucide-react"

export default function MarketingPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketing</h1>
          <p className="text-gray-600">Manage promotions, campaigns, and customer engagement</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Acquisition</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+248</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground">
                +0.2 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Active Promotions
              </CardTitle>
              <CardDescription>Manage current promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-green-800">Happy Hour 30% Off</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-sm text-green-700 mb-2">Daily 2PM - 5PM</p>
                <p className="text-xs text-green-600">Used 245 times this month</p>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-blue-800">Buy 2 Get 1 Free</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-sm text-blue-700 mb-2">All beverages</p>
                <p className="text-xs text-blue-600">Used 89 times this month</p>
              </div>

              <button className="w-full mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Create New Promotion
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Customer Feedback
              </CardTitle>
              <CardDescription>Recent customer reviews and ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">"Amazing matcha latte! Perfect balance of flavor."</p>
                <p className="text-xs text-gray-500">- Nguyễn Văn A</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4].map(i => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">"Good coffee, fast delivery. Would order again."</p>
                <p className="text-xs text-gray-500">- Trần Thị B</p>
              </div>

              <button className="w-full mt-4 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50">
                View All Feedback
              </button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Performance
            </CardTitle>
            <CardDescription>Track the effectiveness of your marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">Social Media</h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">1,234</div>
                <p className="text-sm text-gray-600">Followers gained</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">Email Marketing</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">45.2%</div>
                <p className="text-sm text-gray-600">Open rate</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">Referral Program</h3>
                <div className="text-2xl font-bold text-purple-600 mb-1">23</div>
                <p className="text-sm text-gray-600">New referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}