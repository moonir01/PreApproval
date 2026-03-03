"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  FileSearch,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href?: string
  icon: React.ReactNode
  children?: { label: string; href: string }[]
}

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    children: [
      { label: "My Dashboard", href: "/dashboard" },
      { label: "Pending Approvals", href: "/dashboard/pending-approvals" },
      { label: "Workflow Summary", href: "/dashboard/workflow-summary" },
      { label: "Inventory Overview", href: "/dashboard/inventory-overview" },
    ],
  },
  {
    label: "Approval",
    icon: <Shield className="h-5 w-5" />,
    href: "/approval",
  },
  {
    label: "Review",
    icon: <FileSearch className="h-5 w-5" />,
    href: "/review",
  },
  {
    label: "Procurement",
    icon: <ShoppingCart className="h-5 w-5" />,
    children: [
      { label: "Pre-Approval", href: "/procurement/pre-approval" },
      { label: "Notesheet", href: "/procurement/notesheet" },
      { label: "Purchase Order", href: "/procurement/purchase-order" },
      { label: "Purchase Receive", href: "/procurement/purchase-receive" },
    ],
  },
  {
    label: "Asset",
    icon: <Package className="h-5 w-5" />,
    children: [
      { label: "Asset Register", href: "/asset/register" },
      { label: "Asset Tracking", href: "/asset/tracking" },
      { label: "Asset Depreciation", href: "/asset/depreciation" },
      { label: "Asset Allocation Report", href: "/asset/allocation-report" },
    ],
  },
  {
    label: "Setup",
    icon: <Settings className="h-5 w-5" />,
    children: [
      { label: "Organization Setup", href: "/setup/organization" },
      { label: "Wings", href: "/setup/wings" },
      { label: "Warehouses", href: "/setup/warehouse" },
      { label: "Employee Setup", href: "/setup/employee" },
      { label: "Item Setup", href: "/setup/items" },
      { label: "Workflow Setup", href: "/setup/workflow" },
      { label: "Approval Setup", href: "/setup/approval-setup" },
    ],
  },
  {
    label: "Reports & Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      { label: "Pre-Approval Reports", href: "/reports/pre-approval" },
      { label: "Notesheet & PO Reports", href: "/reports/notesheet-po" },
      { label: "Inventory Reports", href: "/reports/inventory" },
      { label: "Asset Reports", href: "/reports/asset" },
    ],
  },
  {
    label: "User Management",
    icon: <Shield className="h-5 w-5" />,
    children: [
      { label: "Users & Roles", href: "/user-management/users-roles" },
      { label: "Permissions", href: "/user-management/permissions" },
      { label: "Activity Log", href: "/user-management/activity-log" },
      { label: "Login History", href: "/user-management/login-history" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["Dashboard"])
  const { user, logout } = useAuth()

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[rgba(209,234,255,1)] text-black"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ backgroundColor: "rgba(209, 234, 255, 1)", color: "black" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2 p-6 border-b border-black/10">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-black">NCCAIMS</h1>
              <p className="text-xs text-black/70">Asset Management</p>
              <p className="text-xs text-black/70">version 206</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-black">{user.fullName}</p>
                  <p className="text-xs text-black/70 truncate">{user.designation}</p>
                  <p className="text-xs text-black/70 truncate">{"User "}{ user.employeeCode}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-black",
                      pathname === item.href ? "bg-blue-600 text-white font-medium" : "hover:bg-blue-100",
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleSection(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-black",
                      "hover:bg-blue-100",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedSections.includes(item.label) && "transform rotate-180",
                        )}
                      />
                    )}
                  </button>
                )}
                {item.children && expandedSections.includes(item.label) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm transition-colors",
                          pathname === child.href
                            ? "bg-blue-600 text-white font-medium"
                            : "text-black/80 hover:bg-blue-100",
                        )}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-black/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-black hover:bg-blue-100"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}
