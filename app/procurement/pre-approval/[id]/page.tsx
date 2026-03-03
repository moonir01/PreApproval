"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, XCircle, ArrowLeftCircle } from "lucide-react"
import Link from "next/link"
import { WorkflowHistoryReport } from "@/components/workflow-history-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function PreApprovalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuth()
  const { preApprovals, wings, warehouses, employees, workflowStages, updatePreApproval, addAuditLog } = useData()
  const [notes, setNotes] = useState("")
  const [accountsComments, setAccountsComments] = useState("")
  const [maintenanceComments, setMaintenanceComments] = useState("")
  const [centralAccountsComments, setCentralAccountsComments] = useState("")
  const [showActionPanel, setShowActionPanel] = useState(false)
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false)

  const preApproval = preApprovals.find((pa) => pa.id === params.id)
  const wing = wings.find((w) => w.id === preApproval?.wingId)
  const warehouse = warehouses.find((wh) => wh.id === preApproval?.warehouseId)
  const requestedByEmployee = employees.find((emp) => emp.id === preApproval?.requestedBy)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user || !preApproval) {
    return null
  }

  // Get current workflow stage
  const currentStage = workflowStages.find(
    (stage) => stage.workflowType === "preapproval" && stage.order === preApproval.currentStage,
  )

  // Check if current user can approve at this stage
  const canApprove =
    currentStage &&
    (currentStage.assignedDesignations.includes(user.designation) || currentStage.assignedEmployees.includes(user.id))

  const isAccountsOfficer =
    currentStage &&
    currentStage.requiresAccountsReview &&
    currentStage.accountsOfficers &&
    currentStage.accountsOfficers.includes(user.id)

  const isMaintenanceOfficer =
    currentStage &&
    currentStage.requiresMaintenanceReview &&
    currentStage.maintenanceOfficers &&
    currentStage.maintenanceOfficers.includes(user.id)

  const isCentralAccountsOfficer =
    currentStage &&
    currentStage.requiresCentralAccountsReview &&
    currentStage.centralAccountsOfficers &&
    currentStage.centralAccountsOfficers.includes(user.id)

  const handleApprove = () => {
    if (!currentStage) return

    const isLastStage =
      preApproval.currentStage >= workflowStages.filter((s) => s.workflowType === "preapproval").length

    updatePreApproval(preApproval.id, {
      status: isLastStage ? "Approved" : "Pending",
      currentStage: isLastStage ? preApproval.currentStage : preApproval.currentStage + 1,
      workflowHistory: [
        ...preApproval.workflowHistory,
        {
          stageId: currentStage.id,
          stageName: currentStage.name,
          actorId: user.id,
          actorName: user.fullName,
          action: "Approve",
          notes: notes || "Approved",
          timestamp: new Date().toISOString(),
        },
      ],
    })

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.fullName,
      action: "APPROVE",
      module: "Pre-Approval Workflow",
      details: `Approved Pre-Approval ${preApproval.preApprovalId} at ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Pre-Approval approved successfully!")
    setNotes("")
    router.push("/procurement/pre-approval")
  }

  const handleRecommend = () => {
    if (!currentStage) return

    updatePreApproval(preApproval.id, {
      status: "Pending",
      currentStage: preApproval.currentStage + 1,
      workflowHistory: [
        ...preApproval.workflowHistory,
        {
          stageId: currentStage.id,
          stageName: currentStage.name,
          actorId: user.id,
          actorName: user.fullName,
          action: "Recommend",
          notes: notes || "Recommended",
          timestamp: new Date().toISOString(),
        },
      ],
    })

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.fullName,
      action: "RECOMMEND",
      module: "Pre-Approval Workflow",
      details: `Recommended Pre-Approval ${preApproval.preApprovalId} at ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Pre-Approval recommended successfully!")
    setNotes("")
    router.push("/procurement/pre-approval")
  }

  const handleSendBack = () => {
    if (!currentStage) return

    if (!notes.trim()) {
      alert("Notes are required when sending back")
      return
    }

    updatePreApproval(preApproval.id, {
      status: "Sent Back",
      currentStage: Math.max(1, preApproval.currentStage - 1),
      workflowHistory: [
        ...preApproval.workflowHistory,
        {
          stageId: currentStage.id,
          stageName: currentStage.name,
          actorId: user.id,
          actorName: user.fullName,
          action: "Send Back",
          notes,
          timestamp: new Date().toISOString(),
        },
      ],
    })

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.fullName,
      action: "SEND_BACK",
      module: "Pre-Approval Workflow",
      details: `Sent back Pre-Approval ${preApproval.preApprovalId} from ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Pre-Approval sent back successfully!")
    setNotes("")
    router.push("/procurement/pre-approval")
  }

  const handleReject = () => {
    if (!currentStage) return

    if (!notes.trim()) {
      alert("Notes are required when rejecting")
      return
    }

    updatePreApproval(preApproval.id, {
      status: "Rejected",
      workflowHistory: [
        ...preApproval.workflowHistory,
        {
          stageId: currentStage.id,
          stageName: currentStage.name,
          actorId: user.id,
          actorName: user.fullName,
          action: "Reject",
          notes,
          timestamp: new Date().toISOString(),
        },
      ],
    })

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.fullName,
      action: "REJECT",
      module: "Pre-Approval Workflow",
      details: `Rejected Pre-Approval ${preApproval.preApprovalId} at ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Pre-Approval rejected!")
    setNotes("")
    router.push("/procurement/pre-approval")
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/procurement/pre-approval">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{preApproval.preApprovalId}</h1>
                <p className="text-muted-foreground mt-1">Pre-Approval Details</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                preApproval.status === "Approved"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : preApproval.status === "Pending"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    : preApproval.status === "Rejected"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {preApproval.status}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setShowWorkflowDialog(true)}>
              View Workflow History
            </Button>
          </div>

          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Wing</Label>
                <p className="font-medium">{wing?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Warehouse</Label>
                <p className="font-medium">{warehouse?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Requested By</Label>
                <p className="font-medium">{requestedByEmployee?.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Request Date</Label>
                <p className="font-medium">{new Date(preApproval.requestDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Current Stage</Label>
                <p className="font-medium">{currentStage?.name || "Completed"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Amount</Label>
                <p className="font-medium text-lg">${preApproval.totalAmount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Requested Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Item</th>
                      <th className="text-left p-3 font-medium">Description</th>
                      <th className="text-left p-3 font-medium">UOM</th>
                      <th className="text-right p-3 font-medium">Curr. Stock</th>
                      <th className="text-right p-3 font-medium">Quantity</th>
                      <th className="text-right p-3 font-medium">Rate</th>
                      <th className="text-right p-3 font-medium">Total</th>
                      <th className="text-left p-3 font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preApproval.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.itemName}</td>
                        <td className="p-3 text-muted-foreground">{item.description || "N/A"}</td>
                        <td className="p-3">{item.uom || "N/A"}</td>
                        <td className="p-3 text-right">{item.currentStock || 0}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">${item.rate.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">
                          ${(item.total || item.quantity * item.rate).toFixed(2)}
                        </td>
                        <td className="p-3 text-muted-foreground">{item.remarks || "-"}</td>
                      </tr>
                    ))}
                    <tr className="border-t bg-muted/50 font-medium">
                      <td colSpan={6} className="p-3 text-right">
                        Total Amount:
                      </td>
                      <td className="p-3 text-right text-lg">${preApproval.totalAmount.toLocaleString()}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Workflow History Dialog */}
          <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
            <DialogContent className="!max-w-none w-screen h-screen m-0 rounded-none flex flex-col p-0">
              <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
                <DialogTitle>Workflow History - {preApproval.preApprovalId}</DialogTitle>
                <DialogDescription>View approval workflow history and detailed report</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-auto px-6 pb-6">
                <Tabs defaultValue="summary" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary View</TabsTrigger>
                    <TabsTrigger value="report">Detailed Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="mt-4">
                    {preApproval.workflowHistory.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No workflow actions yet</p>
                    ) : (
                      <div className="space-y-4">
                        {preApproval.workflowHistory.map((action, index) => (
                          <div key={index} className="flex gap-4 border-l-2 border-primary pl-4 pb-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{action.stageName}</p>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    action.action === "Approve"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                      : action.action === "Recommend"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  }`}
                                >
                                  {action.action}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{action.actorName}</p>
                              <p className="text-sm mt-2">{action.notes}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(action.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {preApproval.status === "Pending" && currentStage && (
                          <div className="flex gap-4 border-l-2 border-amber-500 pl-4 pb-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{currentStage.name}</p>
                                <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                  Pending
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {currentStage.assignedEmployees
                                  .map((empId) => {
                                    const emp = employees.find((e) => e.id === empId)
                                    return emp?.fullName
                                  })
                                  .filter(Boolean)
                                  .join(", ") || "Assigned approvers"}
                              </p>
                              <p className="text-sm mt-2 italic text-muted-foreground">Awaiting Approval</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="report" className="mt-4">
                    <WorkflowHistoryReport
                      preApproval={preApproval}
                      initiatorName={requestedByEmployee?.fullName || preApproval.requestedBy}
                      workflowStages={workflowStages}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>

          {/* Action Panel */}
          {canApprove && preApproval.status === "Pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Actions</CardTitle>
                <CardDescription>You are authorized to take action at this stage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes / Comments</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes or comments..."
                    rows={4}
                    className="mt-2"
                  />
                </div>

                {/* Accounts Officer Comment Section */}
                {(isAccountsOfficer || isMaintenanceOfficer || isCentralAccountsOfficer) && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold text-black">Specialized Reviews</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Accounts Officer Comments */}
                      {isAccountsOfficer && (
                        <div>
                          <Label htmlFor="accountsComments" className="text-purple-700 font-semibold text-sm">
                            Accounts Officer Review
                          </Label>
                          <p className="text-xs text-black/60 mb-2">Budget verification & financial observations</p>
                          <Textarea
                            id="accountsComments"
                            value={accountsComments}
                            onChange={(e) => setAccountsComments(e.target.value)}
                            placeholder="Enter accounts review..."
                            rows={3}
                            className="mt-1 border-purple-300 focus:border-purple-500 text-sm"
                          />
                          {accountsComments && (
                            <p className="text-xs text-purple-600 mt-1">Reviewed by: {user.fullName}</p>
                          )}
                        </div>
                      )}

                      {/* Maintenance Officer Comments */}
                      {isMaintenanceOfficer && (
                        <div>
                          <Label htmlFor="maintenanceComments" className="text-orange-700 font-semibold text-sm">
                            Maintenance Officer Review
                          </Label>
                          <p className="text-xs text-black/60 mb-2">Technical specifications & maintenance notes</p>
                          <Textarea
                            id="maintenanceComments"
                            value={maintenanceComments}
                            onChange={(e) => setMaintenanceComments(e.target.value)}
                            placeholder="Enter maintenance review..."
                            rows={3}
                            className="mt-1 border-orange-300 focus:border-orange-500 text-sm"
                          />
                          {maintenanceComments && (
                            <p className="text-xs text-orange-600 mt-1">Reviewed by: {user.fullName}</p>
                          )}
                        </div>
                      )}

                      {/* Central Accounts Officer Comments */}
                      {isCentralAccountsOfficer && (
                        <div>
                          <Label htmlFor="centralAccountsComments" className="text-teal-700 font-semibold text-sm">
                            Central Accounts Review
                          </Label>
                          <p className="text-xs text-black/60 mb-2">Central budget approval & fund allocation</p>
                          <Textarea
                            id="centralAccountsComments"
                            value={centralAccountsComments}
                            onChange={(e) => setCentralAccountsComments(e.target.value)}
                            placeholder="Enter central accounts review..."
                            rows={3}
                            className="mt-1 border-teal-300 focus:border-teal-500 text-sm"
                          />
                          {centralAccountsComments && (
                            <p className="text-xs text-teal-600 mt-1">Reviewed by: {user.fullName}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleRecommend} variant="default">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recommend
                  </Button>
                  <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button onClick={handleSendBack} variant="outline">
                    <ArrowLeftCircle className="h-4 w-4 mr-2" />
                    Send Back
                  </Button>
                  <Button onClick={handleReject} variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
