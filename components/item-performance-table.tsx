"use client"

import { Download, Search, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"

interface ItemData {
  name: string
  unitsSold: number
  grossSales: string
  change?: number
}

const itemData: ItemData[] = [
  {
    name: "Matcha latte",
    unitsSold: 40,
    grossSales: "₫1.551.000",
    change: -36.30
  },
  {
    name: "Matcha latte sữa yến mạch- Matcha latte oat milk",
    unitsSold: 32,
    grossSales: "₫1.183.000",
    change: -12.76
  },
  {
    name: "Matcha latte kem muối- Salted Cream Matcha Latte",
    unitsSold: 23,
    grossSales: "₫926.000",
    change: 94.95
  },
  {
    name: "Cà phê sữa- Iced milk coffee",
    unitsSold: 33,
    grossSales: "₫772.000",
    change: 163.48
  },
  {
    name: "Matcha đậu tươi",
    unitsSold: 18,
    grossSales: "₫722.000",
    change: 9.56
  },
  {
    name: "Matcha đá xay- Matcha blended",
    unitsSold: 15,
    grossSales: "₫664.000",
    change: 29.18
  },
  {
    name: "Combo Matcha Latte (M) + Cà phê sữa (M)",
    unitsSold: 10,
    grossSales: "₫580.000",
    change: 15.08
  }
]

export function ItemPerformanceTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = itemData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Item performance</h2>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Item</span>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded border border-gray-300 py-1 pl-8 pr-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </th>
              <th className="px-6 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Units Sold</span>
                  <ArrowDown className="h-4 w-4 text-gray-600" />
                </div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Item Gross Sales</span>
                  <ArrowDown className="h-4 w-4 text-gray-600" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-900">{item.unitsSold}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-medium text-gray-900">{item.grossSales}</div>
                  {item.change !== undefined && (
                    <div className={`flex items-center justify-end gap-1 text-xs ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change > 0 ? (
                        <>
                          <span>+ {item.change.toFixed(2)} %</span>
                        </>
                      ) : (
                        <>
                          <span>{item.change.toFixed(2)} %</span>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}