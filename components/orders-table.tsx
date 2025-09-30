"use client"

import { useState } from "react"
import { Package, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Order {
  id: string
  longOrderId: string
  shortOrderId: string
  totalAmount: string
  items: string
  driver: string
  pickupIn: string
  receipt: "Printed" | "Not Printed"
  status: "Completed" | "Cancelled"
  orderReady?: boolean
}

interface OrdersTableProps {
  status: "preparing" | "ready" | "upcoming" | "history"
  showReceiptFilter: () => void
  viewMode: "grid" | "list"
}

const historyOrders: Order[] = [
  {
    id: "1",
    longOrderId: "234542687-C7NUL7X2N2LBBE",
    shortOrderId: "GF-643",
    totalAmount: "67,150₫",
    items: "",
    driver: "",
    pickupIn: "",
    receipt: "Printed",
    status: "Completed"
  },
  {
    id: "2",
    longOrderId: "460496584-C7NUL331MATCR6",
    shortOrderId: "GF-749",
    totalAmount: "32,000₫",
    items: "",
    driver: "",
    pickupIn: "",
    receipt: "Printed",
    status: "Completed"
  },
  {
    id: "3",
    longOrderId: "357476425-C7NULYKHLK5TGE",
    shortOrderId: "GF-534",
    totalAmount: "45,000₫",
    items: "",
    driver: "",
    pickupIn: "",
    receipt: "Printed",
    status: "Completed"
  },
  {
    id: "4",
    longOrderId: "339117626-C7NULK5DEYK2LA",
    shortOrderId: "GF-468",
    totalAmount: "32,000₫",
    items: "",
    driver: "",
    pickupIn: "",
    receipt: "Printed",
    status: "Completed"
  },
  {
    id: "5",
    longOrderId: "276592707-C7NULF5XWAAWGA",
    shortOrderId: "GF-803",
    totalAmount: "73,000₫",
    items: "",
    driver: "",
    pickupIn: "",
    receipt: "Printed",
    status: "Completed"
  },
  {
    id: "6",
    longOrderId: "22902234-C7NUKFVEWB2FE6",
    shortOrderId: "GF-445",
    totalAmount: "144,150₫",
    items: "",
    driver: "",
    pickupIn: "",
    receipt: "Printed",
    status: "Completed"
  }
]

export function OrdersTable({ status, showReceiptFilter, viewMode }: OrdersTableProps) {
  const [dateFilter, setDateFilter] = useState("Mon, 29 Sep 2025")
  const [statusFilter, setStatusFilter] = useState("All")

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
        <p className="text-sm text-gray-600">Mon, 29 Sep 2025</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-600">Net sales</p>
          <p className="text-2xl font-bold text-gray-900">2.413.050 ₫</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completed orders</p>
          <p className="text-2xl font-bold text-gray-900">34</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Cancelled orders</p>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>
    </div>
  )

  const renderHistoryTable = () => (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                LONG ORDER ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                SHORT ORDER ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                TOTAL AMOUNT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {historyOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{order.longOrderId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.shortOrderId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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