"use client"

import { useState } from "react"
import { Plus, Search, ChevronDown, MoreHorizontal } from "lucide-react"
import { EditItemModal } from "./edit-item-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MenuItem {
  id: string
  name: string
  price: string
  image: string
}

interface Category {
  name: string
  count: number
  items: MenuItem[]
}

const categories: Category[] = [
  {
    name: "Combo năng lượng",
    count: 3,
    items: [
      {
        id: "1",
        name: "Combo Matcha Latte (M) + Cà phê sữa (M)",
        price: "48.000đ",
        image: "/api/placeholder/60/60"
      }
    ]
  },
  {
    name: "Combo Trà Chiều",
    count: 3,
    items: [
      {
        id: "2",
        name: "Combo Cà phê sữa tươi sương sáo (M) + Bánh mì que",
        price: "47.000đ",
        image: "/api/placeholder/60/60"
      }
    ]
  },
  {
    name: "MÓN MỚI",
    count: 3,
    items: [
      {
        id: "3",
        name: "Combo Matcha Latte (M) + Bánh mì que",
        price: "44.000đ",
        image: "/api/placeholder/60/60"
      }
    ]
  },
  {
    name: "ƯU ĐÃI HÔM NAY",
    count: 4,
    items: []
  },
  {
    name: "MATCHA",
    count: 8,
    items: []
  },
  {
    name: "ẨM THỰC- XỬ DỪA",
    count: 4,
    items: []
  },
  {
    name: "CÀ PHÊ- COFFEE",
    count: 9,
    items: []
  },
  {
    name: "Ban Dừng Thêm Bánh Mì Nhé😊",
    count: 1,
    items: []
  },
  {
    name: "ICE BLEND",
    count: 4,
    items: []
  }
]

export function MenuOverview() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg border border-grab-green bg-grab-green px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
            <Plus className="h-4 w-4" />
            Add new
            <ChevronDown className="h-4 w-4" />
          </button>

          <Select defaultValue="all-schedules">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-schedules">All availability schedules</SelectItem>
              <SelectItem value="weekdays">Weekdays only</SelectItem>
              <SelectItem value="weekends">Weekends only</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-items">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-items">All items</SelectItem>
              <SelectItem value="available">Available items</SelectItem>
              <SelectItem value="unavailable">Unavailable items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by item name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">CATEGORIES</h2>
            <button className="rounded p-1 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-sm text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-500">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">ITEMS</h2>
            <button className="rounded p-1 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            {categories.flatMap(category => category.items).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="h-15 w-15 rounded-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src="/api/placeholder/60/60"
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <EditItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}