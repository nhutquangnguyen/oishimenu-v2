"use client"

import { Download, Info } from "lucide-react"

interface HeatmapData {
  day: string
  hours: number[]
}

// Generate heatmap data - intensity from 0-3 (0: off, 1: low, 2: medium, 3: high/peak)
const generateHeatmapData = (): HeatmapData[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return days.map(day => ({
    day,
    hours: Array.from({ length: 24 }, (_, hour) => {
      // Simulate peak hours around lunch (11-14) and dinner (17-21)
      if ((hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 20)) {
        return Math.random() > 0.3 ? 3 : 2
      } else if ((hour >= 9 && hour <= 10) || (hour >= 14 && hour <= 16)) {
        return Math.random() > 0.5 ? 2 : 1
      } else if (hour >= 7 && hour <= 22) {
        return Math.random() > 0.7 ? 1 : 0
      }
      return 0
    })
  }))
}

const heatmapData = generateHeatmapData()

export function PeakHoursHeatmap() {
  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-gray-100"
      case 1: return "bg-green-200"
      case 2: return "bg-green-400"
      case 3: return "bg-green-600"
      default: return "bg-gray-100"
    }
  }

  const timeLabels = Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2
    return hour === 0 ? "00:00" : `${hour.toString().padStart(2, "0")}:00`
  })

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Peak hours</h2>
          <p className="text-sm text-gray-600">
            Shows how busy your store typically is, based on when orders are placed or scheduled.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Peak hours</span>
            <div className="flex gap-1">
              <div className="h-4 w-4 bg-green-600" />
              <div className="h-4 w-4 bg-green-500" />
              <div className="h-4 w-4 bg-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Non-peak hours</span>
            <div className="flex gap-1">
              <div className="h-4 w-4 bg-green-200" />
              <div className="h-4 w-4 bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Time labels header */}
            <div className="mb-2 flex">
              <div className="w-12" />
              {timeLabels.map((time, i) => (
                <div key={time} className="flex-1 text-center">
                  <span className="text-xs text-gray-500">{time}</span>
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {heatmapData.map((dayData) => (
              <div key={dayData.day} className="mb-1 flex items-center">
                <div className="w-12 text-right">
                  <span className="text-xs font-medium text-gray-600">{dayData.day}</span>
                </div>
                <div className="ml-2 flex flex-1 gap-[2px]">
                  {dayData.hours.map((intensity, hour) => (
                    <div
                      key={hour}
                      className={`h-6 flex-1 ${getHeatmapColor(intensity)}`}
                      title={`${dayData.day} ${hour}:00 - ${hour + 1}:00`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-lg bg-blue-50 p-4">
          <Info className="mt-0.5 h-4 w-4 text-blue-600" />
          <p className="text-sm text-gray-700">
            Plan your inventory to avoid running out of stock during peak hours.
          </p>
        </div>
      </div>
    </div>
  )
}