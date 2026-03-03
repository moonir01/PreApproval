export default function Loading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((card) => (
              <div key={card} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
