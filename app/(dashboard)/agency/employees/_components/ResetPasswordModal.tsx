'use client'

import { useActionState, useEffect, useState, useCallback } from 'react'
import {
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  Loader2,
  X,
  AlertCircle,
  KeyRound,
} from 'lucide-react'
import { resetEmployeePasswordAction } from '@/app/actions/agency'
import type { EmployeeItem } from './EmployeesClientView'

interface ResetPasswordModalProps {
  isOpen: boolean
  employee: EmployeeItem | null
  onClose: () => void
}

// Kriptografik olarak guvenli rastgele sifre uretir
function generateSecurePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghjkmnpqrstuvwxyz'
  const digits = '23456789'
  const special = '!@#%&*'
  const all = upper + lower + digits + special

  const pick = (set: string) => set[Math.floor(Math.random() * set.length)]
  const base = [pick(upper), pick(lower), pick(digits), pick(special)]
  for (let i = 0; i < 8; i++) base.push(pick(all))

  for (let i = base.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[base[i], base[j]] = [base[j], base[i]]
  }
  return base.join('')
}

// Calisan sifresi sifirlama modali
export function ResetPasswordModal({ isOpen, employee, onClose }: ResetPasswordModalProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await resetEmployeePasswordAction(prevState, formData)
      if (result.success) {
        onClose()
      }
      return result
    },
    null
  )

  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setShowPassword(false)
      setCopied(false)
    }
  }, [isOpen])

  const handleGenerate = useCallback(() => {
    setPassword(generateSecurePassword())
    setCopied(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (!password) return
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [password])

  if (!isOpen || !employee) return null

  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Baslik */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Şifre Sıfırla</h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                {fullName || employee.email} için yeni şifre tanımlayın
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hata bildirimi */}
        {state?.error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Bilgi notu */}
        <div className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900">
          <p>
            Yeni şifre tanımladıktan sonra çalışanı bilgilendirmeniz gerekir. Şifreyi kopyalamayı unutmayın.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="employee_id" value={employee.id} />

          {/* Yeni Şifre */}
          <div>
            <label htmlFor="rp-password" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Yeni Şifre <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="rp-password"
                  name="new_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                title="Güvenli şifre üret"
                className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Üret
              </button>

              {password && (
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Şifreyi kopyala"
                  className={`flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold cursor-pointer transition-all ${
                    copied
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : null}
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </button>
              )}
            </div>
          </div>

          {/* Aksiyon butonlari */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-amber-500/20 transition-all hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Sıfırlanıyor...
                </>
              ) : (
                <>
                  <KeyRound className="h-3.5 w-3.5" />
                  Şifreyi Sıfırla
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
