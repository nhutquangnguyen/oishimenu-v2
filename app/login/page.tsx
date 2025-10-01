"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/firebase-auth-context"
import Link from "next/link"
import { Menu, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
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
      {/* Left Panel - Login Form */}
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
              Chào mừng trở lại
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Đăng nhập để truy cập bảng điều khiển quản lý nhà hàng
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Google Sign In */}
          <div className="space-y-6">
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
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
                {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
              </button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
                  Đăng ký miễn phí
                </Link>
              </p>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>✓ Bảo mật với Google</span>
                <span>✓ Đăng nhập nhanh chóng</span>
                <span>✓ Không cần ghi nhớ mật khẩu</span>
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
                Quản lý nhà hàng hiệu quả
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Truy cập các công cụ mạnh mẽ để theo dõi đơn hàng, quản lý kho, phân tích doanh số và phát triển kinh doanh
              </p>
              <div className="grid grid-cols-2 gap-6 text-left">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">5,000+</div>
                  <div className="text-sm opacity-90">Nhà hàng đang sử dụng</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">1M+</div>
                  <div className="text-sm opacity-90">Đơn hàng đã xử lý</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm opacity-90">Thời gian hoạt động</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">Hỗ trợ khách hàng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}