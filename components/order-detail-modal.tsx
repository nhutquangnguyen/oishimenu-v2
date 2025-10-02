"use client"

import { useState } from "react"
import { X, Phone, MapPin, Clock, User, Package, CreditCard, Truck } from "lucide-react"
import { updateOrderStatus } from "@/lib/services/order"
import type { Order, OrderStatus } from "@/lib/types/order"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onOrderUpdate?: (updatedOrder: Order) => void
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
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date);
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'PREPARING':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'READY':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'OUT_FOR_DELIVERY':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'FAILED':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case 'PENDING': return 'Pending Confirmation'
    case 'CONFIRMED': return 'Confirmed'
    case 'PREPARING': return 'Being Prepared'
    case 'READY': return 'Ready for Pickup/Delivery'
    case 'OUT_FOR_DELIVERY': return 'Out for Delivery'
    case 'DELIVERED': return 'Delivered'
    case 'CANCELLED': return 'Cancelled'
    case 'FAILED': return 'Failed'
    default: return 'Unknown Status'
  }
}

export function OrderDetailModal({ order, isOpen, onClose, onOrderUpdate }: OrderDetailModalProps) {
  const [updating, setUpdating] = useState(false)

  if (!isOpen || !order) return null

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setUpdating(true)
    try {
      const success = await updateOrderStatus(order.id, newStatus)
      if (success && onOrderUpdate) {
        const updatedOrder = { ...order, status: newStatus, updatedAt: new Date() }
        onOrderUpdate(updatedOrder)
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const getAvailableStatusUpdates = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED']
      case 'CONFIRMED':
        return ['PREPARING', 'CANCELLED']
      case 'PREPARING':
        return ['READY', 'CANCELLED']
      case 'READY':
        return order.orderType === 'DELIVERY' ? ['OUT_FOR_DELIVERY'] : ['DELIVERED']
      case 'OUT_FOR_DELIVERY':
        return ['DELIVERED', 'FAILED']
      default:
        return []
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="p-6 space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
                <span className="font-medium">{getStatusText(order.status)}</span>
              </div>

              <div className="flex gap-2">
                {getAvailableStatusUpdates(order.status).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                      status === 'CANCELLED' || status === 'FAILED'
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {updating ? 'Updating...' : `Mark as ${getStatusText(status)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Customer</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Name:</span> {order.customer.name}
                  </p>
                  <p className="text-sm flex items-center gap-1">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {order.customer.phone}
                  </p>
                  {order.customer.email && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Email:</span> {order.customer.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Type & Timing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Order Type</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Type:</span> {order.orderType.replace('_', ' ')}
                  </p>
                  <p className="text-sm flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {formatDateTime(order.createdAt)}
                  </p>
                  {order.tableNumber && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Table:</span> {order.tableNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Payment</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Method:</span> {order.paymentMethod.replace('_', ' ')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Status:</span>{' '}
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Total:</span>{' '}
                    <span className="text-lg font-semibold text-purple-600">{formatPrice(order.total)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {order.orderType === 'DELIVERY' && order.deliveryInfo && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Delivery Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm flex items-start gap-1">
                      <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-blue-800">{order.deliveryInfo.address}</span>
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium text-blue-700">Delivery Fee:</span>{' '}
                      {formatPrice(order.deliveryInfo.deliveryFee)}
                    </p>
                  </div>
                  {(order.deliveryInfo.driverName || order.deliveryInfo.estimatedTime) && (
                    <div>
                      {order.deliveryInfo.driverName && (
                        <p className="text-sm">
                          <span className="font-medium text-blue-700">Driver:</span> {order.deliveryInfo.driverName}
                        </p>
                      )}
                      {order.deliveryInfo.estimatedTime && (
                        <p className="text-sm">
                          <span className="font-medium text-blue-700">Estimated Time:</span> {order.deliveryInfo.estimatedTime}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between border rounded-lg p-4 bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{item.menuItemName}</h4>
                        <span className="text-sm text-gray-600">x{item.quantity}</span>
                      </div>

                      {item.selectedOptions.length > 0 && (
                        <div className="space-y-1 mb-2">
                          <p className="text-xs font-medium text-gray-700">Selected Options:</p>
                          {item.selectedOptions.map((option, optionIndex) => (
                            <div key={optionIndex} className="text-xs text-gray-600 ml-2">
                              • {option.groupName}: {option.optionName}
                              {option.optionPrice > 0 && (
                                <span className="text-gray-500"> (+{formatPrice(option.optionPrice)})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-xs text-gray-600 italic">Note: {item.notes}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.subtotal)}</p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.basePrice)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4">
              <div className="space-y-2 max-w-md ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-purple-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Special Notes */}
            {order.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Special Instructions</h3>
                <p className="text-sm text-yellow-700">{order.notes}</p>
              </div>
            )}

            {/* Order Timeline */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Order Timeline</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">Order placed:</span>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
                {order.confirmedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-600">Confirmed:</span>
                    <span>{formatDateTime(order.confirmedAt)}</span>
                  </div>
                )}
                {order.readyAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">Ready:</span>
                    <span>{formatDateTime(order.readyAt)}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-600">Delivered:</span>
                    <span>{formatDateTime(order.deliveredAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}