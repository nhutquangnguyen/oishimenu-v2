import { getOrders, getOrderStats } from '@/lib/services/order'
import { getMenuItems } from '@/lib/services/menu'
import type { Order, OrderStatus } from '@/lib/types/order'

// Cache management
interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class AnalyticsCache {
  private cache: Map<string, CacheItem<any>> = new Map()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

// Global cache instance
const analyticsCache = new AnalyticsCache()

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  DASHBOARD: 5 * 60 * 1000,      // 5 minutes
  INSIGHTS: 10 * 60 * 1000,     // 10 minutes
  DAILY_STATS: 30 * 60 * 1000,  // 30 minutes
  WEEKLY_STATS: 60 * 60 * 1000, // 1 hour
  MENU_ANALYTICS: 15 * 60 * 1000 // 15 minutes
}

// Types for analytics data
export interface DashboardMetrics {
  todaySales: number
  todayTransactions: number
  weeklyNetSales: number
  weeklyTransactions: number
  averageOrderValue: number
  totalCustomers: number
  cancellationRate: number
  weeklyGrowth: {
    sales: number
    transactions: number
    customers: number
  }
  topProduct: {
    name: string
    revenue: number
  } | null
  lastUpdated: Date
}

export interface SalesOverview {
  grossSales: number
  netSales: number
  transactions: number
  averageTransaction: number
  previousPeriodComparison: {
    grossSales: number
    netSales: number
    transactions: number
    averageTransaction: number
  }
}

export interface MenuAnalytics {
  topItems: Array<{
    menuItemName: string
    quantity: number
    revenue: number
    percentage: number
  }>
  categoryPerformance: Array<{
    categoryName: string
    revenue: number
    orderCount: number
    percentage: number
  }>
  itemTrends: Array<{
    menuItemName: string
    weeklyGrowth: number
    totalOrders: number
  }>
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  customerRetentionRate: number
  averageOrdersPerCustomer: number
  customerLifetimeValue: number
  topCustomers: Array<{
    customerName: string
    phone: string
    totalOrders: number
    totalSpent: number
  }>
}

export interface OperationalMetrics {
  averagePreparationTime: number
  onTimeDeliveryRate: number
  cancellationRate: number
  avoidableCancellationRate: number
  peakHours: Array<{
    hour: number
    orderCount: number
  }>
  deliveryPerformance: {
    averageDeliveryTime: number
    successRate: number
  }
}

