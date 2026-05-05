'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { Eye, EyeOff, Mail, Lock, Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'

interface LoginFormProps {
  type: string
  isAgency: boolean
}

export function LoginForm({ isAgency }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Email */}
      <div className="group flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-sm font-semibold text-gray-700">
          E-posta Adresi
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <input
            id="login-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ornek@sirket.com"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Password */}
      <div className="group flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">
          Şifre
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-500"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error message */}
      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          {state.error}
        </div>
      )}

      {/* Submit */}
      <button
        id="login-submit-button"
        type="submit"
        disabled={pending}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Giriş yapılıyor...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            {isAgency ? 'Ajans Paneline Gir' : 'Müşteri Paneline Gir'}
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Giriş yaparak{' '}
        <a href="#" className="text-blue-500 hover:underline">
          Kullanım Koşulları
        </a>
        'nı kabul etmiş olursunuz.
      </p>
    </form>
  )
}
