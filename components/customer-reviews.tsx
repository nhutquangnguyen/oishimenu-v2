"use client"

import { Download, Star, ArrowUpDown, MoreHorizontal, Globe } from "lucide-react"
import { useState } from "react"

interface ReviewData {
  id: string
  rating: number
  review: string
  customer: string
  customerId: string
  store: string
  type: "Public" | "Private"
  date: string
  time: string
  reply?: string
  replyDate?: string
}

const reviewData: ReviewData[] = [
  {
    id: "1",
    rating: 5,
    review: "Nước ở quán rất ngon Mình đã đặt rất nhiều lần Đặc biệt là Matcha sữa yến mạch",
    customer: "Trương Gia Hân",
    customerId: "e505b940fbf810b38bc80548bdef3bf",
    store: "Dinh Barista - Coffee & Tea - 46A Đường số 22",
    type: "Public",
    date: "20 Sep 2025",
    time: "15:06",
    reply: "Tuyệt vời quá ạ. Cảm ơn bạn nhiều lắm, đánh giá ⭐ 5 sao của bạn là động lực rất lớn toàn bộ nhân viên quán có gắng mỗi ngày đó ạ ♥️♥️♥️",
    replyDate: "Replied on 21 Sep 2025"
  },
  {
    id: "2",
    rating: 4,
    review: "Ngon, giao hàng nhanh",
    customer: "Anonymous Customer",
    customerId: "anonymous123",
    store: "Dinh Barista - Coffee & Tea",
    type: "Public",
    date: "19 Sep 2025",
    time: "14:22"
  }
]

export function CustomerReviews() {
  const [dateRange, setDateRange] = useState("3rd/Jul/2025 → 30th/Sep/2025")

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Customer reviews</h2>
      </div>

      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status</span>
            <select className="rounded border border-gray-300 px-3 py-2 text-sm">
              <option>All</option>
              <option>Replied</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="rounded-full bg-green-100 px-3 py-1">
            <span className="text-sm font-medium text-green-700">Written reviews ✕</span>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Rating</span>
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Review</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Customer</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Store</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Type</span>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">Date</span>
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600">More</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {reviewData.map((review) => (
              <tr key={review.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="mr-1 text-sm font-medium">{review.rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900">{review.review}</p>
                    {review.reply && (
                      <div className="mt-2 rounded bg-gray-50 p-2">
                        <p className="text-xs text-gray-600">{review.reply}</p>
                        <p className="mt-1 text-xs text-gray-500">{review.replyDate}</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.customer}</p>
                    <p className="text-xs text-gray-500">{review.customerId}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{review.store}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600">{review.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-gray-900">{review.date}</p>
                    <p className="text-xs text-gray-500">{review.time}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="rounded p-1 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}