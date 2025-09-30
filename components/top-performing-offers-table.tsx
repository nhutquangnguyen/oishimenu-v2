"use client"

import { Download, Search, ArrowUpDown, ArrowDown } from "lucide-react"
import { useState } from "react"

interface OfferData {
  offer: string
  netSales: string
  salesChange: number
  transactions: number
  spend: string
}

const offerData: OfferData[] = [
  {
    offer: "Giảm 5.000đ phí giao hàng khi đặt đơn tối thiểu 120.000đ",
    netSales: "₫5.309.200",
    salesChange: 17.51,
    transactions: 32,
    spend: "₫160.000"
  },
  {
    offer: "Tặng ngay Bánh Mì Que Pate Hải Phòng Mini khi đặt đơn tối thiểu 149.000đ",
    netSales: "₫3.922.000",
    salesChange: 19.79,
    transactions: 19,
    spend: "₫285.000"
  },
  {
    offer: "ƯU ĐÃI HÔM NAY Giảm 2.000đ",
    netSales: "₫3.221.600",
    salesChange: 8607.03,
    transactions: 32,
    spend: "₫86.000"
  },
  {
    offer: "Giảm 46K, thêm ưu đãi bên dưới (Dinh Barista - Coffee & Tea - 46A Đường số 22)",
    netSales: "₫2.097.100",
    salesChange: 46.11,
    transactions: 6,
    spend: "₫210.000"
  }
]

export function TopPerformingOffersTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = offerData.filter(offer =>
    offer.offer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Top-performing offers</h2>
          <p className="mt-1 text-sm text-gray-600">
            Note that a transaction may be subject to double counting if it has multiple offers applied (e.g. 10% off item, and 20% off delivery fee) in the same period. This affects net sales and number of transactions, but doesn't affect the spend.
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
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Offer</span>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search offers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded border border-gray-300 py-1 pl-8 pr-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
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
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Spend</span>
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((offer, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{offer.offer}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-medium text-gray-900">{offer.netSales}</div>
                  <div className="text-xs text-green-600">
                    {offer.salesChange.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm text-gray-900">{offer.transactions}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm text-gray-900">{offer.spend}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}