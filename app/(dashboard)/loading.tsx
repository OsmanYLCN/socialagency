export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Panel yükleniyor">
      <div className="h-8 w-72 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-white shadow-xs" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-2xl bg-white shadow-xs" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-white shadow-xs" />
    </div>
  )
}
