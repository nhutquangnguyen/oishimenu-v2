import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ConditionalAuthProvider } from "@/components/conditional-auth-provider"
import { ErrorNotificationProvider } from "@/components/error-notification"
import { DebugPanel } from "@/components/debug-panel"
import { QueryProvider } from "@/components/providers/query-provider"
import { I18nProvider } from "@/components/i18n-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OishiMenu - Smart Restaurant Management Solution",
  description: "Comprehensive management system for SME restaurants",
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
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <QueryProvider>
            <ErrorNotificationProvider>
              <ConditionalAuthProvider>
                {children}
              </ConditionalAuthProvider>
              <DebugPanel />
            </ErrorNotificationProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  )
}