"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TrendingUp, Clock, Loader2 } from "lucide-react"
import { getTodayOrders, getOrderStats } from "@/lib/services/order"

interface BusinessStats {
  todaySales: number
  todayTransactions: number
  lastUpdated: Date
}

export function BusinessGlanceCard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusinessStats()

    // Refresh every 30 seconds
    const interval = setInterval(loadBusinessStats, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadBusinessStats() {
    try {
      setLoading(true)

      // Get today's date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Fetch today's orders and stats
      const [todayOrders, orderStats] = await Promise.all([
        getTodayOrders(),
        getOrderStats(today, tomorrow)
      ])

      const todaySales = todayOrders
        .filter(order => order.status === 'DELIVERED' || order.status === 'READY')
        .reduce((sum, order) => sum + order.total, 0)

      const todayTransactions = todayOrders
        .filter(order => order.status !== 'CANCELLED' && order.status !== 'FAILED')
        .length

      setStats({
        todaySales,
        todayTransactions,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Error loading business stats:', error)
      // Use fallback data if Firebase fails
      setStats({
        todaySales: 0,
        todayTransactions: 0,
        lastUpdated: new Date()
      })
    } finally {
      setLoading(false)
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount).replace('₫', '₫')
  }

  function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return t('business.timeAgo.seconds')
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t('business.timeAgo.minutes')}`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${t('business.timeAgo.hours')}`
    return t('business.timeAgo.moreThanDay')
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('business.glanceTitle')}</h2>
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            <span>
              {stats ? `${t('business.lastUpdated')}: ${formatTimeAgo(stats.lastUpdated)}` : t('business.loading')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="mb-1 text-sm opacity-90">{t('business.netSalesToday')}</p>
            <p className="text-3xl font-bold">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  {t('business.loading')}
                </span>
              ) : (
                formatCurrency(stats?.todaySales || 0)
              )}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm opacity-90">{t('business.transactionsToday')}</p>
            <p className="text-3xl font-bold">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  {t('business.loading')}
                </span>
              ) : (
                stats?.todayTransactions || 0
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10" />
    </div>
  )
}