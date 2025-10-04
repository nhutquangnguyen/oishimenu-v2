"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
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
      const { updateTableStatus } = await import('@/lib/services/table')

      const orderData = {
        customer: {
          name: orderDetails.customer?.name || t('pos.walkInCustomer'),
          phone: orderDetails.customer?.phone || '',
          email: orderDetails.customer?.email || ''
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
        subtotal: orderDetails.subtotal || orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: 0,
        discount: orderDetails.discount || 0,
        tax: Math.round((orderDetails.subtotal || orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)) * 0.1),
        total: orderDetails.total || ((orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1) - (orderDetails.discount || 0)),
        orderType: orderDetails.source === 'dine-in' ? 'DINE_IN' as const : orderDetails.source === 'takeaway' ? 'TAKEAWAY' as const : 'DINE_IN' as const,
        status: 'CONFIRMED' as const,
        notes: orderDetails.notes || '',
        tableNumber: orderDetails.selectedTable?.name || orderDetails.tableNumber || '',
        paymentMethod: (orderDetails.paymentMethod || 'CASH') as any,
        paymentStatus: 'PAID' as const,
        platform: 'direct'
      }

      const orderId = await createOrder(orderData)

      if (orderId) {
        console.log("Order created successfully with ID:", orderId)

        // Update table status if dine-in order with selected table
        if (orderDetails.source === 'dine-in' && orderDetails.selectedTable) {
          try {
            await updateTableStatus(orderDetails.selectedTable.id, 'OCCUPIED', orderId)
            console.log("Table status updated to OCCUPIED")
          } catch (error) {
            console.error("Failed to update table status:", error)
          }
        }

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
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] lg:h-[calc(100vh-0rem)]">
        {/* Menu Grid - Full height on mobile, flexible on desktop */}
        <div className="flex-1 p-3 lg:p-6 overflow-auto">
          <POSMenuGrid onAddItem={handleAddItem} />
        </div>

        {/* Order Summary - Collapsible on mobile, fixed width on desktop */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-white">
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