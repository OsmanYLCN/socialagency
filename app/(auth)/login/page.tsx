import type { Metadata } from 'next'
import { LoginForm } from './_components/LoginForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Giriş Yap – Ajans Sistemi',
  description: 'Ajans veya müşteri hesabınızla giriş yapın.',
}

interface LoginPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { type } = await searchParams
  const isAgency = type !== 'customer'

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isAgency
            ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900'
            : 'bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100'
        }`}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full blur-3xl ${
            isAgency ? 'bg-blue-400/20' : 'bg-blue-200/40'
          }`}
        />
        <div
          className={`absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full blur-3xl ${
            isAgency ? 'bg-blue-900/30' : 'bg-blue-300/30'
          }`}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 p-10 shadow-2xl shadow-black/10 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Logo / Icon */}
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${
              isAgency ? 'bg-blue-600' : 'bg-blue-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-500">
            {isAgency ? 'Ajans Portalı' : 'Müşteri Portalı'}
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900">Hesabınıza Giriş Yapın</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isAgency
              ? 'Ajans paneline erişmek için bilgilerinizi girin.'
              : 'Müşteri paneline erişmek için bilgilerinizi girin.'}
          </p>
        </div>

        {/* Login Form Client Component */}
        <LoginForm type={type ?? 'agency'} isAgency={isAgency} />

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  )
}