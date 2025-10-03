"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { POSMenuGrid } from "@/components/pos-menu-grid"
import { POSOrderSummaryV3 } from "@/components/pos-order-summary-v3"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  menuItemId: string
  selectedOptions?: Array<{
    groupName: string
    optionName: string
    optionPrice: number
  }>
}

export default function POSPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const handleAddItem = (item: Omit<OrderItem, "quantity">) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, {
        ...item,
        quantity: 1,
        menuItemId: item.id,
        selectedOptions: item.selectedOptions || []
      }]
    })
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.id !== id))
    } else {
      setOrderItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const handleClearOrder = () => {
    setOrderItems([])
  }

  const handlePlaceOrder = async (orderDetails: any) => {
    try {
      // Create order with real Firebase data
      const { createOrder } = await import('@/lib/services/order')

      const orderData = {
        customer: {
          name: orderDetails.customerName || 'Walk-in Customer',
          phone: orderDetails.customerPhone || '',
          email: orderDetails.customerEmail
        },
        items: orderItems.map(item => ({
          id: `item-${Date.now()}-${Math.random()}`,
          menuItemId: item.menuItemId,
          menuItemName: item.name,
          basePrice: item.price,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || [],
          subtotal: item.price * item.quantity
        })),
        subtotal: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: 0,
        discount: orderDetails.discount || 0,
        tax: Math.round(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1),
        total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1 - (orderDetails.discount || 0),
        orderType: orderDetails.orderType || 'DINE_IN',
        status: 'CONFIRMED',
        notes: orderDetails.notes,
        tableNumber: orderDetails.tableNumber,
        paymentMethod: orderDetails.paymentMethod || 'CASH',
        paymentStatus: 'PAID',
        platform: 'direct'
      }

      const orderId = await createOrder(orderData)

      if (orderId) {
        console.log("Order created successfully with ID:", orderId)
        setOrderItems([])
        // Could show success message here
      } else {
        console.error("Failed to create order")
        // Could show error message here
      }
    } catch (error) {
      console.error("Error placing order:", error)
      // Could show error message here
    }
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex-1 p-6 overflow-auto">
          <POSMenuGrid onAddItem={handleAddItem} />
        </div>
        <div className="w-96 border-l bg-white">
          <POSOrderSummaryV3
            items={orderItems}
            onUpdateQuantity={handleUpdateQuantity}
            onClearOrder={handleClearOrder}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}