"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Search, FileText, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

type TabType = "pending" | "completed"

export function ReviewPageClient() {
  const { user } = useAuth()
  const { approvalPreApprovals } = useData()
  const [statusTab, setStatusTab] = useState<TabType>("pending")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter documents assigned to current user for review
  const reviewDocuments = useMemo(() => {
    if (!user) {
      console.log("[v0] No user logged in")
      return []
    }

    console.log("[v0] Filtering review documents for user:", user.employeeCode)
    console.log("[v0] Total pre-approvals:", approvalPreApprovals.length)

    const filtered = approvalPreApprovals.filter((doc) => {
      // Initialize fields if they don't exist
      const pendingReviews = doc.pendingReviews || []
      const reviewComments = doc.reviewComments || []

      console.log("[v0] Document:", doc.preApprovalNo, {
        pendingReviewsCount: pendingReviews.length,
        reviewCommentsCount: reviewComments.length,
        pendingReviews: pendingReviews,
        reviewComments: reviewComments,
      })

      const hasPendingReview = pendingReviews.some((review) => review.reviewerId === user.employeeCode)
      const hasCompletedReview = reviewComments.some((comment) => comment.reviewerId === user.employeeCode)

      console.log("[v0] Match result:", {
        hasPendingReview,
        hasCompletedReview,
        matchesTab: statusTab === "pending" ? hasPendingReview : hasCompletedReview,
      })

      if (statusTab === "pending") {
        return hasPendingReview
      } else {
        return hasCompletedReview
      }
    })

    console.log("[v0] Filtered documents count:", filtered.length)
    console.log(
      "[v0] Filtered document IDs:",
      filtered.map((d) => d.preApprovalNo),
    )

    // Apply search filter
    if (searchQuery.trim()) {
      return filtered.filter(
        (doc) =>
          doc.preApprovalNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.wing?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.requestedBy?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [approvalPreApprovals, user, statusTab, searchQuery])

  const pendingCount = useMemo(() => {
    if (!user) return 0
    return approvalPreApprovals.filter((doc) =>
      (doc.pendingReviews || []).some((review) => review.reviewerId === user.employeeCode),
    ).length
  }, [approvalPreApprovals, user])

  const completedCount = useMemo(() => {
    if (!user) return 0
    return approvalPreApprovals.filter((doc) =>
      (doc.reviewComments || []).some((comment) => comment.reviewerId === user.employeeCode),
    ).length
  }, [approvalPreApprovals, user])

  // Get review type for a document
  const getReviewType = (doc: any) => {
    if (!user) return ""
    const review = doc.pendingReviews?.find((r: any) => r.reviewerId === user.employeeCode)
    return review?.reviewType || ""
  }

  const getReviewTypeBadge = (reviewType: string) => {
    switch (reviewType) {
      case "Account":
        return <Badge className="bg-blue-500">Account Review</Badge>
      case "Maintenance":
        return <Badge className="bg-orange-500">Maintenance Review</Badge>
      case "Central Accounts":
        return <Badge className="bg-green-500">Central Accounts Review</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Queue</h1>
          <p className="text-muted-foreground">Documents assigned to you for review</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Reviews submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount + completedCount}</div>
            <p className="text-xs text-muted-foreground">All review documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Pre-Approval No, Wing, or Requested By..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setStatusTab("pending")}
          className={`px-4 py-2 font-medium transition-colors ${
            statusTab === "pending"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setStatusTab("completed")}
          className={`px-4 py-2 font-medium transition-colors ${
            statusTab === "completed"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Documents Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">PRE-APPROVAL NO</th>
                <th className="text-left p-4 font-medium">WING</th>
                <th className="text-left p-4 font-medium">REQUESTED BY</th>
                <th className="text-left p-4 font-medium">DATE</th>
                <th className="text-left p-4 font-medium">ITEMS</th>
                <th className="text-left p-4 font-medium">TOTAL AMOUNT</th>
                <th className="text-left p-4 font-medium">REVIEW TYPE</th>
                <th className="text-left p-4 font-medium">CURRENT STAGE</th>
                <th className="text-left p-4 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {reviewDocuments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-muted-foreground">
                    {statusTab === "pending" ? "No documents pending your review." : "No completed reviews found."}
                  </td>
                </tr>
              ) : (
                reviewDocuments.map((doc) => (
                  <tr key={doc.id} className="border-t hover:bg-muted/30">
                    <td className="p-4 font-medium">{doc.preApprovalNo}</td>
                    <td className="p-4">{doc.wing}</td>
                    <td className="p-4">{doc.requestedBy}</td>
                    <td className="p-4">{doc.date}</td>
                    <td className="p-4">{doc.items}</td>
                    <td className="p-4">{doc.totalAmount?.toLocaleString()}</td>
                    <td className="p-4">{getReviewTypeBadge(getReviewType(doc))}</td>
                    <td className="p-4">
                      <Badge variant="outline">{doc.currentStage?.name || `Stage ${doc.currentStage}`}</Badge>
                    </td>
                    <td className="p-4">
                      <Link href={`/review/${doc.preApprovalNo}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
