import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { Sidebar } from "@/components/sidebar"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NCCAIMS - Asset Inventory Management System",
  description: "Network-Centric Centralized Asset Inventory Management System for Academy",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <DataProvider>
            <div className="flex h-screen overflow-hidden bg-white">
              <Sidebar />
              <main className="flex-1 overflow-y-auto lg:ml-64">{children}</main>
            </div>
          </DataProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
