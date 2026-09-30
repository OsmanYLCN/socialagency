import { Skeleton } from '@/components/ui/Skeleton'

export default function ContentPlanLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="İçerik planı yükleniyor">
      {/* Başlık ve Butonlar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-60" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            İçerik planı yükleniyor...
          </div>
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Filtre ve Navigasyon Çubuğu */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* 7 Günlük Takvim Matrisi İskeleti */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/50">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            {Array.from({ length: 2 }).map((_, card) => (
              <div key={card} className="space-y-2 rounded-xl border border-slate-200/70 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-12 rounded-full" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
            <Skeleton className="mt-auto h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
