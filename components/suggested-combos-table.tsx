"use client"

import { Download, Search } from "lucide-react"
import { useState } from "react"

interface ComboData {
  id: number
  combo: string
  suggestedStore: string
}

const comboData: ComboData[] = [
  {
    id: 1,
    combo: "1x Matcha đá xay - Matcha Blended, 1x Matcha dừa tươi - Coconut matcha",
    suggestedStore: "Dinh Barista - Coffee & Tea"
  },
  {
    id: 2,
    combo: "1x Matcha dừa tươi - Coconut matcha, 1x Matcha Latte Sữa Yến Mạch - Matcha Latte Oat Milk",
    suggestedStore: "Dinh Barista - Coffee & Tea"
  },
  {
    id: 3,
    combo: "1x Matcha dừa tươi, 1x Bánh Mì Que Pate Hải Phòng Mini, 1x Cà phê kem muối- Salted cream coffee",
    suggestedStore: "Dinh Barista - Coffee & Tea - 46A Đường số 22"
  },
  {
    id: 4,
    combo: "1x Cà phê cốt dừa đá xay- Cafe with coconut, 1x Matcha dừa tươi",
    suggestedStore: "Dinh Barista - Coffee & Tea - 46A Đường số 22"
  },
  {
    id: 5,
    combo: "1x Matcha latte sữa yến mạch- Matcha latte oat milk, 1x Cacao sữa dà- Iced milk cocoa",
    suggestedStore: "Dinh Barista - Coffee & Tea - 46A Đường số 22"
  }
]

export function SuggestedCombosTable() {
  const [comboSearchTerm, setComboSearchTerm] = useState("")
  const [storeSearchTerm, setStoreSearchTerm] = useState("")

  const filteredData = comboData.filter(item =>
    item.combo.toLowerCase().includes(comboSearchTerm.toLowerCase()) &&
    item.suggestedStore.toLowerCase().includes(storeSearchTerm.toLowerCase())
  )

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Suggested combos</h2>
          <p className="mt-1 text-sm text-gray-600">
            These suggestions are based on items that your customers tend to order together.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="w-16 px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600">#</span>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Suggested Combo</span>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search combos..."
                      value={comboSearchTerm}
                      onChange={(e) => setComboSearchTerm(e.target.value)}
                      className="rounded border border-gray-300 py-1 pl-8 pr-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Suggested Store</span>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search stores..."
                      value={storeSearchTerm}
                      onChange={(e) => setStoreSearchTerm(e.target.value)}
                      className="rounded border border-gray-300 py-1 pl-8 pr-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{item.combo}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm text-gray-900">{item.suggestedStore}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}