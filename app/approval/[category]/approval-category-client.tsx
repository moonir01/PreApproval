"use client"

import React, { useState } from "react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, Search, CheckCircle, RotateCcw, Calendar, X } from "lucide-react"
import { Send } from "lucide-react" // Import Send icon
import { XCircle } from "lucide-react" // Import XCircle icon
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { LocalStorageInspector } from "@/components/local-storage-inspector"

interface ApprovalCategoryClientProps {
  category: string
}

export default function ApprovalCategoryClient({ category }: ApprovalCategoryClientProps) {
  const {
    approvalPreApprovals,
    workflowStages,
    approvePreApproval,
    approveRequisition,
    sendToReviewer,
    sendBackPreApproval,
    employees,
  } = useData()
  const { user } = useAuth()

  const [selectedWings, setSelectedWings] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPreApprovals, setSelectedPreApprovals] = useState<string[]>([])
  const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null)
  const [selectedRecommendId, setSelectedRecommendId] = useState<string | null>(null)
  const [rejectComment, setRejectComment] = useState("")
  const [recommendComment, setRecommendComment] = useState("")

  const [selectedAccountsOfficer, setSelectedAccountsOfficer] = useState<string>("none")
  const [selectedMaintenanceOfficer, setSelectedMaintenanceOfficer] = useState<string>("none")
  const [selectedCentralAccountsOfficer, setSelectedCentralAccountsOfficer] = useState<string>("none")

  const [selectedReviewerComment, setSelectedReviewerComment] = useState<{
    reviewType: string
    reviewerName: string
    comment: string
    submittedAt: string
    stageName: string
  } | null>(null)

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const {
    approvalPreApprovals: updatedApprovalPreApprovals,
    approveApprovalPreApproval,
    rejectApprovalPreApproval,
    recommendApprovalPreApproval,
    sendToReviewer: updatedSendToReviewer,
  } = useData()
  const { loggedInEmployee } = useAuth()

  const formatCategory = (cat: string) => {
    if (!cat) return "Pending Approval"
    const formatted = cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return `Pending ${formatted}`
  }

  const wings = [
    { id: "all", name: "All", color: "bg-gray-900" },
    { id: "admin", name: "Admin Wing", color: "bg-purple-100 text-purple-700" },
    { id: "training", name: "Training Wing", color: "bg-green-100 text-green-700" },
    { id: "academic", name: "Academic Wing", color: "bg-orange-100 text-orange-700" },
    { id: "engineering", name: "Engineering Wing", color: "bg-red-100 text-red-700" },
  ]

  const workflowTypeMap: Record<string, string> = {
    "pre-approval": "preapproval",
    "note-sheet": "notesheet",
    "purchase-order": "purchase-order",
    "purchase-receive": "purchase-receive",
    "inventory-issue": "inventory-issue",
    "inventory-receive": "inventory-receive",
    "inventory-transfer": "inventory-transfer",
  }

  const filteredPreApprovals = updatedApprovalPreApprovals.filter((req) => {
    const matchesCategory = req.workflowType === workflowTypeMap[category]

    const currentStage = workflowStages.find((s) => s.id === req.currentStageId)

    const isAssignedToUser =
      currentStage &&
      user &&
      (currentStage.assignedEmployees.includes(user.employeeCode) ||
        (currentStage.assignedDesignations &&
          user.designation &&
          currentStage.assignedDesignations.includes(user.designation)))

    const isPendingForUser = req.status === "Pending" && isAssignedToUser

    if (req.id === "PA-2025-958") {
      console.log("[v0] Filtering PA-2025-958:")
      console.log("[v0]   - Document status:", req.status)
      console.log("[v0]   - Current stage ID:", req.currentStageId)
      console.log("[v0]   - Current stage name:", currentStage?.name)
      console.log("[v0]   - Stage assigned employees:", currentStage?.assignedEmployees)
      console.log("[v0]   - User employee code:", user?.employeeCode)
      console.log("[v0]   - isAssignedToUser:", isAssignedToUser)
      console.log("[v0]   - isPendingForUser:", isPendingForUser)
      console.log("[v0]   - matchesCategory:", matchesCategory)
    }

    const matchesWing =
      selectedWings.length === 0 ||
      selectedWings.includes("all") ||
      selectedWings.some((wing) => req.wing.toLowerCase().includes(wing.toLowerCase()))

    const matchesSearch =
      !searchQuery ||
      req.preApprovalNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.wing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.status.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && isPendingForUser && matchesWing && matchesSearch
  })

  const toggleWing = (wingId: string) => {
    if (wingId === "all") {
      setSelectedWings([])
    } else {
      setSelectedWings((prev) => (prev.includes(wingId) ? prev.filter((w) => w !== wingId) : [...prev, wingId]))
    }
  }

  const togglePreApproval = (reqId: string) => {
    setSelectedPreApprovals((prev) => (prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]))
  }

  const toggleAllPreApprovals = () => {
    if (selectedPreApprovals.length === filteredPreApprovals.length) {
      setSelectedPreApprovals([])
    } else {
      setSelectedPreApprovals(filteredPreApprovals.map((req) => req.id))
    }
  }

  const handleBulkAction = (action: "Approved" | "Recommended" | "Rejected" | "Reviewed" | "Send Back") => {
    if (selectedPreApprovals.length === 0) return
    setSelectedAction(action)
    setIsDialogOpen(true)
  }

  const handleSubmitBulkAction = (
    actionOverride?: "Approved" | "Recommended" | "Rejected" | "Reviewed" | "Send Back",
  ) => {
    const action = actionOverride || selectedAction
    console.log("[v0] handleSubmitBulkAction called with action:", action)

    selectedPreApprovals.forEach((preApprovalId) => {
      if (action === "Send Back") {
        console.log("[v0] Calling sendBackPreApproval for:", preApprovalId)
        sendBackPreApproval(preApprovalId, comments)
      } else {
        console.log("[v0] Calling approvePreApproval for:", preApprovalId, "with action:", action)
        approvePreApproval(
          preApprovalId,
          action,
          comments,
          selectedAccountsOfficer,
          selectedMaintenanceOfficer,
          selectedCentralAccountsOfficer,
        )
      }
    })
    setIsDialogOpen(false)
    setComments("")
    setSelectedPreApprovals([])
    setSelectedAccountsOfficer("none")
    setSelectedMaintenanceOfficer("none")
    setSelectedCentralAccountsOfficer("none")
  }

  const getIdColumnName = () => {
    if (category === "pre-approval") return "PRE-APPROVAL NO"
    if (category === "note-sheet") return "NOTE SHEET NO"
    if (category === "purchase-order") return "PURCHASE ORDER NO"
    if (category === "purchase-receive") return "GRN NO"
    if (category === "inventory-issue") return "ISSUE NO"
    if (category === "inventory-receive") return "RECEIVE NO"
    if (category === "inventory-transfer") return "TRANSFER NO"
    return "DOCUMENT NO"
  }

  const getCurrentStageForSelection = () => {
    if (selectedPreApprovals.length !== 1) return null
    const preApproval = updatedApprovalPreApprovals.find((req) => req.id === selectedPreApprovals[0])
    if (!preApproval) return null
    return workflowStages.find((s) => s.id === preApproval.currentStageId)
  }

  const currentStage = getCurrentStageForSelection()

  const getAccountsOfficers = () => {
    if (!currentStage || !currentStage.requiresAccountsReview) return []
    return employees.filter((emp) => currentStage.accountsOfficers.includes(emp.employeeCode))
  }

  const getMaintenanceOfficers = () => {
    if (!currentStage || !currentStage.requiresMaintenanceReview) return []
    return employees.filter((emp) => currentStage.maintenanceOfficers.includes(emp.employeeCode))
  }

  const getCentralAccountsOfficers = () => {
    if (!currentStage || !currentStage.requiresCentralAccountsReview) return []
    return employees.filter((emp) => currentStage.centralAccountsOfficers.includes(emp.employeeCode))
  }

  const accountsOfficers = getAccountsOfficers()
  const maintenanceOfficers = getMaintenanceOfficers()
  const centralAccountsOfficers = getCentralAccountsOfficers()

  const hasOptionalReviewers =
    selectedPreApprovals.length === 1 &&
    currentStage &&
    (currentStage.requiresAccountsReview ||
      currentStage.requiresMaintenanceReview ||
      currentStage.requiresCentralAccountsReview)

  const hasReviewerSelected =
    (selectedAccountsOfficer && selectedAccountsOfficer !== "none") ||
    (selectedMaintenanceOfficer && selectedMaintenanceOfficer !== "none") ||
    (selectedCentralAccountsOfficer && selectedCentralAccountsOfficer !== "none")

  const handleSendToAccountsOfficer = () => {
    console.log("[v0] handleSendToAccountsOfficer START")
    if (!selectedPreApprovals.length || !selectedAccountsOfficer || selectedAccountsOfficer === "none") {
      console.log("[v0] Validation failed:", { selectedPreApprovals, selectedAccountsOfficer })
      return
    }

    const docId = selectedPreApprovals[0]
    const reviewer = accountsOfficers.find((o) => o.employeeCode === selectedAccountsOfficer)
    if (!reviewer) {
      console.log("[v0] Reviewer not found")
      return
    }

    console.log("[v0] handleSendToAccountsOfficer called", {
      docId,
      reviewType: "Account",
      reviewerId: reviewer.employeeCode,
      reviewerName: reviewer.fullName,
    })

    try {
      console.log("[v0] sendToReviewer function exists?", typeof updatedSendToReviewer)
      if (typeof updatedSendToReviewer === "function") {
        updatedSendToReviewer(docId, "Account", reviewer.employeeCode, reviewer.fullName)
        console.log("[v0] sendToReviewer called successfully")
      } else {
        console.error("[v0] sendToReviewer is not a function!", updatedSendToReviewer)
        alert("Error: Review function not available. Please refresh the page.")
        return
      }
    } catch (error) {
      console.error("[v0] Error calling sendToReviewer:", error)
      alert("Error sending document to reviewer. Please try again.")
      return
    }

    // Reset selection
    setSelectedAccountsOfficer("none")

    // Show success feedback
    const docNo = updatedApprovalPreApprovals.find((req) => req.id === docId)?.preApprovalNo
    alert(`Document ${docNo} successfully sent to ${reviewer.fullName} (Accounts Officer) for review.`)
  }

  const handleSendToMaintenanceOfficer = () => {
    console.log("[v0] handleSendToMaintenanceOfficer START")
    if (!selectedPreApprovals.length || !selectedMaintenanceOfficer || selectedMaintenanceOfficer === "none") {
      console.log("[v0] Validation failed:", { selectedPreApprovals, selectedMaintenanceOfficer })
      return
    }

    const docId = selectedPreApprovals[0]
    const reviewer = maintenanceOfficers.find((o) => o.employeeCode === selectedMaintenanceOfficer)
    if (!reviewer) {
      console.log("[v0] Reviewer not found")
      return
    }

    console.log("[v0] handleSendToMaintenanceOfficer called", {
      docId,
      reviewType: "Maintenance",
      reviewerId: reviewer.employeeCode,
      reviewerName: reviewer.fullName,
    })

    try {
      if (typeof updatedSendToReviewer === "function") {
        updatedSendToReviewer(docId, "Maintenance", reviewer.employeeCode, reviewer.fullName)
        console.log("[v0] sendToReviewer called successfully")
      } else {
        console.error("[v0] sendToReviewer is not a function!", updatedSendToReviewer)
        alert("Error: Review function not available. Please refresh the page.")
        return
      }
    } catch (error) {
      console.error("[v0] Error calling sendToReviewer:", error)
      alert("Error sending document to reviewer. Please try again.")
      return
    }

    // Reset selection
    setSelectedMaintenanceOfficer("none")

    // Show success feedback
    const docNo = updatedApprovalPreApprovals.find((req) => req.id === docId)?.preApprovalNo
    alert(`Document ${docNo} successfully sent to ${reviewer.fullName} (Maintenance Officer) for review.`)
  }

  const handleSendToCentralAccountsOfficer = () => {
    console.log("[v0] handleSendToCentralAccountsOfficer START")
    if (!selectedPreApprovals.length || !selectedCentralAccountsOfficer || selectedCentralAccountsOfficer === "none") {
      console.log("[v0] Validation failed:", { selectedPreApprovals, selectedCentralAccountsOfficer })
      return
    }

    const docId = selectedPreApprovals[0]
    const reviewer = centralAccountsOfficers.find((o) => o.employeeCode === selectedCentralAccountsOfficer)
    if (!reviewer) {
      console.log("[v0] Reviewer not found")
      return
    }

    console.log("[v0] handleSendToCentralAccountsOfficer called", {
      docId,
      reviewType: "Central Accounts",
      reviewerId: reviewer.employeeCode,
      reviewerName: reviewer.fullName,
    })

    try {
      if (typeof updatedSendToReviewer === "function") {
        updatedSendToReviewer(docId, "Central Accounts", reviewer.employeeCode, reviewer.fullName)
        console.log("[v0] sendToReviewer called successfully")
      } else {
        console.error("[v0] sendToReviewer is not a function!", updatedSendToReviewer)
        alert("Error: Review function not available. Please refresh the page.")
        return
      }
    } catch (error) {
      console.error("[v0] Error calling sendToReviewer:", error)
      alert("Error sending document to reviewer. Please try again.")
      return
    }

    // Reset selection
    setSelectedCentralAccountsOfficer("none")

    // Show success feedback
    const docNo = updatedApprovalPreApprovals.find((req) => req.id === docId)?.preApprovalNo
    alert(`Document ${docNo} successfully sent to ${reviewer.fullName} (Central Accounts Officer) for review.`)
  }

  const handleShowReviewerComment = (docId: string, reviewType: "Account" | "Maintenance" | "Central Accounts") => {
    console.log("[v0] handleShowReviewerComment called", { docId, reviewType })
    const doc = updatedApprovalPreApprovals.find((d) => d.id === docId)
    console.log("[v0] Found document:", doc?.id, "reviewComments:", doc?.reviewComments)

    if (!doc || !doc.reviewComments) {
      console.log("[v0] No document or no reviewComments array")
      return
    }

    const comment = doc.reviewComments.find((c) => c.reviewType === reviewType)
    console.log("[v0] Found comment:", comment)

    if (comment) {
      console.log("[v0] Setting selected reviewer comment modal")
      setSelectedReviewerComment({
        reviewType: comment.reviewType,
        reviewerName: comment.reviewerName,
        comment: comment.comment,
        submittedAt: comment.submittedAt,
        stageName: comment.stageName,
      })
    }
  }

  const toggleRowExpansion = (docId: string) => {
    setExpandedRowId(expandedRowId === docId ? null : docId)
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<
    "Approved" | "Recommended" | "Rejected" | "Reviewed" | "Send Back"
  >("Approved")
  const [comments, setComments] = useState("")

  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("")
  const [stockType, setStockType] = useState<"current" | "available">("current")
  const [selectedItem, setSelectedItem] = useState<string>("")

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
          code: string
          assetName: string
          purchaseDate: string
          plannedLife: string
          timeUsed: string
          timeRemaining: string
          endOfLife: string
          leadTime: string
          reorderDate: string
          assignTo: string
          status: "Available" | "Active" | "Expired"
          daysUntilReorder: string
        }>
        available: Array<{
          code: string
          assetName: string
          purchaseDate: string
          plannedLife: string
          timeUsed: string
          timeRemaining: string
          endOfLife: string
          leadTime: string
          reorderDate: string
          assignTo: string
          status: "Available" | "Active" | "Expired"
          daysUntilReorder: string
        }>
      }
    > = {
      AcaHQ: {
        current: [
          {
            code: "A-103",
            assetName: assetName,
            purchaseDate: "2019-01-20",
            plannedLife: "7 yrs",
            timeUsed: "6y 5m 28d",
            timeRemaining: "0y 6m 7d",
            endOfLife: "2026-01-18",
            leadTime: "120 days",
            reorderDate: "2025-09-20",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "0y 2m 7d",
          },
          {
            code: "A-104",
            assetName: assetName,
            purchaseDate: "2020-05-10",
            plannedLife: "6 yrs",
            timeUsed: "5y 2m 7d",
            timeRemaining: "0y 9m 28d",
            endOfLife: "2026-05-09",
            leadTime: "60 days",
            reorderDate: "2026-03-10",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "0y 7m 28d",
          },
          {
            code: "A-105",
            assetName: assetName,
            purchaseDate: "2021-06-15",
            plannedLife: "3 yrs",
            timeUsed: "4y 1m 1d",
            timeRemaining: "0y 0m 0d",
            endOfLife: "2024-06-14",
            leadTime: "30 days",
            reorderDate: "2024-05-15",
            assignTo: "Abdur Rahman",
            status: "Expired",
            daysUntilReorder: "0y 0m 0d",
          },
          {
            code: "A-106",
            assetName: assetName,
            purchaseDate: "2022-02-05",
            plannedLife: "3 yrs",
            timeUsed: "3y 5m 11d",
            timeRemaining: "0y 0m 0d",
            endOfLife: "2025-02-04",
            leadTime: "45 days",
            reorderDate: "2024-12-21",
            assignTo: "HR Admin",
            status: "Expired",
            daysUntilReorder: "0y 0m 0d",
          },
        ],
        available: [
          {
            code: "A-107",
            assetName: assetName,
            purchaseDate: "2024-03-12",
            plannedLife: "4 yrs",
            timeUsed: "1y 4m 5d",
            timeRemaining: "2y 8m 0d",
            endOfLife: "2028-03-11",
            leadTime: "45 days",
            reorderDate: "2028-01-26",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "2y 6m 15d",
          },
          {
            code: "A-108",
            assetName: assetName,
            purchaseDate: "2015-11-30",
            plannedLife: "15 yrs",
            timeUsed: "9y 7m 20d",
            timeRemaining: "5y 4m 15d",
            endOfLife: "2030-11-26",
            leadTime: "180 days",
            reorderDate: "2030-05-30",
            assignTo: "Sharif Hossain",
            status: "Active",
            daysUntilReorder: "4y 10m 20d",
          },
          {
            code: "A-109",
            assetName: assetName,
            purchaseDate: "2023-08-15",
            plannedLife: "5 yrs",
            timeUsed: "2y 0m 2d",
            timeRemaining: "2y 11m 28d",
            endOfLife: "2028-08-14",
            leadTime: "90 days",
            reorderDate: "2028-05-16",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "2y 8m 26d",
          },
        ],
      },
      TrainHQ: {
        current: [
          {
            code: "T-201",
            assetName: assetName,
            purchaseDate: "2021-09-01",
            plannedLife: "5 yrs",
            timeUsed: "3y 10m 18d",
            timeRemaining: "1y 1m 17d",
            endOfLife: "2026-08-31",
            leadTime: "90 days",
            reorderDate: "2026-06-02",
            assignTo: "IT Department",
            status: "Active",
            daysUntilReorder: "0y 10m 22d",
          },
          {
            code: "T-202",
            assetName: assetName,
            purchaseDate: "2020-05-10",
            plannedLife: "6 yrs",
            timeUsed: "5y 2m 7d",
            timeRemaining: "0y 9m 28d",
            endOfLife: "2026-05-09",
            leadTime: "60 days",
            reorderDate: "2026-03-10",
            assignTo: "Khalek Ahmed",
            status: "Active",
            daysUntilReorder: "0y 7m 28d",
          },
          {
            code: "T-203",
            assetName: assetName,
            purchaseDate: "2019-11-20",
            plannedLife: "5 yrs",
            timeUsed: "5y 7m 27d",
            timeRemaining: "0y 0m 0d",
            endOfLife: "2024-11-19",
            leadTime: "75 days",
            reorderDate: "2024-09-05",
            assignTo: "Training Admin",
            status: "Expired",
            daysUntilReorder: "0y 0m 0d",
          },
        ],
        available: [
          {
            code: "T-204",
            assetName: assetName,
            purchaseDate: "2018-07-01",
            plannedLife: "6 yrs",
            timeUsed: "7y 0m 16d",
            timeRemaining: "0y 0m 0d",
            endOfLife: "2024-06-29",
            leadTime: "60 days",
            reorderDate: "2024-04-30",
            assignTo: "Available",
            status: "Expired",
            daysUntilReorder: "0y 0m 0d",
          },
          {
            code: "T-205",
            assetName: assetName,
            purchaseDate: "2022-12-01",
            plannedLife: "3 yrs",
            timeUsed: "2y 7m 17d",
            timeRemaining: "0y 4m 18d",
            endOfLife: "2025-11-30",
            leadTime: "150 days",
            reorderDate: "2025-07-03",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "0y 0m 13d",
          },
        ],
      },
      SportsHQ: {
        current: [
          {
            code: "S-301",
            assetName: assetName,
            purchaseDate: "2020-03-15",
            plannedLife: "5 yrs",
            timeUsed: "5y 4m 2d",
            timeRemaining: "0y 0m 0d",
            endOfLife: "2025-03-14",
            leadTime: "75 days",
            reorderDate: "2024-12-29",
            assignTo: "Sports Admin",
            status: "Expired",
            daysUntilReorder: "0y 0m 0d",
          },
          {
            code: "S-302",
            assetName: assetName,
            purchaseDate: "2023-01-10",
            plannedLife: "4 yrs",
            timeUsed: "2y 6m 7d",
            timeRemaining: "1y 5m 28d",
            endOfLife: "2027-01-09",
            leadTime: "60 days",
            reorderDate: "2026-11-10",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "1y 3m 30d",
          },
          {
            code: "S-303",
            assetName: assetName,
            purchaseDate: "2021-04-20",
            plannedLife: "4 yrs",
            timeUsed: "4y 3m 27d",
            timeRemaining: "0y 0m 0d",
            endOfLife: "2025-04-19",
            leadTime: "90 days",
            reorderDate: "2025-01-19",
            assignTo: "Equipment Room",
            status: "Expired",
            daysUntilReorder: "0y 0m 0d",
          },
        ],
        available: [
          {
            code: "S-304",
            assetName: assetName,
            purchaseDate: "2024-06-20",
            plannedLife: "5 yrs",
            timeUsed: "1y 0m 27d",
            timeRemaining: "3y 11m 8d",
            endOfLife: "2029-06-19",
            leadTime: "90 days",
            reorderDate: "2029-03-21",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "3y 8m 10d",
          },
          {
            code: "S-305",
            assetName: assetName,
            purchaseDate: "2024-01-15",
            plannedLife: "6 yrs",
            timeUsed: "1y 6m 2d",
            timeRemaining: "4y 5m 28d",
            endOfLife: "2030-01-14",
            leadTime: "120 days",
            reorderDate: "2029-09-16",
            assignTo: "Available",
            status: "Active",
            daysUntilReorder: "4y 2m 26d",
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
    setStockModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{formatCategory(category)}</h1>
        <div className="flex gap-2">
       
          <Button
            variant="outline"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-400"
            disabled={selectedPreApprovals.length === 0}
            onClick={() => handleBulkAction("Reviewed")}
          >
            Review
          </Button>
          <Button
            variant="outline"
            className="bg-red-500 hover:bg-red-600 text-white border-red-500"
            disabled={selectedPreApprovals.length === 0}
            onClick={() => handleBulkAction("Rejected")}
          >
            Reject
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={selectedPreApprovals.length === 0}
            onClick={() => handleBulkAction("Approved")}
          >
            Approve
          </Button>
        </div>
      </div>

      {/* Optional Reviewer Dropdowns */}
      {hasOptionalReviewers && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Optional Review Assignment</h3>
          <p className="text-xs text-gray-600 mb-4">
            Select a reviewer to route this document for comments before final approval
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStage.requiresAccountsReview && accountsOfficers.length > 0 && (
              <div>
                <Label htmlFor="accounts-officer" className="text-sm font-medium mb-2 block">
                  Accounts Officer
                </Label>
                <div className="flex gap-2">
                  <Select value={selectedAccountsOfficer} onValueChange={setSelectedAccountsOfficer}>
                    <SelectTrigger id="accounts-officer">
                      <SelectValue placeholder="Select Accounts Officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {accountsOfficers.map((officer) => (
                        <SelectItem key={officer.employeeCode} value={officer.employeeCode}>
                          {officer.employeeCode} - {officer.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSendToAccountsOfficer}
                    disabled={selectedAccountsOfficer === "none"}
                    className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            )}

            {currentStage.requiresMaintenanceReview && maintenanceOfficers.length > 0 && (
              <div>
                <Label htmlFor="maintenance-officer" className="text-sm font-medium mb-2 block">
                  Maintenance Officer
                </Label>
                <div className="flex gap-2">
                  <Select value={selectedMaintenanceOfficer} onValueChange={setSelectedMaintenanceOfficer}>
                    <SelectTrigger id="maintenance-officer">
                      <SelectValue placeholder="Select Maintenance Officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {maintenanceOfficers.map((officer) => (
                        <SelectItem key={officer.employeeCode} value={officer.employeeCode}>
                          {officer.employeeCode} - {officer.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSendToMaintenanceOfficer}
                    disabled={selectedMaintenanceOfficer === "none"}
                    className="bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap"
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            )}

            {currentStage.requiresCentralAccountsReview && centralAccountsOfficers.length > 0 && (
              <div>
                <Label htmlFor="central-accounts-officer" className="text-sm font-medium mb-2 block">
                  Central Accounts Officer
                </Label>
                <div className="flex gap-2">
                  <Select value={selectedCentralAccountsOfficer} onValueChange={setSelectedCentralAccountsOfficer}>
                    <SelectTrigger id="central-accounts-officer">
                      <SelectValue placeholder="Select Central Accounts Officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {centralAccountsOfficers.map((officer) => (
                        <SelectItem key={officer.employeeCode} value={officer.employeeCode}>
                          {officer.employeeCode} - {officer.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSendToCentralAccountsOfficer}
                    disabled={selectedCentralAccountsOfficer === "none"}
                    className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wing Filter Chips */}
      <div className="flex gap-2 mb-4">
        {wings.map((wing) => (
          <Button
            key={wing.id}
            variant={
              (wing.id === "all" && selectedWings.length === 0) || selectedWings.includes(wing.id)
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => toggleWing(wing.id)}
            className={
              (wing.id === "all" && selectedWings.length === 0) || selectedWings.includes(wing.id) ? wing.color : ""
            }
          >
            {wing.name}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Pre-Approval No, Wing, or Status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Pre-Approvals Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={
                    updatedApprovalPreApprovals.length > 0 &&
                    selectedPreApprovals.length === updatedApprovalPreApprovals.length
                  }
                  onCheckedChange={toggleAllPreApprovals}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{getIdColumnName()}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">WING</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">REQUESTED BY</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DATE</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ITEMS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">TOTAL AMOUNT</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">STATUS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">REVIEWERS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPreApprovals.map((req) => (
              <React.Fragment key={req.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedPreApprovals.includes(req.id)}
                      onCheckedChange={() => togglePreApproval(req.id)}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{req.preApprovalNo}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{req.wing}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{req.requestedBy}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{req.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{req.items}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{req.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 items-center">
                      {req.pendingReviews && req.pendingReviews.length > 0
                        ? req.pendingReviews.map((review, index) => {
                            const badgeColor =
                              review.reviewType === "Account"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : review.reviewType === "Maintenance"
                                  ? "bg-orange-100 text-orange-800 border-orange-300"
                                  : "bg-green-100 text-green-800 border-green-300"

                            const badgeLabel =
                              review.reviewType === "Account"
                                ? "AO"
                                : review.reviewType === "Maintenance"
                                  ? "MO"
                                  : "CAO"

                            return (
                              <Badge
                                key={index}
                                variant="outline"
                                className={badgeColor}
                                title={`${review.reviewerName} - Review pending`}
                              >
                                {badgeLabel}
                              </Badge>
                            )
                          })
                        : null}
                      {req.reviewComments &&
                        req.reviewComments.length > 0 &&
                        req.reviewComments.map((comment, index) => {
                          const badgeColor =
                            comment.reviewType === "Account"
                              ? "bg-blue-500 text-white border-blue-600"
                              : comment.reviewType === "Maintenance"
                                ? "bg-orange-500 text-white border-orange-600"
                                : "bg-green-500 text-white border-green-600"

                          const badgeLabel =
                            comment.reviewType === "Account"
                              ? "AO"
                              : comment.reviewType === "Maintenance"
                                ? "MO"
                                : "CAO"

                          return (
                            <Badge
                              key={`completed-${index}`}
                              variant="outline"
                              className={badgeColor}
                              title={`${comment.reviewerName}'s comment`}
                            >
                              {badgeLabel}
                            </Badge>
                          )
                        })}
                      {req.reviewComments && req.reviewComments.length > 0 && (
                        <button
                          onClick={() => toggleRowExpansion(req.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 underline font-medium ml-2"
                        >
                          View Comments
                        </button>
                      )}
                      {!req.pendingReviews?.length && !req.reviewComments?.length && (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/approval/${category}/${req.id}`}>
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Link>
                    </Button>
                  </td>
                </tr>
                {expandedRowId === req.id && req.reviewComments && req.reviewComments.length > 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {req.reviewComments.map((comment, index) => {
                          const isApproved = comment.comment && comment.submittedAt
                          const isPending = !comment.submittedAt

                          const borderColor =
                            comment.reviewType === "Account"
                              ? "border-l-green-500"
                              : comment.reviewType === "Maintenance"
                                ? "border-l-orange-500"
                                : "border-l-yellow-500"

                          const badgeColor =
                            comment.reviewType === "Account"
                              ? "bg-blue-100 text-blue-800"
                              : comment.reviewType === "Maintenance"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"

                          const badgeLabel =
                            comment.reviewType === "Account"
                              ? "AO"
                              : comment.reviewType === "Maintenance"
                                ? "MO"
                                : "CAD"

                          return (
                            <div
                              key={index}
                              className={`bg-white border-l-4 ${borderColor} rounded-lg p-4 shadow-sm space-y-3`}
                            >
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className={badgeColor}>
                                  {badgeLabel}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  {isApproved ? (
                                    <>
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-xs font-medium text-green-600">Approved</span>
                                    </>
                                  ) : (
                                    <>
                                      <RotateCcw className="h-4 w-4 text-yellow-600" />
                                      <span className="text-xs font-medium text-yellow-600">Pending</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <svg
                                  className="h-4 w-4 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                <span className="font-medium">{comment.reviewerName}</span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-700 italic">&ldquo;{comment.comment}&rdquo;</p>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Calendar className="h-3 w-3" />
                                <span>{comment.timestamp || comment.submittedAt}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredPreApprovals.length === 0 && (
          <div className="p-8 text-center text-gray-500">No pre-approvals found matching your filters.</div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Approval Actions</DialogTitle>
            <p className="text-sm text-gray-600 mt-2">You are authorized to take action at this stage</p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPreApprovals.length === 1 &&
              (() => {
                const selectedPreApproval = approvalPreApprovals.find((pa) => pa.id === selectedPreApprovals[0])
                if (
                  selectedPreApproval &&
                  (selectedPreApproval.approvalHistory?.length > 0 || selectedPreApproval.reviewComments?.length > 0)
                ) {
                  return (
                    <div className="border-b pb-4 mb-4 space-y-4">
                      {/* Document Info */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-sm mb-2">Document Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Document No:</span>{" "}
                            <span className="font-medium">{selectedPreApproval.preApprovalNo}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Amount:</span>{" "}
                            <span className="font-medium">Rs. {selectedPreApproval.totalAmount?.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Requested By:</span>{" "}
                            <span className="font-medium">{selectedPreApproval.requestedBy}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Wing:</span>{" "}
                            <span className="font-medium">{selectedPreApproval.wing}</span>
                          </div>
                        </div>
                      </div>

                      {/* Previous Approver Notes */}
                      {selectedPreApproval.approvalHistory && selectedPreApproval.approvalHistory.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm mb-3">
                            Previous Approver Notes ({selectedPreApproval.approvalHistory.length})
                          </h3>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {selectedPreApproval.approvalHistory.map((history, idx) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-lg border-l-4 ${
                                  history.action === "Approved"
                                    ? "bg-green-50 border-green-500"
                                    : history.action === "Recommended"
                                      ? "bg-blue-50 border-blue-500"
                                      : "bg-green-50 border-green-500"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <Badge
                                      variant="secondary"
                                      className={`mb-2 ${
                                        history.action === "Approved"
                                          ? "bg-green-100 text-green-800 border-green-300"
                                          : history.action === "Recommended"
                                            ? "bg-blue-100 text-blue-800 border-green-300"
                                            : "bg-red-100 text-red-800 border-red-300"
                                      }`}
                                    >
                                      {history.action}
                                    </Badge>
                                    <h4 className="font-semibold text-sm text-gray-900">{history.stageName}</h4>
                                  </div>
                                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {history.approvedAt}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">By: {history.approvedBy}</p>
                                {history.comments && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Notes:</p>
                                    <p className="text-sm text-gray-800">{history.comments}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reviewer Comments */}
                      {selectedPreApproval.reviewComments && selectedPreApproval.reviewComments.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm mb-2">Reviewer Comments</h3>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {selectedPreApproval.reviewComments.map((comment, idx) => (
                              <div key={idx} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                <div className="flex items-start justify-between mb-1">
                                  <span className="font-medium text-sm">{comment.reviewerName}</span>
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                    {comment.reviewType}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 mt-2">"{comment.comment}"</p>
                                <p className="text-xs text-gray-500 mt-1">{comment.date}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              })()}

            <div>
              <Label htmlFor="bulkComments" className="text-base font-semibold mb-2 block">
                Notes / Comments
              </Label>
              <Textarea
                id="bulkComments"
                placeholder="Add your notes or comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>
            <p className="text-sm text-gray-600">
              Selected: <span className="font-semibold">{selectedPreApprovals.length}</span> pre-approval(s) will be{" "}
              {selectedAction.toLowerCase()}.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                setSelectedAction("Recommended")
                handleSubmitBulkAction("Recommended") // Pass action directly
              }}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Recommend
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAction("Send Back")
                handleSubmitBulkAction("Send Back") // Pass "Send Back" directly to avoid state timing issues
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Send Back
            </Button>
            <Button
              onClick={() => {
                setSelectedAction("Rejected")
                handleSubmitBulkAction("Rejected") // Pass action directly
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reviewer Comment Modal Dialog */}
      <Dialog open={selectedReviewerComment !== null} onOpenChange={() => setSelectedReviewerComment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reviewer Comment</DialogTitle>
            <DialogDescription>View the detailed comment from the reviewer</DialogDescription>
          </DialogHeader>
          {selectedReviewerComment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Review Type</Label>
                  <p className="mt-1 text-base font-semibold text-gray-900">{selectedReviewerComment.reviewType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Reviewer</Label>
                  <p className="mt-1 text-base font-semibold text-gray-900">{selectedReviewerComment.reviewerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Stage</Label>
                  <p className="mt-1 text-base text-gray-900">{selectedReviewerComment.stageName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Submitted At</Label>
                  <p className="mt-1 text-base text-gray-900">{selectedReviewerComment.submittedAt}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Comment</Label>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-base text-gray-900 whitespace-pre-wrap">{selectedReviewerComment.comment}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReviewerComment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update modal to show item name in title and use item-specific data */}
      {stockModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {stockType === "current" ? "Current Stock" : "Available Stock"} - {selectedWarehouse}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Asset Management Details {selectedItem && `- ${selectedItem}`}
                </p>
              </div>
              <button
                onClick={() => setStockModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Code
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Asset Name
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Purchase Date
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Planned Life
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Time Used
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Time Remaining
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        End of Life
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Lead Time
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Re-order Date
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Assign To
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Days Until Re-Order
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getStockData(selectedWarehouse, stockType, selectedItem).map((asset, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 text-xs text-blue-600 font-medium">
                          {asset.code}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.assetName}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.purchaseDate}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.plannedLife}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.timeUsed}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.timeRemaining}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.endOfLife}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.leadTime}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.reorderDate}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.assignTo}</td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              asset.status === "Available"
                                ? "bg-green-100 text-green-800"
                                : asset.status === "Active"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">{asset.daysUntilReorder}</td>
                      </tr>
                    ))}
                    {getStockData(selectedWarehouse, stockType, selectedItem).length === 0 && (
                      <tr>
                        <td colSpan={12} className="border border-gray-300 px-3 py-8 text-center text-sm text-gray-500">
                          No stock data available for this warehouse
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setStockModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
