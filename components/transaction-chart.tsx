"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { date: "22 Sep", value: 15 },
  { date: "23 Sep", value: 20 },
  { date: "24 Sep", value: 30 },
  { date: "25 Sep", value: 27 },
  { date: "26 Sep", value: 23 },
  { date: "27 Sep", value: 25 },
  { date: "28 Sep", value: 22 },
]

export function TransactionChart() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm text-gray-600">Number of transactions</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">147</span>
          <span className="text-sm text-red-500">-34.67% from previous 7 days</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#6b7280" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00B14F"
              strokeWidth={2}
              dot={{ fill: "#00B14F", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}