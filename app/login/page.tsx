import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './_components/LoginForm'
import { ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Giriş Yap – SMAUP',
  description: 'SMAUP platformuna giriş yapın.',
}

// Ortak kullanıcı giriş ekranını gösterir
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-[#0e1015]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-3xl dark:bg-indigo-950/20" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-slate-200/50 blur-3xl dark:bg-[#1a1d25]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-200/60 dark:border-[#272b37] dark:bg-[#16181f] dark:shadow-none">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm dark:border-indigo-950/50 dark:bg-indigo-950/40">
            <ShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Hesabınıza Giriş Yapın
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            E-posta ve şifrenizle platforma erişebilirsiniz.
          </p>
        </div>

        <LoginForm />

        <div className="mt-7 flex flex-col items-center gap-3">
          <div className="h-px w-full bg-slate-100 dark:bg-[#272b37]" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Ajans sahibi misiniz?{' '}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Kayıt olun
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  )
}