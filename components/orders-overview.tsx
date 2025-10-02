"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, RefreshCw, Eye, Clock, CheckCircle, XCircle } from "lucide-react"
import { getOrders, updateOrderStatus, searchOrders } from "@/lib/services/order"
import type { Order, OrderStatus, OrderType, OrderFilter } from "@/lib/types/order"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrdersOverviewProps {
  onOrderSelect?: (order: Order) => void
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'PREPARING':
      return 'bg-orange-100 text-orange-800'
    case 'READY':
      return 'bg-green-100 text-green-800'
    case 'OUT_FOR_DELIVERY':
      return 'bg-purple-100 text-purple-800'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case 'PENDING': return 'Pending'
    case 'CONFIRMED': return 'Confirmed'
    case 'PREPARING': return 'Preparing'
    case 'READY': return 'Ready'
    case 'OUT_FOR_DELIVERY': return 'Out for Delivery'
    case 'DELIVERED': return 'Delivered'
    case 'CANCELLED': return 'Cancelled'
    case 'FAILED': return 'Failed'
    default: return 'Unknown'
  }
}

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-4 w-4" />
    case 'CONFIRMED':
    case 'DELIVERED':
      return <CheckCircle className="h-4 w-4" />
    case 'CANCELLED':
    case 'FAILED':
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export function OrdersOverview({ onOrderSelect }: OrdersOverviewProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [statusFilter, typeFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const filter: OrderFilter = {
        limit: 100
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filter.status = [statusFilter as OrderStatus]
      }

      // Apply type filter
      if (typeFilter !== "all") {
        filter.orderType = [typeFilter as OrderType]
      }

      const fetchedOrders = await getOrders(filter)
      setOrders(fetchedOrders)

    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadOrders()
    setRefreshing(false)
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadOrders()
      return
    }

    try {
      setLoading(true)
      const searchResults = await searchOrders(searchTerm.trim())
      setOrders(searchResults)
    } catch (err) {
      console.error('Error searching orders:', err)
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const success = await updateOrderStatus(orderId, newStatus)
      if (success) {
        // Update the order in the local state
        setOrders(prev => prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        ))
      } else {
        alert('Failed to update order status')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Failed to update order status')
    }
  }

  const getQuickStatusActions = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED']
      case 'CONFIRMED':
        return ['PREPARING', 'CANCELLED']
      case 'PREPARING':
        return ['READY', 'CANCELLED']
      case 'READY':
        return ['OUT_FOR_DELIVERY', 'DELIVERED']
      case 'OUT_FOR_DELIVERY':
        return ['DELIVERED', 'FAILED']
      default:
        return []
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="Refresh orders"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order # or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-64 rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PREPARING">Preparing</SelectItem>
              <SelectItem value="READY">Ready</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="DINE_IN">Dine In</SelectItem>
              <SelectItem value="TAKEAWAY">Takeaway</SelectItem>
              <SelectItem value="DELIVERY">Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="text-red-800">
            <h3 className="font-medium">Error loading orders</h3>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-2 rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 && !loading ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm mt-1">Orders will appear here when customers place them</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {order.orderType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Customer */}
                    <div>
                      <p className="text-sm font-medium text-gray-700">Customer</p>
                      <p className="text-sm text-gray-900">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.phone}</p>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-sm font-medium text-gray-700">Items</p>
                      <p className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items.slice(0, 2).map(item => item.menuItemName).join(', ')}
                        {order.items.length > 2 && '...'}
                      </p>
                    </div>

                    {/* Time & Total */}
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total</p>
                      <p className="text-lg font-semibold text-purple-600">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</p>
                    </div>
                  </div>

                  {/* Special notes */}
                  {order.notes && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ml-4 flex flex-col gap-2">
                  <button
                    onClick={() => onOrderSelect && onOrderSelect(order)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>

                  {/* Quick status actions */}
                  {getQuickStatusActions(order.status).map((actionStatus) => (
                    <button
                      key={actionStatus}
                      onClick={() => handleStatusChange(order.id, actionStatus)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        actionStatus === 'CANCELLED' || actionStatus === 'FAILED'
                          ? 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100'
                          : 'text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {getStatusText(actionStatus)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}