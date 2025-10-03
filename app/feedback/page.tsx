"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FeedbackManagement } from "@/components/feedback-management"

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
          <p className="text-gray-600 mt-1">Manage customer reviews and ratings</p>
        </div>

        <FeedbackManagement />
      </div>
    </DashboardLayout>
  )
}