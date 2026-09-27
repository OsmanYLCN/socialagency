export default function AgencyTasksLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 animate-pulse">
      {/* Üst Başlık Barı İskeleti */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-100" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
          <div className="h-10 w-36 rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* Metrik Kartları İskeleti */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-6 w-16 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Filtre Barı İskeleti */}
      <div className="h-14 rounded-2xl border border-slate-200/80 bg-white p-3" />

      {/* Kanban Sütunları İskeleti */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="space-y-3 rounded-2xl bg-slate-100/70 p-3">
            <div className="h-8 rounded-xl bg-slate-200" />
            <div className="h-32 rounded-xl bg-white shadow-xs" />
            <div className="h-32 rounded-xl bg-white shadow-xs" />
          </div>
        ))}
      </div>
    </div>
  )
}
