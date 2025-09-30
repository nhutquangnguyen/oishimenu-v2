"use client"

import { Download, Search, ArrowUpDown, ArrowDown, ArrowUp, Star } from "lucide-react"

interface StoreData {
  name: string
  netSales: string
  salesChange?: number
  transactions: number
  rating?: number
}

const storeData: StoreData[] = [
  {
    name: "Dinh Barista - Coffee & Tea - 46A Đường số 22",
    netSales: "₫12.103.200",
    salesChange: 5.66,
    transactions: 147,
    rating: 0.00
  },
  {
    name: "Dinh Barista - Coffee & Tea",
    netSales: "₫0",
    salesChange: 0.00,
    transactions: 0,
    rating: 0.00
  }
]

export function StorePerformanceTable() {
  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Store performance</h2>
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
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Store</span>
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Net Sales</span>
                  <ArrowDown className="h-4 w-4 text-gray-600" />
                </div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Number of transactions</span>
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Customer Ratings</span>
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {storeData.map((store, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{store.name}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-medium text-gray-900">{store.netSales}</div>
                  {store.salesChange !== undefined && (
                    <div className={`text-xs ${store.salesChange > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                      {store.salesChange > 0 ? '+' : ''}{store.salesChange.toFixed(2)} %
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm text-gray-900">{store.transactions}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-4 w-4 text-gray-300 fill-gray-300" />
                    <span className="text-sm text-gray-900">{store.rating?.toFixed(2)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}