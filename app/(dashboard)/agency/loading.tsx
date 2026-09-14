export default function AgencyLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="Ajans paneli yükleniyor">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="hidden h-8 w-32 animate-pulse rounded-xl bg-slate-200 sm:block" />
      </div>
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
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-64 animate-pulse rounded-2xl bg-white shadow-xs" />
      ))}
    </div>
  )
}
