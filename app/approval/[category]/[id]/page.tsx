import { Suspense } from "react"
import ApprovalDetailWrapper from "./approval-detail-wrapper"

export default async function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  const { category, id } = await params

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading document details...</p>
        </div>
      }
    >
      <ApprovalDetailWrapper category={category} id={id} />
    </Suspense>
  )
}
