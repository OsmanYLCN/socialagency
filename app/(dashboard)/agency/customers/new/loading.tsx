export default function NewCustomerLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12 animate-pulse">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-7 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-200" />
        </div>
        <div className="h-10 w-44 rounded-xl bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-white shadow-xs p-6 space-y-4">
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-xl bg-slate-100" />
            <div className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
