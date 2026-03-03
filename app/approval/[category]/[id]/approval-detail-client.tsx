"use client"

import { ArrowLeft, CheckCircle2, XCircle, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context" // Import useAuth hook
import type { ApprovalPreApproval } from "@/lib/demo-data"

interface ApprovalDetailClientProps {
  category: string
  preApproval: ApprovalPreApproval
}

export default function ApprovalDetailClient({ category, preApproval }: ApprovalDetailClientProps) {
  const router = useRouter()
  const { approvePreApproval, workflowStages, sendToReviewer, addReviewerComment, sendBackPreApproval } = useData()
  const { user } = useAuth() // Declare useAuth hook
  const [selectedAction, setSelectedAction] = useState<"Approved" | "Recommended" | "Rejected" | "Send Back" | "">("")
  const [notes, setNotes] = useState("")
  const [isApprovalHistoryOpen, setIsApprovalHistoryOpen] = useState(false)

  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState("")
  const [stockType, setStockType] = useState<"current" | "available">("current")
  const [selectedItem, setSelectedItem] = useState("")
  const [stockModalTab, setStockModalTab] = useState<"summary" | "detail">("summary")

  const getStockData = (warehouse: string, type: "current" | "available", itemName: string) => {
    // Generate asset name based on the item
    const assetNames: Record<string, string> = {
      "Office Chair": "Ergonomic Office Chair",
      Laptop: "Business Laptop",
      Desk: "Office Desk",
      Projector: "HD Projector",
      Printer: "Laser Printer",
      Monitor: "LED Monitor",
      Keyboard: "Wireless Keyboard",
      Mouse: "Optical Mouse",
      "A4 Paper Ream": "Office Paper",
      "Desktop Computer": "Desktop Computer",
      "Training Mat": "Training Mat",
      "First Aid Kit": "First Aid Kit",
      Basketball: "Basketball",
      "Network Switch": "Network Switch",
      "Cadet Dress Uniform": "Cadet Uniform",
      "CCTV Camera": "CCTV Camera",
    }

    const assetName = assetNames[itemName] || itemName || "Network Switch"

    // Map actual warehouse names to demo data keys
    const warehouseMap: Record<string, string> = {
      "Central Warehouse": "AcaHQ",
      "Admin Warehouse": "AcaHQ",
      "Training Warehouse": "TrainHQ",
      "Sports Warehouse": "SportsHQ",
      "Academic Warehouse": "AcaHQ",
      "Engineering Warehouse": "TrainHQ",
    }

    const mappedWarehouse = warehouseMap[warehouse] || "AcaHQ"

    const stockData: Record<
      string,
      {
        current: Array<{
          assetId: string
          assetName: string
          serialNumber: string
          status: "Available" | "Active" | "Expired"
        }>
        available: Array<{
          assetId: string
          assetName: string
          serialNumber: string
          status: "Available" | "Active" | "Expired"
        }>
      }
    > = {
      AcaHQ: {
        current: [
          {
            assetId: "A-103",
            assetName: assetName,
            serialNumber: "SN-2019-103",
            status: "Active",
          },
          {
            assetId: "A-104",
            assetName: assetName,
            serialNumber: "SN-2020-104",
            status: "Active",
          },
          {
            assetId: "A-105",
            assetName: assetName,
            serialNumber: "SN-2021-105",
            status: "Expired",
          },
          {
            assetId: "A-106",
            assetName: assetName,
            serialNumber: "SN-2022-106",
            status: "Expired",
          },
        ],
        available: [
          {
            assetId: "A-107",
            assetName: assetName,
            serialNumber: "SN-2024-107",
            status: "Available",
          },
          {
            assetId: "A-108",
            assetName: assetName,
            serialNumber: "SN-2015-108",
            status: "Available",
          },
          {
            assetId: "A-109",
            assetName: assetName,
            serialNumber: "SN-2023-109",
            status: "Available",
          },
        ],
      },
      TrainHQ: {
        current: [
          {
            assetId: "T-201",
            assetName: assetName,
            serialNumber: "SN-2021-201",
            status: "Active",
          },
          {
            assetId: "T-202",
            assetName: assetName,
            serialNumber: "SN-2020-202",
            status: "Active",
          },
          {
            assetId: "T-203",
            assetName: assetName,
            serialNumber: "SN-2019-203",
            status: "Expired",
          },
        ],
        available: [
          {
            assetId: "T-204",
            assetName: assetName,
            serialNumber: "SN-2018-204",
            status: "Available",
          },
          {
            assetId: "T-205",
            assetName: assetName,
            serialNumber: "SN-2022-205",
            status: "Available",
          },
        ],
      },
      SportsHQ: {
        current: [
          {
            assetId: "S-301",
            assetName: assetName,
            serialNumber: "SN-2020-301",
            status: "Expired",
          },
          {
            assetId: "S-302",
            assetName: assetName,
            serialNumber: "SN-2023-302",
            status: "Active",
          },
          {
            assetId: "S-303",
            assetName: assetName,
            serialNumber: "SN-2021-303",
            status: "Expired",
          },
        ],
        available: [
          {
            assetId: "S-304",
            assetName: assetName,
            serialNumber: "SN-2024-304",
            status: "Available",
          },
          {
            assetId: "S-305",
            assetName: assetName,
            serialNumber: "SN-2024-305",
            status: "Available",
          },
        ],
      },
    }

    return stockData[mappedWarehouse]?.[type] || []
  }

  const getStockQuantity = (warehouse: string, type: "current" | "available", itemName: string) => {
    return getStockData(warehouse, type, itemName).length
  }

  const openStockModal = (warehouse: string, type: "current" | "available", itemName: string) => {
    setSelectedWarehouse(warehouse)
    setStockType(type)
    setSelectedItem(itemName)
    setStockModalTab("summary")
    setStockModalOpen(true)
  }

  console.log("[v0] ============ APPROVAL DETAIL CLIENT DEBUG ============")
  console.log("[v0] Document ID:", preApproval.id)
  console.log("[v0] User employeeCode:", user?.employeeCode)
  console.log("[v0] User full info:", JSON.stringify(user, null, 2))
  console.log("[v0] Pending Reviews:", JSON.stringify(preApproval.pendingReviews, null, 2))
  console.log("[v0] Review Comments:", JSON.stringify(preApproval.reviewComments, null, 2))

  const isReviewer = (preApproval.pendingReviews || []).some(
    (pr) => pr.reviewerId === user?.employeeCode || pr.reviewerId === user?.id,
  )

  const currentStage = preApproval.currentStage
    ? typeof preApproval.currentStage === "string"
      ? { id: 0, name: preApproval.currentStage, order: 0 }
      : preApproval.currentStage
    : null

  const reviewerInfo = (preApproval.pendingReviews || []).find(
    (pr) => pr.reviewerId === user?.employeeCode || pr.reviewerId === user?.id,
  )

  console.log("[v0] Is Reviewer:", isReviewer)
  console.log("[v0] Reviewer Info:", JSON.stringify(reviewerInfo, null, 2))

  const pendingReviewCount = (preApproval.pendingReviews || []).length
  const completedReviewCount = (preApproval.reviewComments || []).length

  const getApproveTitle = () => {
    if (preApproval.category === "pre-approval") return `Approve Pre-Approval: ${preApproval.preApprovalNo}`
    if (preApproval.category === "note-sheet") return `Approve Note Sheet: ${preApproval.preApprovalNo}`
    if (preApproval.category === "purchase-order") return `Approve Purchase Order: ${preApproval.preApprovalNo}`
    if (preApproval.category === "purchase-receive") return `Approve GRN: ${preApproval.preApprovalNo}`
    if (preApproval.category === "inventory-issue") return `Approve Issue: ${preApproval.preApprovalNo}`
    if (preApproval.category === "inventory-receive") return `Approve Receive: ${preApproval.preApprovalNo}`
    if (preApproval.category === "inventory-transfer") return `Approve Transfer: ${preApproval.preApprovalNo}`
    const currentStageOrder = typeof preApproval.currentStage === "object" ? preApproval.currentStage.order : 1
    if (currentStageOrder === 3) {
      return "Approve"
    }
    return "Recommend"
  }

  const handleSubmit = async () => {
    if (!selectedAction) return

    try {
      if (selectedAction === "Send Back") {
        await sendBackPreApproval(preApproval.id, notes)
      } else {
        await approvePreApproval(preApproval.id, selectedAction, notes)
      }
      setIsApprovalHistoryOpen(false)
      router.push(`/approval/${category}`)
    } catch (error) {
      console.error("[v0] Error submitting approval:", error)
    }
  }

  const handleApproveClick = () => {
    setSelectedAction("Approved")
    setIsApprovalHistoryOpen(true)
  }

  const handleSendBackClick = () => {
    setSelectedAction("Send Back")
    setIsApprovalHistoryOpen(true)
  }

  const getSummaryStockData = () => {
    return [
      {
        sl: 1,
        wing: "Admin Wing",
        warehouse: "BQMS Store",
        stockQty: 50,
        useQty: 40,
        availableQty: 10,
      },
      {
        sl: 2,
        wing: "Training Wing",
        warehouse: "MT Store",
        stockQty: 30,
        useQty: 30,
        availableQty: 0,
      },
      {
        sl: 3,
        wing: "Medical Wing",
        warehouse: "CMH",
        stockQty: 20,
        useQty: 20,
        availableQty: 0,
      },
      {
        sl: 4,
        wing: "Engineering Wing",
        warehouse: "Engg Faculty",
        stockQty: 60,
        useQty: 59,
        availableQty: 1,
      },
      {
        sl: 5,
        wing: "Engineering Wing",
        warehouse: "PCAT",
        stockQty: 90,
        useQty: 80,
        availableQty: 10,
      },
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isReviewer ? "Review Document" : "Pending Pre Approval"}
                </h1>
                <p className="text-sm text-gray-500">Document ID: {preApproval.id}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {isReviewer ? (
                // Reviewers see the "Add Comments" button
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsApprovalHistoryOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comments
                </Button>
              ) : (
                // Regular approvers see the action buttons
                <>
                  <Button
                    variant="outline"
                    className="text-yellow-600 border-yellow-600 bg-transparent"
                    onClick={() => {}}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-600 bg-transparent" onClick={() => {}}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-600 bg-transparent"
                    onClick={handleSendBackClick}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Back
                  </Button>
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 bg-transparent"
                    onClick={() => {}}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Recommend
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleApproveClick}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval History Review Dialog - only for Approve action */}
      <Dialog open={isApprovalHistoryOpen} onOpenChange={setIsApprovalHistoryOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Approve Document - Review History</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Document Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-base mb-3">Document Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Document No:</span>{" "}
                  <span className="font-medium">{preApproval.preApprovalNo}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Amount:</span>{" "}
                  <span className="font-medium text-blue-600">{preApproval.totalAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Requested By:</span>{" "}
                  <span className="font-medium">{preApproval.requestedBy}</span>
                </div>
                <div>
                  <span className="text-gray-600">Wing:</span> <span className="font-medium">{preApproval.wing}</span>
                </div>
              </div>
            </div>

            {/* Previous Approver Comments/Notes */}
            {preApproval.approvalHistory && preApproval.approvalHistory.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Previous Approver Notes ({preApproval.approvalHistory.length})
                </h3>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {preApproval.approvalHistory.map((history, index) => (
                    <div
                      key={index}
                      className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge
                            className={
                              history.action === "Approved"
                                ? "bg-green-600"
                                : history.action === "Recommended"
                                  ? "bg-blue-600"
                                  : history.action === "Rejected"
                                    ? "bg-red-600"
                                    : "bg-orange-600"
                            }
                          >
                            {history.action}
                          </Badge>
                          <p className="text-sm font-medium mt-2">{history.stageName}</p>
                          <p className="text-xs text-muted-foreground">By: {history.approvedBy}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{history.approvedAt}</p>
                      </div>
                      {history.comments && (
                        <div className="mt-2 pt-2 border-t border-green-300 dark:border-green-700">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Notes:</p>
                          <p className="text-sm">{history.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviewer Comments */}
            {preApproval.reviewComments && preApproval.reviewComments.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Reviewer Comments ({preApproval.reviewComments.length})
                </h3>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {preApproval.reviewComments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge className="bg-purple-600">{comment.reviewType} Review</Badge>
                          <p className="text-sm font-medium mt-2">
                            {comment.reviewerName} ({comment.reviewerId})
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">{comment.submittedAt}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-purple-300 dark:border-purple-700">
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No History Message */}
            {(!preApproval.approvalHistory || preApproval.approvalHistory.length === 0) &&
              (!preApproval.reviewComments || preApproval.reviewComments.length === 0) && (
                <div className="text-center py-6 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No previous comments or notes available for this document.</p>
                </div>
              )}

            {/* Your Comments */}
            <div className="space-y-3">
              <h3 className="font-semibold">Your Approval Notes (Optional)</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your approval notes or comments here..."
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsApprovalHistoryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Approval
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Details */}
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Review Comments Section - Show prominently at top if any exist */}
        {completedReviewCount > 0 && (
          <div className="bg-purple-50 dark:bg-purple-950 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviewer Comments ({completedReviewCount})
            </h3>
            <div className="space-y-4">
              {(preApproval.reviewComments || []).map((comment, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge className="bg-purple-600">{comment.reviewType} Review</Badge>
                      <p className="text-sm font-medium mt-2">
                        {comment.reviewerName} ({comment.reviewerId})
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                  <p className="text-sm mt-2">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-card rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Pre-Approval No</p>
            <p className="font-medium">{preApproval.preApprovalNo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Request Date</p>
            <p className="font-medium">{preApproval.date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Requested By</p>
            <p className="font-medium">{preApproval.requestedBy}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{preApproval.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wing / Office</p>
            <p className="font-medium">{preApproval.wing}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Warehouse</p>
            <p className="font-medium">{preApproval.warehouse}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium text-blue-600">{preApproval.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Item Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">CODE</th>
                  <th className="text-left p-3 font-medium">ITEM</th>
                  <th className="text-left p-3 font-medium">UOM</th>
                  <th className="text-left p-3 font-medium">LAST PRICE</th>
                  <th className="text-left p-3 font-medium">STOCK</th>
                  <th className="text-left p-3 font-medium">REQ QTY</th>
                  <th className="text-left p-3 font-medium">RATE</th>
                  <th className="text-left p-3 font-medium">TOTAL</th>
                  <th className="text-left p-3 font-medium">CURRENT STOCK</th>
                  <th className="text-left p-3 font-medium">AVAILABLE</th>
                </tr>
              </thead>
              <tbody>
                {(preApproval.itemDetails || []).map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.code}</td>
                    <td className="p-3">{item.item}</td>
                    <td className="p-3">{item.uom}</td>
                    <td className="p-3">{item.lastPrice?.toFixed(2)}</td>
                    <td className="p-3">{item.stock}</td>
                    <td className="p-3">{item.reqQty}</td>
                    <td className="p-3">{item.rate?.toFixed(2)}</td>
                    <td className="p-3">{item.total?.toFixed(2)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => openStockModal(preApproval.warehouse, "current", item.item)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        {getStockQuantity(preApproval.warehouse, "current", item.item)}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => openStockModal(preApproval.warehouse, "available", item.item)}
                        className="text-sm text-green-600 hover:text-green-800 underline font-medium"
                      >
                        {getStockQuantity(preApproval.warehouse, "available", item.item)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-muted/30 flex justify-between items-center border-t">
            <span className="font-semibold">Grand Total:</span>
            <span className="text-xl font-bold text-blue-600">{preApproval.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] w-full">
          <DialogHeader>
            <DialogTitle>
              {stockType === "current" ? "Current Stock" : "Available Stock"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-1">
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Item:</span> {selectedItem}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold"> Request Warehouse:</span> {selectedWarehouse}
              </p>
            </div>

            <div className="flex gap-2 border-b mb-1">
              <button
                onClick={() => setStockModalTab("summary")}
                className={`px- py-2 text-sm font-medium transition-colors ${
                  stockModalTab === "summary"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Summary Stock
              </button>
              <button
                onClick={() => setStockModalTab("detail")}
                className={`px- py-2 text-sm font-medium transition-colors ${
                  stockModalTab === "detail"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Detail Stock
              </button>
            </div>

            {stockModalTab === "summary" && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="text-left p-3 font-medium border">SL</th>
                      <th className="text-left p-3 font-medium border">Wing</th>
                      <th className="text-left p-3 font-medium border">Warehouse</th>
                      <th className="text-right p-3 font-medium border">Stock Qty</th>
                      <th className="text-right p-3 font-medium border">Use Qty</th>
                      <th className="text-right p-3 font-medium border">Available Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSummaryStockData().map((row) => (
                      <tr key={row.sl} className="hover:bg-muted/50">
                        <td className="p-1 border">{row.sl}</td>
                        <td className="p-3 border">{row.wing}</td>
                        <td className="p-3 border">{row.warehouse}</td>
                        <td className="p-3 border text-right">{row.stockQty}</td>
                        <td className="p-3 border text-right">{row.useQty}</td>
                        <td className="p-3 border text-right">{row.availableQty}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan={3} className="p-3 border text-right">
                        Total
                      </td>
                      <td className="p-3 border text-right">250</td>
                      <td className="p-3 border text-right">229</td>
                      <td className="p-3 border text-right">21</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {stockModalTab === "detail" && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Asset ID</th>
                      <th className="text-left p-3 font-medium">Asset Name</th>
                      <th className="text-left p-3 font-medium">Serial Number</th>
                      <th className="text-left p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getStockData(selectedWarehouse, stockType, selectedItem).length > 0 ? (
                      getStockData(selectedWarehouse, stockType, selectedItem)
                        .filter((asset: any) => stockType === "current" || asset.status === "Available")
                        .map((asset: any, index: number) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="p-3">{asset.assetId}</td>
                            <td className="p-3">{asset.assetName}</td>
                            <td className="p-3">{asset.serialNumber}</td>
                            <td className="p-3">
                              <Badge
                                variant={asset.status === "Available" ? "default" : "secondary"}
                                className={
                                  asset.status === "Available"
                                    ? "bg-green-100 text-green-800"
                                    : asset.status === "Active"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }
                              >
                                {asset.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No stock data available for this warehouse
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
