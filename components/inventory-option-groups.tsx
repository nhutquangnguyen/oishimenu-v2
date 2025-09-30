"use client"

import { useState } from "react"
import { Search, MoreHorizontal, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OptionGroup {
  id: string
  name: string
  optionCount: number
}

interface Option {
  id: string
  name: string
  status: "In stock" | "Out of stock today" | "Out of stock indefinitely"
}

const optionGroups: OptionGroup[] = [
  { id: "1", name: "Đá", optionCount: 1 },
  { id: "2", name: "Kích cỡ", optionCount: 2 },
  { id: "3", name: "Kích cỡ", optionCount: 2 },
  { id: "4", name: "Thêm sương sáo", optionCount: 1 },
  { id: "5", name: "Kích cỡ", optionCount: 1 },
  { id: "6", name: "Loại Cafe- Cafe type", optionCount: 7 },
  { id: "7", name: "Topping", optionCount: 10 },
  { id: "8", name: "Chọn loại sữa", optionCount: 2 }
]

const sampleOptions: Option[] = [
  { id: "1", name: "Dễ riêng", status: "In stock" }
]

export function InventoryOptionGroups() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const filteredGroups = optionGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">OPTION GROUPS</h2>
          <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by option group name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedGroup === group.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:bg-purple-50"
              }`}
            >
              <span className="text-sm font-medium text-gray-900">{group.name}</span>
              <span className="text-sm text-gray-600">{group.optionCount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">OPTIONS</h2>
          <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {selectedGroup ? (
          <div className="space-y-4">
            {sampleOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-4 rounded-lg border">
                <span className="text-sm font-medium text-gray-900">{option.name}</span>
                <div className="relative">
                  <Select defaultValue={option.status}>
                    <SelectTrigger className={`border-none shadow-none p-0 h-auto gap-1 ${getStatusColor(option.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In stock">In stock</SelectItem>
                      <SelectItem value="Out of stock today">Out of stock today</SelectItem>
                      <SelectItem value="Out of stock indefinitely">Out of stock indefinitely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <p>Select an option group to view options</p>
          </div>
        )}
      </div>
    </div>
  )
}