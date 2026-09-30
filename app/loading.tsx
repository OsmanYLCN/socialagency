export default function RootLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 select-none"
      aria-busy="true"
      aria-label="Yükleniyor"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Üstte: Sol alttakiyle birebir aynı font, aynı renk ve harf aralığında SMAUP */}
        <span className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-slate-700 select-none">
          SMAUP
        </span>

        {/* Dümdüz Yükleniyor yazısı */}
        <span className="text-xs sm:text-sm font-medium tracking-[0.15em] text-slate-400 select-none">
          Yükleniyor...
        </span>

        {/* En altta ortada dönen çok şık yuvarlak halka */}
        <div className="relative flex h-8 w-8 items-center justify-center mt-1">
          <svg
            className="h-8 w-8 animate-spin text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2.8"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
