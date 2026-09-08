import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from './_components/RegisterForm'
import { Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kayıt Ol – SMAUP',
  description: 'Ajansınızı SMAUP platformuna kaydedin.',
}

// Ajans sahibi kayıt sayfası
export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-slate-200/50 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-200/60">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm">
            <Building2 className="h-7 w-7 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Ajansınızı Kaydedin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Ajans sahibi hesabı oluşturun ve platformu yönetmeye başlayın.
          </p>
        </div>

        <RegisterForm />

        <div className="mt-7 flex flex-col items-center gap-3">
          <div className="h-px w-full bg-slate-100" />
          <p className="text-xs text-slate-400">
            Zaten hesabınız var mı?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
            >
              Giriş yapın
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-600"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  )
}