/**
 * Get comprehensive dashboard metrics with caching
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const cacheKey = 'dashboard-metrics'
  const cached = analyticsCache.get<DashboardMetrics>(cacheKey)
  if (cached) return cached

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Get orders for different periods
    const [todayOrders, thisWeekOrders, lastWeekOrders] = await Promise.all([
      getOrders({ dateFrom: today, dateTo: tomorrow, limit: 500 }),
      getOrders({ dateFrom: weekAgo, dateTo: today, limit: 1000 }),
      getOrders({ dateFrom: twoWeeksAgo, dateTo: weekAgo, limit: 1000 })
    ])

    // Calculate today's metrics
    const todayCompleted = todayOrders.filter(order =>
      order.status === 'DELIVERED' || order.status === 'READY'
    )
    const todaySales = todayCompleted.reduce((sum, order) => sum + order.total, 0)
    const todayTransactions = todayCompleted.length

    // Calculate weekly metrics
    const thisWeekCompleted = thisWeekOrders.filter(order =>
      order.status === 'DELIVERED' || order.status === 'READY'
    )
    const lastWeekCompleted = lastWeekOrders.filter(order =>
      order.status === 'DELIVERED' || order.status === 'READY'
    )

    const weeklyNetSales = thisWeekCompleted.reduce((sum, order) => sum + order.total, 0)
    const weeklyTransactions = thisWeekCompleted.length
    const lastWeekSales = lastWeekCompleted.reduce((sum, order) => sum + order.total, 0)
    const lastWeekTransactionCount = lastWeekCompleted.length

    // Calculate growth percentages
    const salesGrowth = lastWeekSales > 0 ?
      ((weeklyNetSales - lastWeekSales) / lastWeekSales) * 100 : 0
    const transactionGrowth = lastWeekTransactionCount > 0 ?
      ((weeklyTransactions - lastWeekTransactionCount) / lastWeekTransactionCount) * 100 : 0

    // Calculate other metrics
    const averageOrderValue = weeklyTransactions > 0 ? weeklyNetSales / weeklyTransactions : 0
    const uniqueCustomers = new Set(thisWeekOrders.map(order => order.customer.phone)).size
    const lastWeekCustomers = new Set(lastWeekOrders.map(order => order.customer.phone)).size
    const customerGrowth = lastWeekCustomers > 0 ?
      ((uniqueCustomers - lastWeekCustomers) / lastWeekCustomers) * 100 : 0

    // Cancellation rate
    const totalOrders = thisWeekOrders.length
    const cancelledOrders = thisWeekOrders.filter(order =>
      order.status === 'CANCELLED' || order.status === 'FAILED'
    ).length
    const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0

    // Top product
    const productStats = thisWeekCompleted.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.menuItemName]) {
          acc[item.menuItemName] = { quantity: 0, revenue: 0 }
        }
        acc[item.menuItemName].quantity += item.quantity
        acc[item.menuItemName].revenue += item.subtotal
      })
      return acc
    }, {} as Record<string, { quantity: number; revenue: number }>)

    const topProduct = Object.entries(productStats)
      .sort(([, a], [, b]) => b.revenue - a.revenue)[0]

    const metrics: DashboardMetrics = {
      todaySales,
      todayTransactions,
      weeklyNetSales,
      weeklyTransactions,
      averageOrderValue,
      totalCustomers: uniqueCustomers,
      cancellationRate,
      weeklyGrowth: {
        sales: salesGrowth,
        transactions: transactionGrowth,
        customers: customerGrowth
      },
      topProduct: topProduct ? {
        name: topProduct[0],
        revenue: topProduct[1].revenue
      } : null,
      lastUpdated: new Date()
    }

    analyticsCache.set(cacheKey, metrics, CACHE_TTL.DASHBOARD)
    return metrics

  } catch (error) {
    console.error('Error calculating dashboard metrics:', error)
    // Return fallback metrics
    return {
      todaySales: 0,
      todayTransactions: 0,
      weeklyNetSales: 0,
      weeklyTransactions: 0,
      averageOrderValue: 0,
      totalCustomers: 0,
      cancellationRate: 0,
      weeklyGrowth: { sales: 0, transactions: 0, customers: 0 },
      topProduct: null,
      lastUpdated: new Date()
    }
  }
}

/**
 * Get sales overview for insights page
 */
export async function getSalesOverview(dateFrom: Date, dateTo: Date): Promise<SalesOverview> {
  const cacheKey = `sales-overview-${dateFrom.getTime()}-${dateTo.getTime()}`
  const cached = analyticsCache.get<SalesOverview>(cacheKey)
  if (cached) return cached

  try {
    // Calculate period length
    const periodLength = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24))

    // Previous period dates
    const prevDateTo = new Date(dateFrom)
    const prevDateFrom = new Date(dateFrom)
    prevDateFrom.setDate(prevDateFrom.getDate() - periodLength)

    const [currentOrders, previousOrders] = await Promise.all([
      getOrders({ dateFrom, dateTo, limit: 2000 }),
      getOrders({ dateFrom: prevDateFrom, dateTo: prevDateTo, limit: 2000 })
    ])

    // Current period metrics
    const currentCompleted = currentOrders.filter(order =>
      order.status === 'DELIVERED' || order.status === 'READY'
    )
    const grossSales = currentCompleted.reduce((sum, order) => sum + order.total, 0)
    const netSales = currentCompleted.reduce((sum, order) =>
      sum + order.total - (order.deliveryFee || 0), 0
    )
    const transactions = currentCompleted.length
    const averageTransaction = transactions > 0 ? grossSales / transactions : 0

    // Previous period metrics
    const previousCompleted = previousOrders.filter(order =>
      order.status === 'DELIVERED' || order.status === 'READY'
    )
    const prevGrossSales = previousCompleted.reduce((sum, order) => sum + order.total, 0)
    const prevNetSales = previousCompleted.reduce((sum, order) =>
      sum + order.total - (order.deliveryFee || 0), 0
    )
    const prevTransactions = previousCompleted.length
    const prevAverageTransaction = prevTransactions > 0 ? prevGrossSales / prevTransactions : 0

    // Calculate percentage changes
    const grossSalesChange = prevGrossSales > 0 ?
      ((grossSales - prevGrossSales) / prevGrossSales) * 100 : 0
    const netSalesChange = prevNetSales > 0 ?
      ((netSales - prevNetSales) / prevNetSales) * 100 : 0
    const transactionsChange = prevTransactions > 0 ?
      ((transactions - prevTransactions) / prevTransactions) * 100 : 0
    const avgTransactionChange = prevAverageTransaction > 0 ?
      ((averageTransaction - prevAverageTransaction) / prevAverageTransaction) * 100 : 0

    const overview: SalesOverview = {
      grossSales,
      netSales,
      transactions,
      averageTransaction,
      previousPeriodComparison: {
        grossSales: grossSalesChange,
        netSales: netSalesChange,
        transactions: transactionsChange,
        averageTransaction: avgTransactionChange
      }
    }

    analyticsCache.set(cacheKey, overview, CACHE_TTL.INSIGHTS)
    return overview

  } catch (error) {
    console.error('Error calculating sales overview:', error)
    return {
      grossSales: 0,
      netSales: 0,
      transactions: 0,
      averageTransaction: 0,
      previousPeriodComparison: {
        grossSales: 0,
        netSales: 0,
        transactions: 0,
        averageTransaction: 0
      }
    }
  }
}

