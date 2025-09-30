"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  { date: "23 Sep 2025", new: 20, repeat: 10, reactivated: 0 },
  { date: "24 Sep 2025", new: 25, repeat: 8, reactivated: 1 },
  { date: "25 Sep 2025", new: 30, repeat: 12, reactivated: 0 },
  { date: "26 Sep 2025", new: 35, repeat: 15, reactivated: 0 },
  { date: "27 Sep 2025", new: 40, repeat: 18, reactivated: 1 },
  { date: "28 Sep 2025", new: 45, repeat: 20, reactivated: 0 },
  { date: "29 Sep 2025", new: 50, repeat: 22, reactivated: 0 },
]

export function CustomerChart() {
  return (
    <div className="h-80 w-full rounded-lg bg-white p-6 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[0, 120]}
            ticks={[0, 30, 60, 90, 120]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#6b7280", fontWeight: "600" }}
          />
          <Bar
            dataKey="new"
            stackId="a"
            fill="#10B981"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="repeat"
            stackId="a"
            fill="#059669"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="reactivated"
            stackId="a"
            fill="#047857"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}