"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Menu, AlertCircle, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignUp = async () => {
    setError("")
    setLoading(true)

    try {
      await signInWithGoogle()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Menu className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OishiMenu
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Bắt đầu miễn phí
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tạo tài khoản để quản lý nhà hàng của bạn
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-green-800 text-sm">Miễn phí 30 ngày đầu:</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Quản lý đơn hàng không giới hạn</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Tích hợp OishiDelivery, Shopee Food</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Báo cáo doanh thu chi tiết</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Hỗ trợ khách hàng 24/7</span>
              </li>
            </ul>
          </div>

          {/* Google Sign Up */}
          <div className="space-y-6">
            <div>
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? "Đang tạo tài khoản..." : "Đăng ký với Google"}
              </button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                  Đăng nhập
                </Link>
              </p>

              <div className="text-xs text-gray-500 space-y-2">
                <p>
                  Bằng cách đăng ký, bạn đồng ý với{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-500 underline">
                    Điều khoản sử dụng
                  </a>
                  {" "}và{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-500 underline">
                    Chính sách bảo mật
                  </a>
                </p>

                <div className="flex items-center justify-center space-x-4 mt-3">
                  <span>✓ Bảo mật với Google</span>
                  <span>✓ Thiết lập nhanh chóng</span>
                  <span>✓ Không cần xác thực email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Image/Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white text-center max-w-lg">
              <h3 className="text-4xl font-bold mb-6">
                Tham gia cùng 5,000+ nhà hàng
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Các chủ nhà hàng đang sử dụng OishiMenu để tăng doanh thu và tối ưu vận hành
              </p>
              <div className="grid grid-cols-1 gap-6 text-left">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">LM</span>
                    </div>
                    <div>
                      <div className="font-semibold">Lê Minh</div>
                      <div className="text-sm opacity-75">Cà phê Sài Gòn</div>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "Doanh thu tăng 40% sau 3 tháng sử dụng OishiMenu. Quản lý đơn hàng từ các app giờ rất đơn giản!"
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">TH</span>
                    </div>
                    <div>
                      <div className="font-semibold">Trần Hằng</div>
                      <div className="text-sm opacity-75">Phở Hà Nội</div>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "Báo cáo doanh thu real-time cực kỳ hữu ích. Giờ tôi quản lý 3 cửa hàng dễ dàng hơn nhiều!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}