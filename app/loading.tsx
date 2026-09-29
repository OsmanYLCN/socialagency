export default function RootLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 select-none"
      aria-busy="true"
      aria-label="SMAUP yükleniyor"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Logo and Animated Ring */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          {/* Subtle Outer Pulse */}
          <div className="absolute inset-0 rounded-2xl bg-indigo-500/15 animate-ping opacity-60" />

          {/* Rotating Spinner Ring */}
          <div className="absolute inset-[-4px] rounded-2xl border-2 border-indigo-600/20 border-t-indigo-600 animate-spin" />

          {/* Logo Box */}
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-md shadow-slate-900/10">
            <svg
              className="h-7 w-7 text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-8 4.5v9L12 21l8-4.5v-9L12 3Z" />
              <path d="M12 12 4 7.5" />
              <path d="m12 12 8-4.5" />
              <path d="M12 12v9" />
            </svg>
          </div>
        </div>

        {/* Brand Text & Status */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <span className="text-sm font-black tracking-[0.25em] text-slate-800">
            SMAUP
          </span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-medium text-slate-400 tracking-wide">
              Sistem hazırlanıyor...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
