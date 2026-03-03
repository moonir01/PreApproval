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
import { Search, FileDown, Plus, Eye, Trash2, History } from "lucide-react"
import Link from "next/link"
import type { PreApproval } from "@/lib/demo-data"
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { WorkflowHistoryReport } from "@/components/workflow-history-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PreApprovalListPage() {
const router = useRouter()
const { isAuthenticated } = useAuth()
const { preApprovals, wings, warehouses, deletePreApproval, employees, workflowStages } = useData()
const [searchTerm, setSearchTerm] = useState("")
const [statusFilter, setStatusFilter] = useState("all")
const [wingFilter, setWingFilter] = useState("all")
const [filtered, setFiltered] = useState<PreApproval[]>(preApprovals)
const [mounted, setMounted] = useState(false)
const [selectedPreApproval, setSelectedPreApproval] = useState<PreApproval | null>(null)

useEffect(() => {
setMounted(true)
}, [])

useEffect(() => {
if (mounted && !isAuthenticated) {
router.push("/login")
}
}, [mounted, isAuthenticated, router])

useEffect(() => {
let result = preApprovals

// Filter by search term
if (searchTerm) {
result = result.filter((pa) => pa.preApprovalId.toLowerCase().includes(searchTerm.toLowerCase()))
}

// Filter by wing
if (wingFilter !== "all") {
result = result.filter((pa) => pa.wingId === wingFilter)
}

// Filter by status
if (statusFilter !== "all") {
result = result.filter((pa) => pa.status === statusFilter)
}

setFiltered(result)
}, [preApprovals, searchTerm, wingFilter, statusFilter])

if (!isAuthenticated) {
return null
}

const exportToExcel = () => {
alert("Excel export functionality - Would download Excel file with all pre-approvals")
}

const exportToPDF = () => {
alert("PDF export functionality - Would download PDF file with all pre-approvals")
}

const handleDelete = (id: string) => {
if (confirm("Are you sure you want to delete this pre-approval?")) {
deletePreApproval(id)
}
}

const getCurrentStageName = (pa: PreApproval) => {
// The currentStage number represents the stage that is currently pending approval
if (pa.currentStage && pa.currentStage > 0) {
const stage = workflowStages.find((s) => s.workflowType === "preapproval" && s.order === pa.currentStage)
return stage ? stage.name : "Not Started"
}

return "Not Started"
}

const getCurrentPendingStage = (pa: PreApproval) => {
if (pa.currentStage && pa.currentStage > 0) {
const stage = workflowStages.find((s) => s.workflowType === "preapproval" && s.order === pa.currentStage)
return stage
}
return null
}

