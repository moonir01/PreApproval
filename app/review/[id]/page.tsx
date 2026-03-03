import { Suspense } from "react"
import ReviewDetailWrapper from "./review-detail-wrapper"

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading document details...</p>
        </div>
      }
    >
      <ReviewDetailWrapper id={id} />
    </Suspense>
  )
}
