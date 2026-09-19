// Musteriler sayfasi yuklenirken gosterilen iskelet animasyon
export default function CustomersLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12" aria-busy="true" aria-label="Müşteriler yükleniyor">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-7 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-80 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-xs" />
        ))}
      </div>
      <div className="h-12 w-full animate-pulse rounded-xl bg-white shadow-xs" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-white shadow-xs" />
        ))}
      </div>
    </div>
  )
}
