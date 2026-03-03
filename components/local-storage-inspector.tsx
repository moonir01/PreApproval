"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LocalStorageInspector() {
  const [data, setData] = useState<any>(null)

  const inspectStorage = () => {
    const storageData = localStorage.getItem("approvalPreApprovals")
    if (storageData) {
      const parsed = JSON.parse(storageData)
      // Find PA-2025-560 specifically
      const target = parsed.find((item: any) => item.id === "PA-2025-560")
      setData({
        allCount: parsed.length,
        targetDocument: target || "Not found",
        allDocuments: parsed.map((item: any) => ({
          id: item.id,
          preApprovalNo: item.preApprovalNo,
          reviewCommentsCount: item.reviewComments?.length || 0,
          pendingReviewsCount: item.pendingReviews?.length || 0,
        })),
      })
    } else {
      setData({ error: "No data in localStorage" })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={inspectStorage}>
          Inspect localStorage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>localStorage Inspector</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px]">
          <pre className="text-xs bg-muted p-4 rounded-lg">{JSON.stringify(data, null, 2)}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
