'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { Building2, DollarSign, Mail, Check, Loader2, X, AlertCircle, ShieldAlert, Power } from 'lucide-react'
import { updateCustomerAction, toggleCustomerStatusAction } from '@/app/actions/agency'
import type { BrandItem } from './CustomersClientView'

interface EditCustomerModalProps {
  isOpen: boolean
  brand: BrandItem | null
  onClose: () => void
}

// Musteri markasi ve hesap ayarlarini duzenleme modali
export function EditCustomerModal({ isOpen, brand, onClose }: EditCustomerModalProps) {
  const [name, setName] = useState('')
  const [fee, setFee] = useState('')
  const [isToggling, startTransition] = useTransition()
  const [toggleError, setToggleError] = useState<string | null>(null)

  useEffect(() => {
    if (brand) {
      setName(brand.name)
      setFee(brand.monthlyFee ? String(brand.monthlyFee) : '0')
      setToggleError(null)
    }
  }, [brand])

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateCustomerAction(prevState, formData)
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

  const customer = brand.customer

  const handleToggleStatus = () => {
    if (!customer?.id) return
    setToggleError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('profile_id', customer.id)
      formData.set('is_active', customer.isActive ? 'false' : 'true')
      const res = await toggleCustomerStatusAction(null, formData)
      if (res?.error) {
        setToggleError(res.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Baslik */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Marka ve Müşteri Düzenle</h3>
              <p className="text-xs text-slate-500">Mevcut sözleşme ve marka detaylarını güncelleyin</p>
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

        {/* Hata bildirimleri */}
        {state?.error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {toggleError && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{toggleError}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="brand_id" value={brand.id} />

          {/* Marka Adi */}
          <div>
            <label htmlFor="edit-brand-name" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Marka Adı <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="edit-brand-name"
                name="brand_name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marka adını girin"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Aylık Ucret */}
          <div>
            <label htmlFor="edit-fee" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Aylık Hizmet Bedeli (₺)
            </label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="edit-fee"
                name="monthly_fee"
                type="number"
                min="0"
                step="1"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Musteri Hesap Bilgisi & Durumu */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700">Müşteri Portalı Hesabı</p>
                {customer?.email ? (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-slate-400">Bu markaya henüz giriş hesabı atanmamış.</p>
                )}
              </div>

              {customer && (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      customer.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {customer.isActive ? 'Aktif' : 'Askıda'}
                  </span>
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={handleToggleStatus}
                    title={customer.isActive ? 'Hesabı askıya al' : 'Hesabı aktifleştir'}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isToggling ? (
                      <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
                    ) : (
                      <Power className={`h-3 w-3 ${customer.isActive ? 'text-amber-500' : 'text-emerald-500'}`} />
                    )}
                    <span>{customer.isActive ? 'Askıya Al' : 'Aktifleştir'}</span>
                  </button>
                </div>
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
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
