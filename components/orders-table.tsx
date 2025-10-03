"use client"

import { useState, useEffect } from "react"
import { Package, ChevronDown, Loader2, Eye } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getOrders, updateOrderStatus, getOrderStats } from "@/lib/services/order"
import type { Order as FirebaseOrder, OrderStatus } from "@/lib/types/order"

interface OrdersTableProps {
  status: "preparing" | "ready" | "upcoming" | "history"
  showReceiptFilter: () => void
  viewMode: "grid" | "list"
}

interface OrderStats {
  netSales: number
  completedOrders: number
  cancelledOrders: number
}

export function OrdersTable({ status, showReceiptFilter, viewMode }: OrdersTableProps) {
  const [dateFilter, setDateFilter] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }))
  const [statusFilter, setStatusFilter] = useState("All")
  const [orders, setOrders] = useState<FirebaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<FirebaseOrder | null>(null)

  useEffect(() => {
    loadOrders()
  }, [status])

  async function loadOrders() {
    try {
      setLoading(true)

      let orderStatus: OrderStatus[] = []

      switch (status) {
        case 'preparing':
          orderStatus = ['PENDING', 'CONFIRMED', 'PREPARING']
          break
        case 'ready':
          orderStatus = ['READY', 'OUT_FOR_DELIVERY']
          break
        case 'upcoming':
          orderStatus = ['PENDING']
          break
        case 'history':
          orderStatus = ['DELIVERED', 'CANCELLED', 'FAILED']
          break
      }

      const fetchedOrders = await getOrders({
        status: orderStatus,
        limit: 50
      })

      setOrders(fetchedOrders)

      // If showing history, also get stats
      if (status === 'history') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const stats = await getOrderStats(today, tomorrow)
        if (stats) {
          setOrderStats({
            netSales: stats.totalRevenue,
            completedOrders: stats.ordersByStatus.DELIVERED || 0,
            cancelledOrders: stats.ordersByStatus.CANCELLED || 0
          })
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      const success = await updateOrderStatus(orderId, newStatus)
      if (success) {
        // Refresh orders
        loadOrders()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount).replace('₫', '₫')
  }

  function getStatusColor(orderStatus: OrderStatus): string {
    switch (orderStatus) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800'
      case 'READY':
        return 'bg-green-100 text-green-800'
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusText(orderStatus: OrderStatus): string {
    switch (orderStatus) {
      case 'PENDING': return 'Pending'
      case 'CONFIRMED': return 'Confirmed'
      case 'PREPARING': return 'Preparing'
      case 'READY': return 'Ready'
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery'
      case 'DELIVERED': return 'Completed'
      case 'CANCELLED': return 'Cancelled'
      case 'FAILED': return 'Failed'
      default: return orderStatus
    }
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 rounded-lg bg-gray-100 p-6">
        <Package className="h-12 w-12 text-gray-400" />
      </div>
      <p className="text-gray-600">No data</p>
    </div>
  )

  const renderHistorySummary = () => (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
        <p className="text-sm text-gray-600">{dateFilter}</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-600">Net sales</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin inline" />
            ) : (
              formatCurrency(orderStats?.netSales || 0)
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completed orders</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin inline" />
            ) : (
              orderStats?.completedOrders || 0
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Cancelled orders</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin inline" />
            ) : (
              orderStats?.cancelledOrders || 0
            )}
          </p>
        </div>
      </div>
    </div>
  )

  const renderHistoryTable = () => (
    <div className="rounded-lg bg-white shadow-sm">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  ORDER NUMBER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  CUSTOMER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  ITEMS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  TOTAL AMOUNT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  DATE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-gray-500">{order.customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-xs">
                          {item.quantity}x {item.menuItemName}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString('vi-VN')}
                    <br />
                    {order.createdAt.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderStandardTable = () => (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                ORDER ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                TOTAL AMOUNT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                ITEMS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                DRIVER
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                PICKUP IN
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={showReceiptFilter}
                  className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-600 hover:text-gray-900"
                >
                  RECEIPT
                  <ChevronDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                ORDER READY?
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Empty state will be rendered */}
          </tbody>
        </table>
      </div>
      {renderEmptyState()}
    </div>
  )

  if (status === "history") {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderHistorySummary()}
        {renderHistoryTable()}
      </div>
    )
  }

  return renderStandardTable()
}