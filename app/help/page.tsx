"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessageCircle, Book, Phone, Mail, ExternalLink } from "lucide-react"

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help Centre</h1>
          <p className="text-gray-600">Get support and find answers to common questions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Book className="h-5 w-5 text-blue-600" />
                Documentation
              </CardTitle>
              <CardDescription>
                Comprehensive guides and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Learn how to use all features of OishiMenu with step-by-step guides.
              </p>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                View Documentation
                <ExternalLink className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Live Chat
              </CardTitle>
              <CardDescription>
                Chat with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Get instant help from our customer support representatives.
              </p>
              <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
                Start Chat
                <MessageCircle className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                FAQ
              </CardTitle>
              <CardDescription>
                Frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Find quick answers to the most common questions.
              </p>
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                Browse FAQ
                <ExternalLink className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Reach out to our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-600">+84 (0) 123 456 789</p>
                  <p className="text-xs text-gray-500">Mon-Fri: 8AM - 6PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">support@oishimenu.com</p>
                  <p className="text-xs text-gray-500">Response within 24 hours</p>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Submit Support Ticket
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
              <CardDescription>Common topics and solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">How to add new menu items?</h3>
                <p className="text-sm text-gray-600">Learn how to create and manage your menu items</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">Setting up Google authentication</h3>
                <p className="text-sm text-gray-600">Configure Google OAuth for secure login</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">Managing inventory and stock alerts</h3>
                <p className="text-sm text-gray-600">Track ingredients and set up low stock notifications</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">Processing orders and payments</h3>
                <p className="text-sm text-gray-600">Handle orders from confirmation to delivery</p>
              </div>

              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-1">Understanding analytics and reports</h3>
                <p className="text-sm text-gray-600">Make data-driven decisions with insights</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of OishiMenu services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">API Services</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Database</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Payment Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Notifications</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              All systems operational. Last checked: {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}