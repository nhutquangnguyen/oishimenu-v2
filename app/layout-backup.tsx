import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ConditionalAuthProvider } from "@/components/conditional-auth-provider"
import { ErrorNotificationProvider } from "@/components/error-notification"
import { DebugPanel } from "@/components/debug-panel"
import { QueryProvider } from "@/components/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OishiMenu - Giải pháp quản lý nhà hàng thông minh",
  description: "Hệ thống quản lý toàn diện dành cho các nhà hàng SME tại Việt Nam",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QueryProvider>
          <ErrorNotificationProvider>
            <ConditionalAuthProvider>
              {children}
            </ConditionalAuthProvider>
            <DebugPanel />
          </ErrorNotificationProvider>
        </QueryProvider>
      </body>
    </html>
  )
}