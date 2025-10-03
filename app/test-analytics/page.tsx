"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function TestAnalyticsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function testDashboardMetrics() {
    try {
      setLoading(true)
      setError(null)

      const { getDashboardMetrics } = await import('@/lib/services/analytics')
      const metrics = await getDashboardMetrics()
      setResult(metrics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function testSalesOverview() {
    try {
      setLoading(true)
      setError(null)

      const { getSalesOverview } = await import('@/lib/services/analytics')
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)

      const overview = await getSalesOverview(startDate, endDate)
      setResult(overview)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Analytics</h1>

        <div className="space-y-4 mb-6">
          <button
            onClick={testDashboardMetrics}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test Dashboard Metrics'}
          </button>

          <button
            onClick={testSalesOverview}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test Sales Overview'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold text-gray-800 mb-2">Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}