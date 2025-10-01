"use client"

import Link from "next/link"
import {
  Menu,
  TrendingUp,
  ShoppingBag,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  Play,
  Package,
  ShoppingCart,
  Award,
  Zap
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Menu className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OishiMenu
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Tính năng</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Bảng giá</a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Đánh giá</a>
              <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">Đăng nhập</a>
              <a href="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Dùng thử miễn phí
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Giải pháp quản lý nhà hàng thông minh
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Nâng tầm
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> nhà hàng </span>
                của bạn
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Hệ thống quản lý toàn diện dành riêng cho các nhà hàng, quán ăn tại Việt Nam.
                Tích hợp POS, quản lý đơn hàng, phân tích doanh thu và kết nối với các nền tảng giao hàng phổ biến.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center font-medium">
                  Bắt đầu miễn phí 30 ngày
                </a>
                <button className="flex items-center justify-center gap-2 border border-purple-300 text-purple-700 px-8 py-4 rounded-lg hover:bg-purple-50 transition-all duration-200">
                  <Play className="w-5 h-5" />
                  Xem demo
                </button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Không cần thẻ tín dụng
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Hỗ trợ 24/7
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Doanh thu hôm nay</h3>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold">₫4,250,000</div>
                  <div className="text-purple-200 text-sm">↗ +15% so với hôm qua</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 font-semibold">Đơn hàng</div>
                    <div className="text-2xl font-bold text-green-700">127</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-semibold">Khách hàng</div>
                    <div className="text-2xl font-bold text-blue-700">89</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 font-medium">Tích hợp với các nền tảng phổ biến tại Việt Nam</p>
          </div>
          <div className="flex items-center justify-center gap-12 opacity-60">
            <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              GrabFood
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-orange-600">
              <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
              Shopee Food
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-red-600">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              Baemin
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              GoFood
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mọi thứ bạn cần để <span className="text-purple-600">quản lý nhà hàng</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Từ quản lý menu, nhận đơn hàng đến phân tích doanh thu - tất cả trong một hệ thống duy nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* POS System */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hệ thống POS thông minh</h3>
              <p className="text-gray-600 mb-4">
                Thanh toán nhanh chóng, in hóa đơn tự động, quản lý bàn ăn và theo dõi đơn hàng real-time
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Thanh toán đa phương thức
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Quản lý bàn ăn trực quan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  In hóa đơn tự động
                </li>
              </ul>
            </div>

            {/* Order Management */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý đơn hàng tập trung</h3>
              <p className="text-gray-600 mb-4">
                Nhận và xử lý đơn hàng từ tất cả kênh: tại chỗ, online và các app giao hàng
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Tích hợp GrabFood, Shopee Food
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Theo dõi trạng thái real-time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Báo cáo chi tiết
                </li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Phân tích kinh doanh</h3>
              <p className="text-gray-600 mb-4">
                Hiểu rõ doanh thu, món ăn bán chạy, khách hàng thân thiết và xu hướng kinh doanh
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Dashboard doanh thu real-time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Phân tích menu best-seller
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Báo cáo khách hàng
                </li>
              </ul>
            </div>

            {/* Menu Management */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Menu className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý thực đơn linh hoạt</h3>
              <p className="text-gray-600 mb-4">
                Cập nhật menu, giá cả, hình ảnh và đồng bộ trên tất cả các nền tảng một cách dễ dàng
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  Cập nhật menu real-time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  Quản lý hình ảnh món ăn
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  Đồng bộ đa nền tảng
                </li>
              </ul>
            </div>

            {/* Inventory */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl border border-yellow-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý kho hàng</h3>
              <p className="text-gray-600 mb-4">
                Theo dõi nguyên liệu, cảnh báo hết hàng và tối ưu hóa chi phí nguyên liệu
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  Theo dõi tồn kho real-time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  Cảnh báo hết hàng
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  Báo cáo chi phí
                </li>
              </ul>
            </div>

            {/* Staff Management */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl border border-pink-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý nhân viên</h3>
              <p className="text-gray-600 mb-4">
                Phân ca làm việc, tính lương, đánh giá hiệu suất và quản lý quyền truy cập
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pink-500" />
                  Phân ca tự động
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pink-500" />
                  Tính lương chính xác
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pink-500" />
                  Quản lý quyền hạn
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Được tin dùng bởi <span className="text-purple-600">1000+ nhà hàng</span> tại Việt Nam
            </h2>
            <p className="text-xl text-gray-600">Xem những gì các chủ nhà hàng nói về OishiMenu</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "OishiMenu đã giúp quán cà phê của tôi tăng doanh thu 40% trong 3 tháng.
                Việc quản lý đơn hàng từ các app giao hàng giờ đây rất đơn giản!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-purple-700">LM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Lê Minh</div>
                  <div className="text-sm text-gray-600">Cà phê Sài Gòn, Q1</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Từ khi dùng OishiMenu, việc quản lý 3 cửa hàng phở của tôi trở nên dễ dàng hơn rất nhiều.
                Báo cáo doanh thu real-time cực kỳ hữu ích!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-700">TH</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Trần Hằng</div>
                  <div className="text-sm text-gray-600">Phở Hà Nội, Hà Nội</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Hệ thống POS của OishiMenu rất nhanh và dễ sử dụng.
                Nhân viên chỉ cần 1 ngày để học và sử dụng thành thạo!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">NV</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Nguyễn Vân</div>
                  <div className="text-sm text-gray-600">Bún bò Huế, Đà Nẵng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bảng giá <span className="text-purple-600">minh bạch</span>
            </h2>
            <p className="text-xl text-gray-600">Chọn gói phù hợp với quy mô nhà hàng của bạn</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-4">Phù hợp cho quán nhỏ</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₫299,000
                  <span className="text-lg font-normal text-gray-600">/tháng</span>
                </div>
                <p className="text-sm text-gray-500">Dùng thử 30 ngày miễn phí</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>1 cửa hàng</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>POS cơ bản</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Quản lý menu</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Báo cáo cơ bản</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Hỗ trợ email</span>
                </li>
              </ul>
              <a href="/signup" className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-center block font-medium">
                Bắt đầu dùng thử
              </a>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-8 transform scale-105 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Award className="w-4 h-4 mr-1" />
                  Phổ biến nhất
                </div>
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-purple-100 mb-4">Cho nhà hàng vừa và lớn</p>
                <div className="text-4xl font-bold mb-2">
                  ₫699,000
                  <span className="text-lg font-normal text-purple-200">/tháng</span>
                </div>
                <p className="text-sm text-purple-200">Tiết kiệm 2 tháng khi thanh toán năm</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Không giới hạn cửa hàng</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>POS nâng cao + Quản lý bàn</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Tích hợp app giao hàng</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Phân tích kinh doanh chi tiết</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Quản lý nhân viên</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Hỗ trợ 24/7</span>
                </li>
              </ul>
              <a href="/signup" className="w-full bg-white text-purple-600 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center block font-medium">
                Chọn gói này
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">Cho chuỗi nhà hàng</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  Liên hệ
                </div>
                <p className="text-sm text-gray-500">Giá tùy chỉnh theo nhu cầu</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Tất cả tính năng Professional</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>API tích hợp tùy chỉnh</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Báo cáo dành cho chuỗi</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Đào tạo và setup miễn phí</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Account manager riêng</span>
                </li>
              </ul>
              <button className="w-full border border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Sẵn sàng nâng tầm nhà hàng của bạn?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn chủ nhà hàng đã chọn OishiMenu để tăng trưởng kinh doanh
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Dùng thử miễn phí 30 ngày
            </a>
            <button className="border border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Tải brochure
            </button>
          </div>
          <p className="text-sm text-purple-200 mt-4">
            Không cần thẻ tín dụng • Setup miễn phí • Hỗ trợ 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">OishiMenu</span>
              </div>
              <p className="text-gray-400 mb-4">
                Giải pháp quản lý nhà hàng thông minh cho các SME F&B tại Việt Nam
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs">FB</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs">IG</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs">LI</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hệ thống POS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quản lý đơn hàng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Phân tích doanh thu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quản lý menu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tích hợp giao hàng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ hỗ trợ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OishiMenu. Tất cả quyền được bảo lưu. Made with ❤️ in Vietnam</p>
          </div>
        </div>
      </footer>
    </div>
  )
}