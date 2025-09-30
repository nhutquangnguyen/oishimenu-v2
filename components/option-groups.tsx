"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { EditOptionGroupModal } from "./edit-option-group-modal"

interface OptionGroup {
  id: string
  name: string
  optionCount: number
}

const optionGroups: OptionGroup[] = [
  { id: "1", name: "Kích cỡ", optionCount: 1 },
  { id: "2", name: "Đá", optionCount: 1 },
  { id: "3", name: "Đá", optionCount: 2 },
  { id: "4", name: "Kích cỡ", optionCount: 2 },
  { id: "5", name: "Thêm Sương sáo", optionCount: 1 },
  { id: "6", name: "Ban dừng thêm bánh mì nhé!", optionCount: 1 },
  { id: "7", name: "Chọn Matcha", optionCount: 5 },
  { id: "8", name: "Chọn loại sữa", optionCount: 2 },
]

const optionDetails = {
  "Sương sáo": "7.000₫"
}

export function OptionGroups() {
  const [selectedGroup, setSelectedGroup] = useState<OptionGroup | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 rounded-lg border border-grab-green bg-grab-green px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
          <Plus className="h-4 w-4" />
          Create New Option Group
        </button>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by option group name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">OPTION GROUPS</h2>
            <button className="rounded p-1 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-2">
            {optionGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-sm text-gray-900">{group.name}</span>
                <span className="text-sm text-gray-500">{group.optionCount}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">OPTIONS</h2>
            <button className="rounded p-1 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Sương sáo</h3>
                  <p className="text-sm text-gray-600">7.000₫</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedGroup && (
        <EditOptionGroupModal
          group={selectedGroup}
          isOpen={!!selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  )
}