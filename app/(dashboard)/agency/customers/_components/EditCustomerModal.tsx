'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { Building2, DollarSign, Mail, Check, Loader2, X, AlertCircle, ShieldAlert, Power, User } from 'lucide-react'
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
  const [authorizedName, setAuthorizedName] = useState('')
  const [isToggling, startTransition] = useTransition()
  const [toggleError, setToggleError] = useState<string | null>(null)

  useEffect(() => {
    if (brand) {
      setName(brand.name)
      setFee(brand.monthlyFee ? String(brand.monthlyFee) : '0')
      const contactName = [brand.customer?.firstName, brand.customer?.lastName].filter(Boolean).join(' ')
      setAuthorizedName(contactName)
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:border-[#272b37] dark:bg-[#16181f]">
        {/* Baslik */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Marka ve Müşteri Düzenle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mevcut sözleşme ve marka detaylarını güncelleyin</p>
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

        {/* Hata bildirimleri */}
        {state?.error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {toggleError && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{toggleError}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="brand_id" value={brand.id} />

          {/* Marka Adi */}
          <div>
            <label htmlFor="edit-brand-name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Marka Adı <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="edit-brand-name"
                name="brand_name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marka adını girin"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
              />
            </div>
          </div>

          {/* Yetkili Adı & Soyadı */}
          <div>
            <label htmlFor="edit-authorized-name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Yetkili Adı & Soyadı <span className="text-slate-400 dark:text-slate-500 font-normal">(İsteğe bağlı)</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="edit-authorized-name"
                name="authorized_name"
                type="text"
                value={authorizedName}
                onChange={(e) => setAuthorizedName(e.target.value)}
                placeholder="Örnek: Mehmet Yılmaz"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
              />
            </div>
          </div>

          {/* Aylık Ucret */}
          <div>
            <label htmlFor="edit-fee" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Aylık Hizmet Bedeli (₺)
            </label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="edit-fee"
                name="monthly_fee"
                type="number"
                min="0"
                step="1"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
              />
            </div>
          </div>

          {/* Musteri Hesap Bilgisi & Durumu */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-[#272b37] dark:bg-[#1a1d25]">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Müşteri Portalı Hesabı</p>
                {customer?.email ? (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Bu markaya henüz giriş hesabı atanmamış.</p>
                )}
              </div>

              {customer && (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      customer.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#16181f] dark:text-slate-400 dark:border-[#272b37]'
                    }`}
                  >
                    {customer.isActive ? 'Aktif' : 'Askıda'}
                  </span>
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={handleToggleStatus}
                    title={customer.isActive ? 'Hesabı askıya al' : 'Hesabı aktifleştir'}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-300 dark:hover:bg-[#222632] dark:hover:text-slate-100"
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
