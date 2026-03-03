"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, FileText, TrendingUp, Clock, CheckCircle, AlertTriangle, Building2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { preApprovals, notesheets, assets, items, wings, warehouses } = useData()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  // Calculate statistics
  const pendingPreApprovals = preApprovals.filter((p) => p.status === "Pending").length
  const pendingNotesheets = notesheets.filter((n) => n.status === "Pending").length
  const totalAssets = assets.length
  const assetsInUse = assets.filter((a) => a.status === "In use").length
  const totalItems = items.length
  const lowStockItems = items.filter((item) => {
    const totalStock = (item.stockLevels || []).reduce((sum, level) => sum + level.quantity, 0)
    return totalStock <= (item.reorderThreshold || 0)
  }).length

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {user.fullName}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Pre-Approvals</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPreApprovals}</div>
                <p className="text-xs text-muted-foreground mt-1">Requires your attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Notesheets</CardTitle>
                <FileText className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingNotesheets}</div>
                <p className="text-xs text-muted-foreground mt-1">In workflow process</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssets}</div>
                <p className="text-xs text-muted-foreground mt-1">{assetsInUse} currently in use</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground mt-1">Below reorder threshold</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => router.push("/procurement/pre-approval")}
                  className="w-full flex items-center gap-3 p-3 rounded-md border hover:bg-accent transition-colors text-left"
                >
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Create Pre-Approval</p>
                    <p className="text-xs text-muted-foreground">Initiate new procurement request</p>
                  </div>
                </button>
                <button
                  onClick={() => router.push("/asset/register")}
                  className="w-full flex items-center gap-3 p-3 rounded-md border hover:bg-accent transition-colors text-left"
                >
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Register Asset</p>
                    <p className="text-xs text-muted-foreground">Add new asset to registry</p>
                  </div>
                </button>
                <button
                  onClick={() => router.push("/dashboard/pending-approvals")}
                  className="w-full flex items-center gap-3 p-3 rounded-md border hover:bg-accent transition-colors text-left"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">View Pending Approvals</p>
                    <p className="text-xs text-muted-foreground">Review items requiring action</p>
                  </div>
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization Overview</CardTitle>
                <CardDescription>Hierarchy and structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Wings</span>
                  </div>
                  <span className="text-2xl font-bold">{wings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-accent" />
                    <span className="font-medium">Total Warehouses</span>
                  </div>
                  <span className="text-2xl font-bold">{warehouses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Item Categories</span>
                  </div>
                  <span className="text-2xl font-bold">{new Set(items.map((i) => i.category)).size}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Pre-Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Pre-Approvals</CardTitle>
              <CardDescription>Latest procurement requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {preApprovals.slice(0, 5).map((pa) => {
                  const wing = wings.find((w) => w.id === pa.wingId)
                  return (
                    <div key={pa.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{pa.preApprovalId}</p>
                        <p className="text-sm text-muted-foreground">
                          {wing?.name} • ${pa.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pa.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : pa.status === "Pending"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                : pa.status === "Rejected"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {pa.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(pa.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
