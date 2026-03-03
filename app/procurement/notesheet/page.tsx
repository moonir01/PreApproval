"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileDown, Plus, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Notesheet } from "@/lib/demo-data"

export default function NotesheetListPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { notesheets, wings, preApprovals, deleteNotesheet } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [wingFilter, setWingFilter] = useState("all")
  const [filtered, setFiltered] = useState<Notesheet[]>(notesheets)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    let result = notesheets

    if (searchTerm) {
      result = result.filter(
        (ns) =>
          ns.notesheetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ns.preApprovalId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((ns) => ns.status === statusFilter)
    }

    if (wingFilter !== "all") {
      result = result.filter((ns) => ns.wingId === wingFilter)
    }

    setFiltered(result)
  }, [notesheets, searchTerm, statusFilter, wingFilter])

  if (!isAuthenticated) {
    return null
  }

  const exportToExcel = () => {
    console.log("[v0] Exporting notesheets to Excel")
    alert("Excel export functionality - Would download Excel file with all notesheets")
  }

  const exportToPDF = () => {
    console.log("[v0] Exporting notesheets to PDF")
    alert("PDF export functionality - Would download PDF file with all notesheets")
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this notesheet?")) {
      deleteNotesheet(id)
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notesheet</h1>
              <p className="text-muted-foreground mt-1">Manage notesheet approval workflows</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToExcel}>
                <FileDown className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={exportToPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Link href="/procurement/notesheet/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Notesheet
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Notesheet ID or Pre-Approval ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={wingFilter} onValueChange={setWingFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Wing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wings</SelectItem>
                {wings.map((wing) => (
                  <SelectItem key={wing.id} value={wing.id}>
                    {wing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Sent Back">Sent Back</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notesheet Table */}
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notesheet ID</TableHead>
                  <TableHead>Pre-Approval ID</TableHead>
                  <TableHead>Wing</TableHead>
                  <TableHead>Initiated By</TableHead>
                  <TableHead>Initiated Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No notesheets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((ns) => {
                    const wing = wings.find((w) => w.id === ns.wingId)
                    const preApproval = preApprovals.find((pa) => pa.preApprovalId === ns.preApprovalId)
                    return (
                      <TableRow key={ns.id}>
                        <TableCell className="font-medium">{ns.notesheetId}</TableCell>
                        <TableCell>{ns.preApprovalId}</TableCell>
                        <TableCell>{wing?.name || "N/A"}</TableCell>
                        <TableCell>{ns.initiatedBy}</TableCell>
                        <TableCell>{new Date(ns.initiatedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ns.status === "Approved"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : ns.status === "Pending"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                  : ns.status === "Rejected"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                    : ns.status === "Sent Back"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                      : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {ns.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {ns.workflowHistory.length > 0
                            ? ns.workflowHistory[ns.workflowHistory.length - 1].stageName
                            : "Not Started"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/procurement/notesheet/${ns.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(ns.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>
              Showing {filtered.length} of {notesheets.length} notesheets
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
