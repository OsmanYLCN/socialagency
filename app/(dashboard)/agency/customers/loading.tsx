import { Skeleton } from '@/components/ui/Skeleton'

export default function CustomersLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="Müşteriler yükleniyor">
      {/* Üst Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            Müşteriler yükleniyor...
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Arama Barı */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
        <Skeleton className="h-9 w-72 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Müşteri Kartları Listesi */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <Skeleton className="h-7 w-20 rounded-lg" />
              <Skeleton className="h-7 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
