'use client'

import { useActionState, useEffect, useState } from 'react'
import { AlertTriangle, Trash2, Loader2, X, AlertCircle } from 'lucide-react'
import { deleteCustomerAction } from '@/app/actions/agency'
import type { BrandItem } from './CustomersClientView'

interface DeleteCustomerModalProps {
  isOpen: boolean
  brand: BrandItem | null
  onClose: () => void
}

// Markayi ve iliskili musteri hesabini guvenli ve teyitli silme modali
export function DeleteCustomerModal({ isOpen, brand, onClose }: DeleteCustomerModalProps) {
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    if (isOpen) {
      setConfirmText('')
    }
  }, [isOpen])

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await deleteCustomerAction(prevState, formData)
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

  if (!isOpen || !brand) return null

  const isMatched = confirmText.trim().toLowerCase() === brand.name.trim().toLowerCase()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-rose-200/80 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Baslik */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Müşteriyi ve Markayı Sil</h3>
              <p className="text-xs text-slate-500">Bu işlem geri alınamaz</p>
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

        {/* Bilgilendirme Uyarisi */}
        <div className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900 space-y-1.5">
          <p className="font-semibold text-amber-950">
            <span className="font-bold underline">{brand.name}</span> markasını silmek üzeresiniz.
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            <li>Markaya ait tüm aktif ve geçmiş görevler silinir.</li>
            <li>İçerik takvimi ve şablonlar kaldırılır.</li>
            {brand.customer?.email && (
              <li>
                Müşteri giriş hesabı (<span className="font-medium">{brand.customer.email}</span>) kalıcı olarak silinir.
              </li>
            )}
          </ul>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="brand_id" value={brand.id} />
          <input type="hidden" name="auth_user_id" value={brand.customer?.id ?? ''} />

          {/* Onay Metni Girisi */}
          <div>
            <label htmlFor="confirm-brand-name" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Onaylamak için lütfen kutuya <span className="font-black text-rose-600 select-all">{brand.name}</span> yazın:
            </label>
            <input
              id="confirm-brand-name"
              type="text"
              required
              autoComplete="off"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={brand.name}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* Aksiyon Butonlari */}
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
