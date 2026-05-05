import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ajans Sistemi – B2B Sosyal Medya Ajans Yönetim Platformu',
  description:
    'Ajanslar ve müşteriler için güçlü, modern bir yönetim platformu. Projeleri yönetin, içerik planlarını takip edin.',
}

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* ─────────────────── SOL TARAF – AJANS ─────────────────── */}
      <section className="relative flex w-1/2 flex-col items-center justify-center overflow-hidden bg-blue-600 px-12">
        {/* Dekoratif arka plan daireleri */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-800/50 blur-3xl" />

        {/* İçerik */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* Rozet */}
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-blue-500/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-100 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-200" />
            Ajans Portalı
          </span>

          {/* Başlık */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
            AJANS
            <br />
            <span className="text-blue-200">GİRİŞİ</span>
          </h1>

          {/* Açıklama */}
          <p className="max-w-xs text-base leading-relaxed text-blue-100">
            Müşterilerini yönet, günlük görevlerini planla ve profesyonel hizmetini sergile.
          </p>

          {/* CTA Butonu */}
          <Link
            id="agency-cta-button"
            href="/login?type=agency"
            className="group mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-600 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/40"
          >
            Ajans Olarak Başla
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Alt dekoratif çizgi */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          <span className="h-1 w-8 rounded-full bg-blue-300/60" />
          <span className="h-1 w-4 rounded-full bg-blue-300/30" />
          <span className="h-1 w-2 rounded-full bg-blue-300/20" />
        </div>
      </section>

      {/* Dikey ayırıcı – ortada ince çizgi */}
      <div className="relative flex w-px flex-col items-center justify-center bg-gray-200">
        <div className="absolute z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-lg">
          <span className="text-xs font-bold text-gray-400">VS</span>
        </div>
      </div>

      {/* ─────────────────── SAĞ TARAF – MÜŞTERİ ─────────────────── */}
      <section className="relative flex w-1/2 flex-col items-center justify-center overflow-hidden bg-white px-12">
        {/* Dekoratif arka plan daireleri */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

        {/* İçerik */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* Rozet */}
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            Müşteri Portalı
          </span>

          {/* Başlık */}
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-blue-600">
            MÜŞTERİ
            <br />
            <span className="text-blue-800">GİRİŞİ</span>
          </h2>

          {/* Açıklama */}
          <p className="max-w-xs text-base leading-relaxed text-gray-600">
            En iyi ajansları keşfet, projelerini takip et ve işlerini anlık onaylayarak hızlandır.
          </p>

          {/* CTA Butonu */}
          <Link
            id="customer-cta-button"
            href="/login?type=customer"
            className="group mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Müşteri Olarak Başla
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Alt dekoratif çizgi */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          <span className="h-1 w-2 rounded-full bg-gray-200" />
          <span className="h-1 w-4 rounded-full bg-gray-200" />
          <span className="h-1 w-8 rounded-full bg-blue-200" />
        </div>
      </section>
    </main>
  )
}
