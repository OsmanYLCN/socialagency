'use client'

import { useActionState, useState } from 'react'
import { registerAction } from '@/app/actions/auth'
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Ajans Adı */}
      <div className="group flex flex-col gap-1.5">
        <label htmlFor="reg-agency-name" className="text-sm font-semibold text-slate-700">
          Ajans Adı
        </label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
          <input
            id="reg-agency-name"
            name="agency_name"
            type="text"
            required
            autoComplete="organization"
            placeholder="Örnek Medya Ajansı"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
          />
        </div>
      </div>

      {/* Ad Soyad */}
      <div className="group flex flex-col gap-1.5">
        <label htmlFor="reg-full-name" className="text-sm font-semibold text-slate-700">
          Ad Soyad
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
          <input
            id="reg-full-name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ahmet Yılmaz"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
          />
        </div>
      </div>

      {/* E-posta */}
      <div className="group flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-sm font-semibold text-slate-700">
          E-posta Adresi
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
          <input
            id="reg-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ahmet@ajans.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
          />
        </div>
      </div>

      {/* Şifre */}
      <div className="group flex flex-col gap-1.5">
        <label htmlFor="reg-password" className="text-sm font-semibold text-slate-700">
          Şifre
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
          <input
            id="reg-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="En az 6 karakter"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-indigo-500"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Hata mesajı */}
      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      {/* Submit */}
      <button
        id="register-submit-button"
        type="submit"
        disabled={pending}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Kayıt oluşturuluyor...
          </>
        ) : (
          <>
            Ajans Olarak Kayıt Ol
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}
