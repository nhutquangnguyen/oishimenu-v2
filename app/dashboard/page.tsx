"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BusinessGlanceCard } from "@/components/business-glance-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp, Info } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Chào mừng!</h1>

          <div className="flex gap-4 mb-6">
            <Select defaultValue="all-services">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-services">Tất cả dịch vụ</SelectItem>
                <SelectItem value="oishidelivery">OishiDelivery</SelectItem>
                <SelectItem value="shopeefood">ShopeeFood</SelectItem>
                <SelectItem value="gomafood">GomaFood</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-stores">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-stores">Tất cả cửa hàng</SelectItem>
                <SelectItem value="store1">Cửa hàng Quận 1</SelectItem>
                <SelectItem value="store2">Cửa hàng Quận 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business at a Glance */}
        <BusinessGlanceCard />

        {/* Business Insights Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thông tin kinh doanh</h2>
              <p className="text-sm text-gray-600">Dựa trên dữ liệu ngày 30 Tháng 9</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">24 Tháng 9 - 30 Tháng 9</span>
              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">⚠ 2 Loại trừ dữ liệu</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Metrics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Net Sales and Cancellation Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Doanh số thuần</h3>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">₫19.617.900</p>
                  <p className="text-sm text-green-600">+10.05% so với 7 ngày trước</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Tỷ lệ hủy có thể tránh được</h3>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">0.00%</p>
                  <p className="text-sm text-gray-500">0.00pp so với 7 ngày trước</p>
                </div>
              </div>

              {/* Number of Transactions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Số giao dịch</h3>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">255</p>
                <p className="text-sm text-green-600">+4.08% so với 7 ngày trước</p>

                {/* Simple Chart Placeholder */}
                <div className="mt-4 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full relative">
                    <svg className="w-full h-full" viewBox="0 0 400 150">
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        points="20,120 60,110 100,100 140,90 180,85 220,80 260,70 300,60 340,65 380,75"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Key Trends */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Xu hướng chính</h3>
                <Info className="h-4 w-4 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Thời gian chờ của tài xế</p>
                  <p className="text-lg font-semibold text-gray-900">1 phút 39 giây</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Doanh số thuần từ ưu đãi</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">₫18.910.900</p>
                  <p className="text-sm text-green-600">+15.53% so với 7 ngày trước</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Tổng doanh số</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">₫24.168.000</p>
                  <p className="text-sm text-green-600">+10.11% so với 7 ngày trước</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Số tiền giao dịch trung bình</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">₫76.933</p>
                  <p className="text-sm text-green-600">+5.74% so với 7 ngày trước</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Tổng số khách hàng</h4>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">233</p>
                  <p className="text-sm text-green-600">+0.43% so với 7 ngày trước</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">🏪</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cửa hàng hoạt động tốt nhất</p>
                <p className="font-semibold text-gray-900">Dinh Barista - Coffee & Tea - 305C Phạm Văn Đồng</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">☕</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Món bán chạy nhất</p>
                <p className="font-semibold text-gray-900">Matcha Latte Sữa Yến Mạch - Matcha Latte Oat Milk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Khám phá</h2>
            <a href="#" className="text-purple-600 hover:text-purple-700 text-sm font-medium">Xem tất cả</a>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-400 to-green-500 rounded-lg text-white">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold">tinh_nang</h3>
              <p className="text-sm opacity-90">Khám phá hành trình OishiAcademy với nhiều cấp nhật mới</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}