"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { date: "23 Sep", value: 1600000 },
  { date: "24 Sep", value: 1800000 },
  { date: "25 Sep", value: 2000000 },
  { date: "26 Sep", value: 1400000 },
  { date: "27 Sep", value: 2400000 },
  { date: "28 Sep", value: 1700000 },
]

export function OffersSalesChart() {
  return (
    <div className="h-80 w-full rounded-lg bg-white p-6 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            domain={[0, 2500000]}
            ticks={[0, 500000, 1000000, 1500000, 2000000, 2500000]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#6b7280", fontWeight: "600" }}
            formatter={(value: number) => [`₫${value.toLocaleString()}`, "Net Sales"]}
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
  )
}