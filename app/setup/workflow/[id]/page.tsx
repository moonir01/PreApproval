import { Suspense } from "react"
import WorkflowDetailView from "@/components/workflow-detail-view"

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <WorkflowDetailView id={id} />
    </Suspense>
  )
}
