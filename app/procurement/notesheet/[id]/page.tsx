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

export default function NotesheetDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuth()
  const { notesheets, preApprovals, wings, warehouses, employees, workflowStages, updateNotesheet, addAuditLog } =
    useData()
  const [notes, setNotes] = useState("")

  const notesheet = notesheets.find((ns) => ns.id === params.id)
  const preApproval = preApprovals.find((pa) => pa.preApprovalId === notesheet?.preApprovalId)
  const wing = wings.find((w) => w.id === notesheet?.wingId)
  const warehouse = warehouses.find((wh) => wh.id === notesheet?.warehouseId)
  const initiatedByEmployee = employees.find((emp) => emp.id === notesheet?.initiatedBy)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user || !notesheet) {
    return null
  }

  // Get current workflow stage
  const currentStage = workflowStages.find(
    (stage) => stage.workflowType === "notesheet" && stage.order === notesheet.currentStage,
  )

  // Check if current user can approve at this stage
  const canApprove =
    currentStage &&
    (currentStage.assignedDesignations.includes(user.designation) || currentStage.assignedEmployees.includes(user.id))

  const handleApprove = () => {
    if (!currentStage) return

    const isLastStage = notesheet.currentStage >= workflowStages.filter((s) => s.workflowType === "notesheet").length

    updateNotesheet(notesheet.id, {
      status: isLastStage ? "Approved" : "Pending",
      currentStage: isLastStage ? notesheet.currentStage : notesheet.currentStage + 1,
      workflowHistory: [
        ...notesheet.workflowHistory,
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
      module: "Notesheet Workflow",
      details: `Approved Notesheet ${notesheet.notesheetId} at ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Notesheet approved successfully!")
    setNotes("")
    router.push("/procurement/notesheet")
  }

  const handleRecommend = () => {
    if (!currentStage) return

    updateNotesheet(notesheet.id, {
      status: "Pending",
      currentStage: notesheet.currentStage + 1,
      workflowHistory: [
        ...notesheet.workflowHistory,
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
      module: "Notesheet Workflow",
      details: `Recommended Notesheet ${notesheet.notesheetId} at ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Notesheet recommended successfully!")
    setNotes("")
    router.push("/procurement/notesheet")
  }

  const handleSendBack = () => {
    if (!currentStage) return

    if (!notes.trim()) {
      alert("Notes are required when sending back")
      return
    }

    updateNotesheet(notesheet.id, {
      status: "Sent Back",
      currentStage: Math.max(1, notesheet.currentStage - 1),
      workflowHistory: [
        ...notesheet.workflowHistory,
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
      module: "Notesheet Workflow",
      details: `Sent back Notesheet ${notesheet.notesheetId} from ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Notesheet sent back successfully!")
    setNotes("")
    router.push("/procurement/notesheet")
  }

  const handleReject = () => {
    if (!currentStage) return

    if (!notes.trim()) {
      alert("Notes are required when rejecting")
      return
    }

    updateNotesheet(notesheet.id, {
      status: "Rejected",
      workflowHistory: [
        ...notesheet.workflowHistory,
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
      module: "Notesheet Workflow",
      details: `Rejected Notesheet ${notesheet.notesheetId} at ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })

    alert("Notesheet rejected!")
    setNotes("")
    router.push("/procurement/notesheet")
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/procurement/notesheet">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{notesheet.notesheetId}</h1>
                <p className="text-muted-foreground mt-1">Notesheet Details</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                notesheet.status === "Approved"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : notesheet.status === "Pending"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    : notesheet.status === "Rejected"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {notesheet.status}
            </span>
          </div>

          {/* Notesheet Information */}
          <Card>
            <CardHeader>
              <CardTitle>Notesheet Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Notesheet ID</Label>
                <p className="font-medium">{notesheet.notesheetId}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Pre-Approval ID</Label>
                <p className="font-medium">
                  <Link href={`/procurement/pre-approval/${preApproval?.id}`} className="text-primary hover:underline">
                    {notesheet.preApprovalId}
                  </Link>
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Wing</Label>
                <p className="font-medium">{wing?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Warehouse</Label>
                <p className="font-medium">{warehouse?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Initiated By</Label>
                <p className="font-medium">{initiatedByEmployee?.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Initiated Date</Label>
                <p className="font-medium">{new Date(notesheet.initiatedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Current Stage</Label>
                <p className="font-medium">{currentStage?.name || "Completed"}</p>
              </div>
              {preApproval && (
                <div>
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="font-medium text-lg">${preApproval.totalAmount.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pre-Approval Items */}
          {preApproval && (
            <Card>
              <CardHeader>
                <CardTitle>Pre-Approval Items</CardTitle>
                <CardDescription>Items from referenced pre-approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Item</th>
                        <th className="text-right p-3 font-medium">Quantity</th>
                        <th className="text-right p-3 font-medium">Rate</th>
                        <th className="text-right p-3 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preApproval.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{item.itemName}</td>
                          <td className="p-3 text-right">{item.quantity}</td>
                          <td className="p-3 text-right">${item.rate.toFixed(2)}</td>
                          <td className="p-3 text-right font-medium">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workflow History */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow History</CardTitle>
              <CardDescription>Track of all approval actions</CardDescription>
            </CardHeader>
            <CardContent>
              {notesheet.workflowHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No workflow actions yet</p>
              ) : (
                <div className="space-y-4">
                  {notesheet.workflowHistory.map((action, index) => (
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Panel */}
          {canApprove && notesheet.status === "Pending" && (
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
