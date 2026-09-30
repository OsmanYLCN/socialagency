'use client'

import { useActionState, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
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
  Briefcase,
  MapPin,
  Calendar,
  CreditCard,
  HeartHandshake,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Users,
} from 'lucide-react'
import { createEmployeeAction } from '@/app/actions/agency'

const DEPARTMENTS = [
  'Sosyal Medya Yönetimi',
  'Kreatif & Grafik Tasarım',
  'Video Prodüksiyon & Reels / Motion',
  'Metin Yazarlığı & İçerik Stratejisi',
  'Reklam & Medya Satın Alma (Meta/Google)',
  'Müşteri İlişkileri & Hesap Yönetimi (Account)',
  'SEO & Arama Motoru Pazarlaması',
  'Yazılım & Web Geliştirme',
  'Fotoğrafçılık & Prodüksiyon',
  'Yönetim & Operasyon',
  'Diğer',
]

const WORK_MODELS = [
  'Tam Zamanlı (Ofis)',
  'Hibrit (Ofis + Uzaktan)',
  'Tam Zamanlı (Uzaktan / Remote)',
  'Yarı Zamanlı (Part-time)',
  'Freelance / Proje Bazlı',
  'Stajyer',
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

export function CreateEmployeePageForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await createEmployeeAction(prevState, formData)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/agency/employees')
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
      {/* Üst Başlık ve Aksiyon Barı */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/agency/employees"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Ekip Listesine Dön
          </Link>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Yeni Çalışan & Personel Kaydı
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Ajans kadronuza yeni bir ekip üyesi ekleyin, görev pozisyonunu ve portal giriş yetkilerini belirleyin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/agency/employees"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-300 dark:hover:bg-[#222632] transition-colors"
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
                Çalışan Oluşturuluyor...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Başarıyla Eklendi!
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Çalışanı Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hata ve Başarı Bildirimleri */}
      {state?.error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 animate-in fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{state.error}</span>
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Çalışan hesabı başarıyla oluşturuldu! Ekip sayfasına yönlendiriliyorsunuz...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* KART 1: Kişisel Bilgiler */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#272b37] pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Kişisel & İletişim Bilgileri</h2>
              <p className="text-[11px] text-slate-400">Çalışanın kimlik ve iletişim detayları</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Ad */}
            <div>
              <label htmlFor="first_name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Örn: Berkay"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
                />
              </div>
            </div>

            {/* Soyad */}
            <div>
              <label htmlFor="last_name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Soyad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder="Örn: Yılmaz"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
                />
              </div>
            </div>
          </div>

          {/* Telefon Numarası */}
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Telefon Numarası
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="5XX XXX XX XX"
                maxLength={15}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Şehir / Lokasyon */}
            <div>
              <label htmlFor="city" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Şehir / İkamet
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Örn: İstanbul / Kadıköy"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
                />
              </div>
            </div>

            {/* İşe Başlama Tarihi */}
            <div>
              <label htmlFor="start_date" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                İşe Başlama Tarihi
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KART 2: Departman & Görev Bilgileri */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#272b37] pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Departman & Görev Pozisyonu</h2>
              <p className="text-[11px] text-slate-400">Ajans içi çalışma rolü ve uzmanlığı</p>
            </div>
          </div>

          {/* Departman */}
          <div>
            <label htmlFor="department" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Departman / Uzmanlık Alanı
            </label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <select
                id="department"
                name="department"
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              >
                <option value="">Departman Seçiniz (Opsiyonel)</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Görev Unvanı */}
          <div>
            <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Görev Unvanı / Pozisyon
            </label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Örn: Kıdemli Sosyal Medya Yöneticisi, Lead Video Editor"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              />
            </div>
          </div>

          {/* Çalışma Modeli */}
          <div>
            <label htmlFor="work_type" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Çalışma Şekli & Modeli
            </label>
            <select
              id="work_type"
              name="work_type"
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
            >
              <option value="">Çalışma Modeli Seçiniz</option>
              {WORK_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KART 3: Maaş, Bordro & Acil Durum */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#272b37] pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Maaş & İK Bilgileri</h2>
              <p className="text-[11px] text-slate-400">Aylık bordro ve kurumsal kayıtlar</p>
            </div>
          </div>

          {/* Aylık Maaş */}
          <div>
            <label htmlFor="salary" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Aylık Net Maaş (₺)
            </label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="salary"
                name="salary"
                type="number"
                min="0"
                step="1"
                placeholder="Örn: 42000"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Bu bilgi yalnızca ajans sahibi tarafından görüntülenebilir; çalışan göremez.
            </p>
          </div>

          {/* Banka IBAN */}
          <div>
            <label htmlFor="iban" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Banka IBAN Numarası
            </label>
            <div className="relative">
              <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="iban"
                name="iban"
                type="text"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                maxLength={32}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              />
            </div>
          </div>

          {/* Acil Durum İletişimi */}
          <div>
            <label htmlFor="emergency_contact" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Acil Durum İletişim Kişisi & Tel
            </label>
            <div className="relative">
              <HeartHandshake className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="emergency_contact"
                name="emergency_contact"
                type="text"
                placeholder="Örn: Ayşe Yılmaz (Eşi) - 0532 XXX XX XX"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              />
            </div>
          </div>

          {/* Ek Notlar */}
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Personel Notları & Portfolyo
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Kullandığı yazılımlar, portfolyo linki, özel yetkinlikler..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              />
            </div>
          </div>
        </div>

        {/* KART 4: Çalışan Giriş Portalı */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#272b37] pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Çalışan Giriş Hesabı</h2>
              <p className="text-[11px] text-slate-400">Çalışanın sisteme erişeceği giriş bilgileri</p>
            </div>
          </div>

          {/* Giriş E-postası */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Giriş E-postası <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                placeholder="calisan@ajans.com"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
              />
            </div>
          </div>

          {/* Giriş Şifresi */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Giriş Şifresi <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-950/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Üret butonu */}
              <button
                type="button"
                onClick={handleGenerate}
                title="Güvenli şifre üret"
                className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 cursor-pointer transition-colors"
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
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400'
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : null}
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              Bu şifreyi personele ileterek görev paneline giriş yapmasını sağlayabilirsiniz.
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
            <p className="font-semibold">Personel Yetkilendirmesi:</p>
            <p className="mt-0.5 text-indigo-700 dark:text-indigo-400 text-[11px]">
              Oluşturulan çalışan hesabı ile personel, kendi paneline giriş yapabilir; kendine atanmış iş havuzundaki görevleri üretir ve onaya sunar.
            </p>
          </div>
        </div>
      </div>

      {/* Alt Aksiyon Butonları */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#272b37] pt-6">
        <Link
          href="/agency/employees"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-300 dark:hover:bg-[#222632] transition-colors"
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
              Çalışan Oluşturuluyor...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Başarıyla Eklendi!
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Çalışanı Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  )
}
