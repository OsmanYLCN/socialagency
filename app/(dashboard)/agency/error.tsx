'use client'

import { useEffect } from 'react'

export default function AgencyError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('Agency dashboard rendering failed:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <span className="text-xl font-bold">!</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900">Ajans paneli yüklenemedi</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Ajans verileri alınırken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-6 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  )
}
