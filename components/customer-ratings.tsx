"use client"

import { Star } from "lucide-react"

export function CustomerRatings() {
  const ratingData = [
    { stars: 5, percentage: 85, color: "bg-yellow-400" },
    { stars: 4, percentage: 8, color: "bg-yellow-400" },
    { stars: 3, percentage: 4, color: "bg-yellow-400" },
    { stars: 2, percentage: 2, color: "bg-yellow-400" },
    { stars: 1, percentage: 1, color: "bg-yellow-400" },
  ]

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Customer ratings</h2>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">Average</p>
          <div className="mt-2 text-5xl font-bold text-gray-900">4.8</div>
          <div className="mt-2 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">237 ratings</p>
        </div>

        <div className="flex-1">
          <div className="space-y-2">
            {ratingData.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-3">
                <span className="w-2 text-sm text-gray-600">{rating.stars}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${rating.color}`}
                    style={{ width: `${rating.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}