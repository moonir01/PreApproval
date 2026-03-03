import { Skeleton } from "@/components/ui/skeleton"

export default function ApprovalDetailLoading() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Workflow Progress Skeleton */}
      <Skeleton className="h-24 w-full rounded-lg mb-6" />

      {/* Pre-Approval Info Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg mb-6" />

      {/* Table Skeleton */}
      <Skeleton className="h-96 w-full rounded-lg mb-6" />

      {/* Budget Summary Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  )
}
