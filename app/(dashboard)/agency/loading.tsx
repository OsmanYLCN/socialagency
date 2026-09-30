import { Skeleton } from '@/components/ui/Skeleton'

export default function AgencyLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="Ajans paneli yükleniyor">
      {/* Üst Başlık & Yükleniyor Rozeti */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          Ajans paneli yükleniyor...
        </div>
      </div>

      {/* KPI İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Hızlı İşlemler & İlerleme */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Son Aktiviteler Tablosu */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
