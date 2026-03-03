export default function Loading() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="bg-white rounded-lg border border-black/10 p-6">
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
