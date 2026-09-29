'use client'

import { useActionState, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  User,
  Mail,
  Lock,
  DollarSign,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  Loader2,
  AlertCircle,
  Phone,
  Globe,
  AtSign,
  MapPin,
  FileText,
  Briefcase,
  ArrowLeft,
  Receipt,
  CheckCircle2,
} from 'lucide-react'
import { createCustomerAction } from '@/app/actions/agency'

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

// Kriptografik olarak güvenli rastgele şifre üretir
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

export function CreateCustomerPageForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await createCustomerAction(prevState, formData)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/agency/customers')
          router.refresh()
        }, 1200)
      }
      return result
    },
    null
  )

  const handleGenerate = useCallback(() => {
    const pw = generateSecurePassword()
    setPassword(pw)
    setCopied(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (!password) return
    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }, [password])

  return (
    <form action={formAction} className="space-y-6">
      {/* Geri Dönüş ve Başlık Barı */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/agency/customers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Müşteriler Listesine Dön
          </Link>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Yeni Müşteri & Marka Kaydı
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Global standartlarda kurumsal marka profili, yetkili bilgileri ve müşteri portal hesabı oluşturun.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/agency/customers"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Vazgeç
          </Link>
          <button
            type="submit"
            disabled={isPending || isSuccess}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Müşteri Oluşturuluyor...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Başarıyla Eklendi!
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Müşteriyi ve Markayı Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hata ve Başarı Bildirimleri */}
      {state?.error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 animate-in fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <span>{state.error}</span>
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Müşteri ve marka profili başarıyla oluşturuldu! Müşteriler sayfasına yönlendiriliyorsunuz...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* KART 1: Marka & Şirket Profili */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Marka & Şirket Profili</h2>
              <p className="text-[11px] text-slate-400">Markanın kurumsal kimlik bilgileri</p>
            </div>
          </div>

          {/* Marka Adı */}
          <div>
            <label htmlFor="brand_name" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Marka Adı <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="brand_name"
                name="brand_name"
                type="text"
                required
                autoComplete="organization"
                placeholder="Örn: Nike Türkiye, Kahve Dünyası"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Sektör */}
          <div>
            <label htmlFor="sector" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Faaliyet Alanı / Sektör
            </label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                id="sector"
                name="sector"
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="">Sektör Seçiniz (Opsiyonel)</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Web Sitesi */}
            <div>
              <label htmlFor="website" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Web Sitesi
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://brand.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Instagram / Sosyal Medya */}
            <div>
              <label htmlFor="instagram" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Instagram / Sosyal Medya
              </label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="instagram"
                  name="instagram"
                  type="text"
                  placeholder="@markahesabi"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Şehir / Lokasyon */}
          <div>
            <label htmlFor="city" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Şehir / Bölge
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Örn: İstanbul / Levent"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* KART 2: Yetkili Kişi & İletişim Bilgileri */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Yetkili & İletişim</h2>
              <p className="text-[11px] text-slate-400">Marka tarafındaki muhatap kişi bilgileri</p>
            </div>
          </div>

          {/* Yetkili Adı & Soyadı */}
          <div>
            <label htmlFor="authorized_name" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Yetkili Adı & Soyadı
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="authorized_name"
                name="authorized_name"
                type="text"
                autoComplete="name"
                placeholder="Örn: Mehmet Yılmaz"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Telefon Numarası */}
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Yetkili Telefon Numarası
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="5XX XXX XX XX"
                maxLength={15}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Operasyonel süreçlerde ve revizyon bildirimlerinde kullanılır.
            </p>
          </div>
        </div>

        {/* KART 3: Finansal Bilgiler & Hizmet Kapsamı */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Finans & Fatura</h2>
              <p className="text-[11px] text-slate-400">Aylık hizmet bedeli ve kurumsal fatura detayları</p>
            </div>
          </div>

          {/* Aylık Hizmet Bedeli */}
          <div>
            <label htmlFor="monthly_fee" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Aylık Hizmet Bedeli (₺)
            </label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="monthly_fee"
                name="monthly_fee"
                type="number"
                min="0"
                step="1"
                placeholder="Örn: 25000"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Fatura Şirket Ünvanı */}
          <div>
            <label htmlFor="billing_title" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Fatura Şirket Ünvanı
            </label>
            <div className="relative">
              <Receipt className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="billing_title"
                name="billing_title"
                type="text"
                placeholder="Örn: ABC Pazarlama İletişim A.Ş."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Vergi No */}
            <div>
              <label htmlFor="tax_id" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Vergi No / T.C.
              </label>
              <input
                id="tax_id"
                name="tax_id"
                type="text"
                placeholder="10 Haneli Vergi No"
                maxLength={11}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {/* Vergi Dairesi */}
            <div>
              <label htmlFor="tax_office" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Vergi Dairesi
              </label>
              <input
                id="tax_office"
                name="tax_office"
                type="text"
                placeholder="Örn: Beşiktaş V.D."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Notlar / Hizmet Kapsamı */}
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Hizmet Notları & Kapsam
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Aylık 12 Reels, 8 post, haftalık raporlama..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* KART 4: Müşteri Giriş Portalı & Güvenlik */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Müşteri Giriş Hesabı</h2>
              <p className="text-[11px] text-slate-400">Müşterinin panele giriş yapacağı kimlik bilgileri</p>
            </div>
          </div>

          {/* Giriş E-postası */}
          <div>
            <label htmlFor="contact_email" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Giriş E-postası <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                required
                autoComplete="off"
                placeholder="musteri@sirket.com"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Giriş Şifresi */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Giriş Şifresi <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
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

              {/* Üret butonu */}
              <button
                type="button"
                onClick={handleGenerate}
                title="Güvenli şifre üret"
                className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Üret
              </button>

              {/* Kopyala butonu */}
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
            <p className="mt-1.5 text-[11px] text-slate-400">
              Bu şifreyi müşterinizle paylaşarak onay ve içerik panelini kullanmasını sağlayabilirsiniz.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-xs text-amber-900">
            <p className="font-semibold text-amber-950">Bilgilendirme:</p>
            <p className="mt-0.5 text-amber-800 text-[11px]">
              Kayıt tamamlandığında müşteri için bir hesap oluşturulur. Müşteri kendi paneline girerek üretilen içerikleri inceleyebilir ve onaylayabilir.
            </p>
          </div>
        </div>
      </div>

      {/* Alt Aksiyon Butonları */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Link
          href="/agency/customers"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Vazgeç
        </Link>
        <button
          type="submit"
          disabled={isPending || isSuccess}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Müşteri Oluşturuluyor...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Başarıyla Eklendi!
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Müşteriyi ve Markayı Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  )
}
