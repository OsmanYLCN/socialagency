import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SMAUP – B2B Sosyal Medya Ajans Yönetim Platformu',
  description: 'B2B Sosyal Medya Ajans Yönetim Platformu.',
}

// Kullanıcıyı uygun panele yönlendirir
export default function HomePage() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden md:flex-row select-none">
      <section className="group/agency relative flex h-1/2 w-full flex-col items-center justify-center overflow-hidden bg-blue-600 px-8 md:h-full md:w-1/2 md:px-14 lg:px-20 transition-all duration-500 cursor-pointer">
        <Link
          href="/login"
          className="absolute inset-0 z-0"
          aria-label="Ajans Girişi"
          tabIndex={-1}
        />

        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-400/25 blur-3xl transition-all duration-500 group-hover/agency:scale-110" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-900/40 blur-3xl transition-all duration-500 group-hover/agency:scale-110" />

        <div className="pointer-events-none absolute left-8 top-8 hidden md:block z-10">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-blue-200/80 uppercase">
            SMAUP // AGENCY
          </span>
        </div>

        <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center pointer-events-none">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight transition-transform duration-300 group-hover/agency:scale-[1.02]">
            AJANS
            <span className="block font-light text-blue-200">GİRİŞİ</span>
          </h1>

          <div className="mt-10 flex items-center justify-center gap-8 pointer-events-auto">
            <Link
              id="agency-login-link"
              href="/login"
              className="group/link inline-flex items-center gap-2 text-base sm:text-lg font-semibold text-white transition-colors hover:text-blue-100"
            >
              <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover/link:after:w-full">
                Giriş Yap
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
            </Link>

            <span className="h-4 w-px bg-white/30" />

            <Link
              id="agency-register-link"
              href="/register"
              className="group/link inline-flex items-center gap-2 text-sm sm:text-base font-medium text-blue-200 transition-colors hover:text-white"
            >
              <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-200 after:transition-all after:duration-300 group-hover/link:after:w-full">
                Kayıt Ol
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-75 transition-transform duration-300 group-hover/link:translate-x-1.5 group-hover:opacity-100" />
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-60 z-10">
          <span className="h-0.5 w-7 rounded-full bg-white/70" />
          <span className="h-0.5 w-3.5 rounded-full bg-white/40" />
          <span className="h-0.5 w-1.5 rounded-full bg-white/25" />
        </div>
      </section>

      <div className="relative hidden w-px bg-slate-200 md:flex md:items-center md:justify-center">
        <div className="h-16 w-px bg-slate-300" />
      </div>

      <Link
        id="customer-portal-link"
        href="/login"
        className="group/client relative flex h-1/2 w-full flex-col items-center justify-center overflow-hidden bg-white px-8 md:h-full md:w-1/2 md:px-14 lg:px-20 transition-colors duration-500 hover:bg-slate-50/60 cursor-pointer"
      >
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-50/80 blur-3xl transition-all duration-500 group-hover/client:scale-110" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-slate-100/80 blur-3xl" />

        <div className="absolute right-8 top-8 hidden md:block">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
            SMAUP // CLIENT
          </span>
        </div>

        <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-tight transition-transform duration-300 group-hover/client:scale-[1.02]">
            MÜŞTERİ
            <span className="block font-light text-blue-600">& ÇALIŞAN</span>
          </h2>

          <div className="group/link mt-10 inline-flex items-center gap-2 text-base sm:text-lg font-semibold text-slate-900 transition-colors hover:text-blue-600">
            <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover/link:after:w-full">
              Giriş Yap
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover/link:translate-x-1.5 group-hover/link:text-blue-600" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-60">
          <span className="h-0.5 w-1.5 rounded-full bg-slate-300" />
          <span className="h-0.5 w-3.5 rounded-full bg-slate-300" />
          <span className="h-0.5 w-7 rounded-full bg-blue-500" />
        </div>
      </Link>
    </main>
  )
}
