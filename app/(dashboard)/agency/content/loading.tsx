// Icerik Plani sayfasi yuklenirken gosterilen iskelet animasyon
export default function ContentPlanLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="İçerik planı yükleniyor">
      {/* Baslik ve Butonlar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-7 w-60 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-96 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* KPI Kartlari */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-xs border border-slate-100" />
        ))}
      </div>

      {/* Filtre ve Gorunum Bar */}
      <div className="flex h-14 w-full animate-pulse rounded-2xl bg-white shadow-xs border border-slate-100" />

      {/* 7 Gunluk Matris Iskeleti */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
            <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
            <div className="h-28 w-full animate-pulse rounded-xl bg-white shadow-xs" />
            <div className="h-28 w-full animate-pulse rounded-xl bg-white shadow-xs" />
            <div className="h-9 w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
