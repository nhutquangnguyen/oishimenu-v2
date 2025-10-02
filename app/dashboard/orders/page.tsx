"use client"

import { useState } from "react"
import { OrdersOverview } from "@/components/orders-overview"
import { OrderDetailModal } from "@/components/order-detail-modal"
import type { Order } from "@/lib/types/order"

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleOrderUpdate = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder)
    // You could also update the order in the orders list here if needed
  }

  return (
    <div className="p-6">
      <OrdersOverview onOrderSelect={handleOrderSelect} />

      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  )
}