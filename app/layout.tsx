import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ConditionalAuthProvider } from "@/components/conditional-auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OishiMenu - Giải pháp quản lý nhà hàng thông minh",
  description: "Hệ thống quản lý toàn diện dành cho các nhà hàng SME tại Việt Nam",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ConditionalAuthProvider>
          {children}
        </ConditionalAuthProvider>
      </body>
    </html>
  )
}