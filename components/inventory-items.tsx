"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InventoryItem {
  id: string
  name: string
  price: string
  category: string
  sellingTime: string
  stockLevel: string
  status: "In stock" | "Out of stock today" | "Out of stock indefinitely"
}

const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Combo Matcha Latte (M) + Cà phê ...",
    price: "48.000₫",
    category: "Combo nâng lượng",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "2",
    name: "Combo Cà phê sữa tươi sương sáo (...",
    price: "47.000₫",
    category: "Combo nâng lượng",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "3",
    name: "Combo Matcha Latte (M) + Bánh mì ...",
    price: "44.000₫",
    category: "Combo nâng lượng",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "4",
    name: "Combo trà Atiso đỏ + Trà xoài 🥭",
    price: "58.000₫",
    category: "Combo trà chiều",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "5",
    name: "Combo Trà ổi hồng (M) + Trà xoài (M)",
    price: "58.000₫",
    category: "Combo trà chiều",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "6",
    name: "Combo Trà Ổi Hồng (M) + Trà Hibiscus...",
    price: "58.000₫",
    category: "Combo trà chiều",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "7",
    name: "Trà Hibiscus atiso đỏ - Hibiscus tea",
    price: "29.000₫",
    category: "MÓN MỚI",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "8",
    name: "Matcha tàu hũ - Matcha tofu pudding",
    price: "39.000₫",
    category: "MÓN MỚI",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  },
  {
    id: "9",
    name: "Matcha caramel latte",
    price: "32.000₫",
    category: "MÓN MỚI",
    sellingTime: "All opening hours",
    stockLevel: "Unlimited",
    status: "In stock"
  }
]

export function InventoryItems() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("In stock")
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "All" || item.status === statusFilter)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In stock":
        return "bg-green-100 text-green-800"
      case "Out of stock today":
        return "bg-orange-100 text-orange-800"
      case "Out of stock indefinitely":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by item name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  ITEM NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  <div className="flex items-center gap-1">
                    PRICE (₫)
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  CATEGORY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  SELLING TIME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  <div className="flex items-center gap-1">
                    STOCK LEVEL
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.sellingTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.stockLevel}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                        <ChevronDown className="h-3 w-3" />
                      </button>

                      {showStatusDropdown && (
                        <div className="absolute top-8 left-0 z-10 rounded-lg bg-white shadow-lg border p-2 min-w-48">
                          <div className="space-y-1">
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                              In stock
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-gray-50 rounded">
                              Out of stock today
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-gray-50 rounded">
                              Out of stock indefinitely
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}