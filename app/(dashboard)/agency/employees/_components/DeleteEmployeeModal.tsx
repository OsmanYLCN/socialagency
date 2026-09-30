'use client'

import { useActionState, useEffect, useState } from 'react'
import { AlertTriangle, Trash2, Loader2, X, AlertCircle } from 'lucide-react'
import { deleteEmployeeAction } from '@/app/actions/agency'
import type { EmployeeItem } from './EmployeesClientView'

interface DeleteEmployeeModalProps {
  isOpen: boolean
  employee: EmployeeItem | null
  onClose: () => void
}

// Calisani ve hesabini guvenli sekilde silme modali; gorev koruma bilgisi sunar
export function DeleteEmployeeModal({ isOpen, employee, onClose }: DeleteEmployeeModalProps) {
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    if (isOpen) {
      setConfirmText('')
    }
  }, [isOpen])

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await deleteEmployeeAction(prevState, formData)
      if (result.success) {
        onClose()
      }
      return result
    },
    null
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !employee) return null

  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || employee.email
  const isMatched =
    confirmText.trim().toLocaleLowerCase('tr-TR') === fullName.trim().toLocaleLowerCase('tr-TR')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-rose-200/80 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:border-[#272b37] dark:bg-[#16181f]">
        {/* Baslik */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Çalışanı Sil</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Bu işlem geri alınamaz</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition-colors dark:hover:bg-[#222632] dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hata bildirimi */}
        {state?.error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Bilgilendirme Uyarisi */}
        <div className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900 space-y-1.5 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <p className="font-semibold text-amber-950 dark:text-amber-200">
            <span className="font-bold underline">{fullName}</span> adlı çalışanı silmek üzeresiniz.
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300">
            <li>Çalışanın giriş hesabı kalıcı olarak silinir.</li>
            <li>
              Üzerindeki tüm aktif ve bekleyen görevler{' '}
              <span className="font-semibold">atanmamış iş havuzuna</span> iade edilir; görevler silinmez.
            </li>
            {employee.activeTaskCount > 0 && (
              <li className="font-semibold text-amber-950 dark:text-amber-100">
                Bu çalışanın {employee.activeTaskCount} aktif görevi iş havuzuna düşecek.
              </li>
            )}
          </ul>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="employee_id" value={employee.id} />

          {/* Onay Metni Girisi */}
          <div>
            <label htmlFor="confirm-employee-name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Onaylamak için{' '}
              <span className="font-black text-rose-600 dark:text-rose-400 select-all">{fullName}</span>{' '}
              yazın:
            </label>
            <input
              id="confirm-employee-name"
              type="text"
              required
              autoComplete="off"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={fullName}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-rose-500"
            />
          </div>

          {/* Aksiyon Butonlari */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-[#272b37]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors dark:text-slate-300 dark:hover:bg-[#222632]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!isMatched || isPending}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-rose-500/20 transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  Kalıcı Olarak Sil
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
