import { Skeleton } from '@/components/ui/Skeleton'

export default function AgencyTasksLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="Görevler yükleniyor">
      {/* Üst Başlık Barı */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            Görevler yükleniyor...
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Metrik Kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Filtre Barı */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs gap-3">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Kanban Sütunları */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="space-y-3 rounded-2xl border border-slate-200/60 bg-slate-100/50 p-3.5">
            <div className="flex items-center justify-between pb-1">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>
            {Array.from({ length: 2 }).map((_, card) => (
              <div key={card} className="space-y-2.5 rounded-xl border border-slate-200/70 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
