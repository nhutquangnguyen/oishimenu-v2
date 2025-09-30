"use client"

import { TrendingUp, Clock } from "lucide-react"

export function BusinessGlanceCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your business at a glance</h2>
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            <span>Last updated: A few seconds ago</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="mb-1 text-sm opacity-90">Net sales today</p>
            <p className="text-3xl font-bold">₫2.013.800</p>
          </div>
          <div>
            <p className="mb-1 text-sm opacity-90">Number of transactions today</p>
            <p className="text-3xl font-bold">22</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10" />
    </div>
  )
}