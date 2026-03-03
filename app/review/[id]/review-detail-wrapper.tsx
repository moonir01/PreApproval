"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { ReviewDetailClient } from "./review-detail-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ReviewDetailWrapper({ id }: { id: string }) {
  const { approvalPreApprovals } = useData()
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (approvalPreApprovals.length > 0) {
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [approvalPreApprovals])

  if (!isReady || approvalPreApprovals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading document details...</p>
      </div>
    )
  }

  const preApproval = approvalPreApprovals.find((approval) => approval.preApprovalNo === id)

  if (!preApproval) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">Document not found: {id}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  return <ReviewDetailClient preApproval={preApproval} />
}
