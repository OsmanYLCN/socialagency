'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import {
  Building2,
  DollarSign,
  Mail,
  Check,
  Loader2,
  X,
  AlertCircle,
  Power,
  User,
  Phone,
  Globe,
  AtSign,
  MapPin,
  Receipt,
  FileText,
  Briefcase,
} from 'lucide-react'
import { updateCustomerAction, toggleCustomerStatusAction } from '@/app/actions/agency'
import type { BrandItem } from './CustomersClientView'

const SECTORS = [
  'E-Ticaret & Perakende',
  'Moda & Tekstil',
  'Yiyecek & İçecek / Restoran',
  'Sağlık & Kozmetik & Estetik',
  'Teknoloji & Yazılım (SaaS)',
  'Gayrimenkul & İnşaat',
  'Otomotiv & Yedek Parça',
  'Eğitim & Akademi',
  'Turizm & Otelcilik',
  'Finans & Sigorta & Yatırım',
  'Hukuk & Danışmanlık',
  'Medya & Eğlence & Prodüksiyon',
  'Spor & Fitness',
  'Mobilya & Ev Yaşam',
  'Diğer',
]

interface EditCustomerModalProps {
  isOpen: boolean
  brand: BrandItem | null
  onClose: () => void
}

// Müşteri markası, iletişim, sosyal medya ve fatura detaylarını düzenleme modalı
export function EditCustomerModal({ isOpen, brand, onClose }: EditCustomerModalProps) {
  const [name, setName] = useState('')
  const [fee, setFee] = useState('')
  const [authorizedName, setAuthorizedName] = useState('')
  const [phone, setPhone] = useState('')
  const [sector, setSector] = useState('')
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')
  const [city, setCity] = useState('')
  const [billingTitle, setBillingTitle] = useState('')
  const [taxOffice, setTaxOffice] = useState('')
  const [taxId, setTaxId] = useState('')
  const [notes, setNotes] = useState('')

  const [isToggling, startTransition] = useTransition()
  const [toggleError, setToggleError] = useState<string | null>(null)

  useEffect(() => {
    if (brand) {
      setName(brand.name)
      setFee(brand.monthlyFee ? String(brand.monthlyFee) : '0')
      const contactName = [brand.customer?.firstName, brand.customer?.lastName]
        .filter((part) => part && part !== '(Müşteri)')
        .join(' ')
      setAuthorizedName(contactName)
      setPhone(brand.metadata?.phone ?? '')
      setSector(brand.metadata?.sector ?? '')
      setWebsite(brand.metadata?.website ?? '')
      setInstagram(brand.metadata?.instagram ?? '')
      setCity(brand.metadata?.city ?? '')
      setBillingTitle(brand.metadata?.billingTitle ?? '')
      setTaxOffice(brand.metadata?.taxOffice ?? '')
      setTaxId(brand.metadata?.taxId ?? '')
      setNotes(brand.metadata?.notes ?? '')
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
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150 dark:border-[#272b37] dark:bg-[#16181f]">
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-[#272b37]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Marka & Müşteri Dosyasını Düzenle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kurumsal profil, iletişim, sosyal medya ve fatura kayıtlarını güncelleyin</p>
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

        {/* Kaydırılabilir Form Gövdesi */}
        <form action={formAction} className="flex-1 overflow-y-auto p-6 space-y-5">
          <input type="hidden" name="brand_id" value={brand.id} />

          {state?.error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {toggleError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{toggleError}</span>
            </div>
          )}

          {/* 1. Temel Marka & Sözleşme Bilgileri */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div>
              <label htmlFor="edit-sector" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Faaliyet Sektörü
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select
                  id="edit-sector"
                  name="sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                >
                  <option value="">Sektör seçin...</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="edit-city" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Şehir / Lokasyon
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="edit-city"
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="İstanbul"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* 2. Yetkili & Dijital Varlıklar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-100 pt-4 dark:border-[#272b37]">
            <div>
              <label htmlFor="edit-authorized-name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Yetkili Adı & Soyadı
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
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-phone" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                İletişim Telefonu
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="edit-phone"
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-instagram" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Instagram Kullanıcı Adı
              </label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="edit-instagram"
                  name="instagram"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@markaadi"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-website" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Web Sitesi
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="edit-website"
                  name="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://marka.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* 3. Fatura & Vergi Bilgileri */}
          <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-[#272b37]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label htmlFor="edit-billing-title" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Resmi Ticari Ünvan
                </label>
                <div className="relative">
                  <Receipt className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="edit-billing-title"
                    name="billing_title"
                    type="text"
                    value={billingTitle}
                    onChange={(e) => setBillingTitle(e.target.value)}
                    placeholder="Örn: Marka A.Ş."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-tax-office" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Vergi Dairesi
                </label>
                <input
                  id="edit-tax-office"
                  name="tax_office"
                  type="text"
                  value={taxOffice}
                  onChange={(e) => setTaxOffice(e.target.value)}
                  placeholder="Maslak V.D."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="edit-tax-id" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Vergi No / TCKN
                </label>
                <input
                  id="edit-tax-id"
                  name="tax_id"
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="1234567890"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-notes" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ajans İçi Marka Notları & Özel Brief
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <textarea
                  id="edit-notes"
                  name="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Markanın iletişim dili, renk kodları veya sözleşme özel şartları..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* 4. Müşteri Hesap Bilgisi & Durumu */}
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

          {/* Aksiyon butonları */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-[#272b37]">
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
