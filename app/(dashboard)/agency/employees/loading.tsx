// Çalışanlar sayfası yüklenirken gösterilen iskelet animasyon
export default function EmployeesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="Çalışanlar yükleniyor">
      {/* Başlık iskelet */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-200" />
      </div>

      {/* Metrik kartları iskeleti */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-xs" />
        ))}
      </div>

      {/* Arama + sıralama iskeleti */}
      <div className="h-10 w-full animate-pulse rounded-xl bg-white shadow-xs" />

      {/* Kart listesi iskeleti */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-white shadow-xs" />
        ))}
      </div>
    </div>
  )
}
