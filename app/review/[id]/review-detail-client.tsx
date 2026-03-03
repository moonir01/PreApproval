"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ApprovalPreApproval } from "@/lib/demo-data"

interface ReviewDetailClientProps {
  preApproval: ApprovalPreApproval
}

const numberToWords = (num: number): string => {
  if (num === 0) return "zero"

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ]

  const convertHundreds = (n: number): string => {
    if (n === 0) return ""
    if (n < 10) return ones[n]
    if (n < 20) return teens[n - 10]
    if (n < 100) {
      const ten = Math.floor(n / 10)
      const one = n % 10
      return tens[ten] + (one > 0 ? " " + ones[one] : "")
    }
    const hundred = Math.floor(n / 100)
    const rest = n % 100
    return ones[hundred] + " hundred" + (rest > 0 ? " " + convertHundreds(rest) : "")
  }

  if (num < 1000) return convertHundreds(num)

  const thousand = Math.floor(num / 1000)
  const rest = num % 1000

  if (num < 100000) {
    return convertHundreds(thousand) + " thousand" + (rest > 0 ? " " + convertHundreds(rest) : "")
  }

  const lakh = Math.floor(num / 100000)
  const thousandPart = Math.floor((num % 100000) / 1000)
  const hundredPart = num % 1000

  let result = convertHundreds(lakh) + " lakh"
  if (thousandPart > 0) result += " " + convertHundreds(thousandPart) + " thousand"
  if (hundredPart > 0) result += " " + convertHundreds(hundredPart)

  return result
}

export function ReviewDetailClient({ preApproval }: ReviewDetailClientProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { addReviewerComment } = useData()
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [accountNo, setAccountNo] = useState("")
  const [accountBalance, setAccountBalance] = useState("")
  const [accountBalanceText, setAccountBalanceText] = useState("")

  // Get reviewer comments for this document
  const reviewerComments = preApproval.reviewComments || []

  // Check if current user is a reviewer for this document
  const isReviewer =
    user && (preApproval.pendingReviews || []).some((review) => review.reviewerId === user.employeeCode)

  // Get the user's pending review to auto-detect review type
  const userReview = user
    ? (preApproval.pendingReviews || []).find((review) => review.reviewerId === user.employeeCode)
    : null

  const requiresAccountFields = userReview?.reviewType === "Account" || userReview?.reviewType === "Central Accounts"

  const handleAccountBalanceChange = (value: string) => {
    setAccountBalance(value)
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      const words = numberToWords(Math.floor(numValue))
      setAccountBalanceText(words)
    } else {
      setAccountBalanceText("")
    }
  }

  const handleAddComment = () => {
    if (!user || !commentText.trim() || !userReview) return

    if (requiresAccountFields && (!accountNo || !accountBalance)) {
      alert("Please fill in Account No and Account Balance")
      return
    }

    console.log("[v0] Submitting comment for document:", preApproval.preApprovalNo)
    console.log("[v0] Review type:", userReview.reviewType)
    console.log("[v0] Comment:", commentText)

    let fullComment = commentText
    if (requiresAccountFields) {
      fullComment += `\n\nAccount No: ${accountNo}\nAccount Balance: ${accountBalance} (${accountBalanceText})`
    }

    addReviewerComment(preApproval.id, userReview.reviewType, fullComment)

    setCommentText("")
    setAccountNo("")
    setAccountBalance("")
    setAccountBalanceText("")
    setIsCommentDialogOpen(false)

    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Review Document</h1>
              <p className="text-muted-foreground">Document ID: {preApproval.preApprovalNo}</p>
            </div>
          </div>
          {isReviewer && userReview && (
            <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Review Comment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Review Type</Label>
                    <div>
                      {userReview.reviewType === "Account" && <Badge className="bg-blue-500">Account Review</Badge>}
                      {userReview.reviewType === "Maintenance" && (
                        <Badge className="bg-orange-500">Maintenance Review</Badge>
                      )}
                      {userReview.reviewType === "Central Accounts" && (
                        <Badge className="bg-green-500">Central Accounts Review</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Document</Label>
                    <p className="text-sm text-muted-foreground">{preApproval.preApprovalNo}</p>
                  </div>

                  {requiresAccountFields && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="accountNo">Account No</Label>
                        <Select value={accountNo} onValueChange={setAccountNo}>
                          <SelectTrigger id="accountNo">
                            <SelectValue placeholder="Select account number" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACC-001-2025">ACC-001-2025</SelectItem>
                            <SelectItem value="ACC-002-2025">ACC-002-2025</SelectItem>
                            <SelectItem value="ACC-003-2025">ACC-003-2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountBalance">Account Balance</Label>
                        <Input
                          id="accountBalance"
                          type="number"
                          min="0"
                          step="0.01"
                          value={accountBalance}
                          onChange={(e) => handleAccountBalanceChange(e.target.value)}
                          placeholder="Enter account balance"
                        />
                        {accountBalanceText && (
                          <p className="text-sm text-muted-foreground italic">In words: {accountBalanceText}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Comment</Label>
                    <Textarea
                      id="comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Enter your review comment..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                      Submit Comment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Reviewer Comments Section */}
        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Reviewer Comments ({reviewerComments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewerComments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No comments yet</p>
            ) : (
              reviewerComments.map((comment, index) => (
                <div key={index} className="bg-background p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {comment.reviewType === "Account" && <Badge className="bg-blue-500">Account Review</Badge>}
                      {comment.reviewType === "Maintenance" && (
                        <Badge className="bg-orange-500">Maintenance Review</Badge>
                      )}
                      {comment.reviewType === "Central Accounts" && (
                        <Badge className="bg-green-500">Central Accounts Review</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="font-medium">{comment.reviewerName}</p>
                  <p className="text-sm whitespace-pre-line">{comment.comment}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Document Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Pre-Approval No</p>
                <p className="font-semibold">{preApproval.preApprovalNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Request Date</p>
                <p className="font-semibold">{preApproval.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requested By</p>
                <p className="font-semibold">{preApproval.requestedBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{preApproval.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wing / Office</p>
                <p className="font-semibold">{preApproval.wing}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warehouse</p>
                <p className="font-semibold">{preApproval.warehouse}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-blue-600">{preApproval.totalAmount?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
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
                  </tr>
                </thead>
                <tbody>
                  {preApproval.itemDetails?.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.code}</td>
                      <td className="p-3">{item.item}</td>
                      <td className="p-3">{item.uom}</td>
                      <td className="p-3">{item.lastPrice?.toFixed(2)}</td>
                      <td className="p-3">{item.stock}</td>
                      <td className="p-3">{item.reqQty}</td>
                      <td className="p-3">{item.rate?.toFixed(2)}</td>
                      <td className="p-3 font-semibold">{item.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t p-4 flex justify-between items-center bg-muted/20">
                <span className="font-semibold">Grand Total:</span>
                <span className="text-xl font-bold text-blue-600">{preApproval.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