return (
<div className="flex min-h-screen bg-muted/30">
<Sidebar />
<main className="flex-1 p-8">
<div className="space-y-6">
{/* Header */}
<div className="flex items-center justify-between">
<div>
<h1 className="text-3xl font-bold">Pre-Approval</h1>
<p className="text-muted-foreground mt-1">Manage procurement pre-approval requests</p>
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
<Link href="/procurement/pre-approval/create" passHref>
<Button>
<Plus className="h-4 w-4 mr-2" />
New Pre-Approval
</Button>
</Link>
</div>
</div>

{/* Filters */}
<div className="flex flex-col sm:flex-row gap-4">
<div className="relative flex-1">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<Input
placeholder="Search by Pre-Approval ID..."
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

{/* Pre-Approval Table */}
<div className="border rounded-lg bg-card">
<Table>
<TableHeader>
<TableRow>
<TableHead>Pre-Approval ID</TableHead>
<TableHead>Wing</TableHead>
<TableHead>Requested By</TableHead>
<TableHead>Request Date</TableHead>
<TableHead>Items</TableHead>
<TableHead className="text-right">Total Amount</TableHead>
<TableHead>Status</TableHead>
<TableHead>Current Stage</TableHead>
<TableHead className="text-right">Actions</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{filtered.length === 0 ? (
<TableRow>
<TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
No pre-approvals found
</TableCell>
</TableRow>
) : (
filtered.map((pa) => {
const wing = wings.find((w) => w.id === pa.wingId)
const currentPendingStage = getCurrentPendingStage(pa)

return (
<TableRow key={pa.id}>
<TableCell className="font-medium">{pa.preApprovalId}</TableCell>
<TableCell>{wing?.name || "N/A"}</TableCell>
<TableCell>{pa.requestedBy}</TableCell>
<TableCell>{new Date(pa.requestDate).toLocaleDateString()}</TableCell>
<TableCell>{pa.items?.length || 0} items</TableCell>
<TableCell className="text-right">${pa.totalAmount.toLocaleString()}</TableCell>
<TableCell>
<span
className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
pa.status === "Approved"
? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
: pa.status === "Pending"
? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
: pa.status === "Rejected"
? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
: pa.status === "Sent Back"
? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
: "bg-muted text-muted-foreground"
}`}
>
{pa.status}
</span>
</TableCell>
<TableCell>{getCurrentStageName(pa)}</TableCell>
<TableCell className="text-right">
<div className="flex justify-end gap-2">
<Dialog>
<DialogTrigger asChild>
<Button
size="sm"
variant="ghost"
onClick={() => setSelectedPreApproval(pa)}
title="View Workflow History"
>
<History className="h-4 w-4" />
</Button>
</DialogTrigger>
<DialogContent className="!max-w-none w-screen h-screen m-0 rounded-none flex flex-col p-0">
<DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
<DialogTitle>Workflow History - {pa.preApprovalId}</DialogTitle>
<DialogDescription>
View approval workflow history and detailed report
</DialogDescription>
</DialogHeader>
<div className="flex-1 overflow-auto px-6 pb-6">
<Tabs defaultValue="summary" className="mt-4">
<TabsList className="grid w-full grid-cols-2">
<TabsTrigger value="summary">Summary View</TabsTrigger>
<TabsTrigger value="report">Detailed Report</TabsTrigger>
</TabsList>
<TabsContent value="summary" className="space-y-4 mt-4">
{(!pa.workflowHistory || pa.workflowHistory.length === 0) &&
!currentPendingStage ? (
<p className="text-center text-muted-foreground py-8">
No workflow history available
</p>
) : (
<div className="space-y-3">
{pa.workflowHistory?.map((history, index) => (
<div key={index} className="border rounded-lg p-4 bg-muted/30 space-y-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
{history.stageId || index + 1}
</div>
<div>
<h4 className="font-semibold">{history.stageName}</h4>
<p className="text-sm text-muted-foreground">{history.actionBy}</p>
</div>
</div>
<div className="text-right">
<span
className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
history.action === "Approve"
? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
: history.action === "Recommend"
? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
: history.action === "Reject"
? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
}`}
>
{history.action}
</span>
</div>
</div>
<div className="grid grid-cols-2 gap-4 text-sm">
<div>
<span className="text-muted-foreground">Date & Time:</span>
<p className="font-medium">
{new Date(history.timestamp).toLocaleString()}
</p>
</div>
<div>
<span className="text-muted-foreground">Status:</span>
<p className="font-medium">Completed</p>
</div>
</div>
{history.comments && (
<div className="pt-2 border-t">
<span className="text-sm text-muted-foreground">Notes/Comments:</span>
<p className="text-sm mt-1">{history.comments}</p>
</div>
)}
</div>
))}

{currentPendingStage &&
pa.status !== "Approved" &&
pa.status !== "Rejected" && (
<div className="border-2 border-amber-500 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/10 space-y-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-medium">
{currentPendingStage.order}
</div>
<div>
<h4 className="font-semibold">{currentPendingStage.name}</h4>
<p className="text-sm text-muted-foreground">Awaiting approval</p>
</div>
</div>
<div className="text-right">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
Pending
</span>
</div>
</div>
<div className="grid grid-cols-2 gap-4 text-sm">
<div>
<span className="text-muted-foreground">Status:</span>
<p className="font-medium text-amber-700 dark:text-amber-400">
Awaiting Approval
</p>
</div>
<div>
<span className="text-muted-foreground">Current State:</span>
<p className="font-medium text-amber-700 dark:text-amber-400">
In Progress
</p>
</div>
</div>
</div>
)}
</div>
)}
</TabsContent>
<TabsContent value="report" className="mt-4">
<WorkflowHistoryReport
preApproval={pa}
initiatorName={
employees.find((emp) => emp.id === pa.requestedBy)?.fullName || pa.requestedBy
}
workflowStages={workflowStages}
/>
</TabsContent>
</Tabs>
</div>
</DialogContent>
</Dialog>
<Link href={`/procurement/pre-approval/${pa.id}`}>
<Button size="sm" variant="ghost">
<Eye className="h-4 w-4" />
</Button>
</Link>
<Button size="sm" variant="ghost" onClick={() => handleDelete(pa.id)}>
<Trash2 className="h-4 w-4 text-red-600" />
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
Showing {filtered.length} of {preApprovals.length} pre-approvals
</p>
<p>Total Amount: ${filtered.reduce((sum, pa) => sum + pa.totalAmount, 0).toLocaleString()}</p>
</div>
</div>
</main>
</div>
)
}