/**
 * Get menu analytics
 */
export async function getMenuAnalytics(dateFrom: Date, dateTo: Date): Promise<MenuAnalytics> {
  const cacheKey = `menu-analytics-${dateFrom.getTime()}-${dateTo.getTime()}`
  const cached = analyticsCache.get<MenuAnalytics>(cacheKey)
  if (cached) return cached

  try {
    const [orders, menuItems] = await Promise.all([
      getOrders({ dateFrom, dateTo, limit: 2000 }),
      getMenuItems()
    ])

    const completedOrders = orders.filter(order =>
      order.status === 'DELIVERED' || order.status === 'READY'
    )

    // Calculate item performance
    const itemStats = completedOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.menuItemName]) {
          acc[item.menuItemName] = {
            quantity: 0,
            revenue: 0,
            orders: new Set()
          }
        }
        acc[item.menuItemName].quantity += item.quantity
        acc[item.menuItemName].revenue += item.subtotal
        acc[item.menuItemName].orders.add(order.id)
      })
      return acc
    }, {} as Record<string, { quantity: number; revenue: number; orders: Set<string> }>)

    const totalRevenue = Object.values(itemStats).reduce((sum, item) => sum + item.revenue, 0)

    const topItems = Object.entries(itemStats)
      .map(([name, stats]) => ({
        menuItemName: name,
        quantity: stats.quantity,
        revenue: stats.revenue,
        percentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Calculate category performance
    const categoryStats = menuItems.reduce((acc, item) => {
      const category = item.categoryName || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = { revenue: 0, orderCount: 0 }
      }

      const itemStat = itemStats[item.name]
      if (itemStat) {
        acc[category].revenue += itemStat.revenue
        acc[category].orderCount += itemStat.orders.size
      }

      return acc
    }, {} as Record<string, { revenue: number; orderCount: number }>)

    const categoryPerformance = Object.entries(categoryStats)
      .map(([name, stats]) => ({
        categoryName: name,
        revenue: stats.revenue,
        orderCount: stats.orderCount,
        percentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)

    const analytics: MenuAnalytics = {
      topItems,
      categoryPerformance,
      itemTrends: [] // TODO: Implement trend calculation with historical data
    }

    analyticsCache.set(cacheKey, analytics, CACHE_TTL.MENU_ANALYTICS)
    return analytics

  } catch (error) {
    console.error('Error calculating menu analytics:', error)
    return {
      topItems: [],
      categoryPerformance: [],
      itemTrends: []
    }
  }
}

/**
 * Clear all analytics cache
 */
export function clearAnalyticsCache(): void {
  analyticsCache.clear()
}

/**
 * Utility function to format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount).replace('₫', '₫')
}

/**
 * Utility function to format percentage
 */
export function formatPercentage(value: number, showSign: boolean = true): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Utility function to get color class for percentage changes
 */
export function getChangeColor(value: number): string {
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-600'
}