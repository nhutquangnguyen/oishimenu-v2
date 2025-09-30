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
      return [...prev, { ...item, quantity: 1 }]
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

  const handlePlaceOrder = (orderDetails: any) => {
    // Handle order placement logic here
    console.log("Order placed with details:", orderDetails)
    setOrderItems([])
  }

  return (
    <DashboardLayout>
      <div className="flex h-full">
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