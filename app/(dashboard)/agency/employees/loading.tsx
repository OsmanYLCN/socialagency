import { Skeleton } from '@/components/ui/Skeleton'

export default function EmployeesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="Çalışanlar yükleniyor">
      {/* Üst Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            Çalışanlar yükleniyor...
          </div>
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>

      {/* Metrik Kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Arama ve Filtre */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Çalışan Kartları */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
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
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
