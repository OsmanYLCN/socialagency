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
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
} from 'lucide-react'

const SECTORS = [
  'Dijital Pazarlama',
  'Sosyal Medya Ajansı',
  'Halkla İlişkiler (PR)',
  'Reklam Ajansı',
  'İçerik Üretimi',
  'SEO & SEM',
  'Grafik Tasarım & Kreatif',
  'Web & Mobil Geliştirme',
  'E-Ticaret Danışmanlığı',
  'Influencer Pazarlama',
  'Medya Satın Alma',
  'Marka Danışmanlığı',
  'Diğer',
]

const EMPLOYEE_RANGES = [
  { value: '1', label: 'Sadece ben (freelance)' },
  { value: '3', label: '2–5 kişi' },
  { value: '8', label: '6–10 kişi' },
  { value: '20', label: '11–30 kişi' },
  { value: '50', label: '31–50 kişi' },
  { value: '100', label: '51–100 kişi' },
  { value: '200', label: '100+ kişi' },
]

// Ajans sahibi kayıt formunu yönetir
export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  // Adım 1'deki alanları takip ederiz (validasyon için)
  const [agencyName, setAgencyName] = useState('')
  const [sector, setSector] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const canProceed = agencyName.trim().length >= 2 && fullName.trim().length >= 2 && email.includes('@')

  return (
    <div>
      {/* Adım göstergesi */}
      <div className="mb-6 flex items-center gap-3">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
          1
        </div>
        <div className={`h-0.5 flex-1 rounded transition-all ${step >= 2 ? 'bg-indigo-400' : 'bg-slate-200'}`} />
        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
          2
        </div>
      </div>

      <form action={formAction}>
        {/* Hidden alanlar — her iki adımdaki değerleri saklarız */}
        <input type="hidden" name="agency_name" value={agencyName} />
        <input type="hidden" name="full_name" value={fullName} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="sector" value={sector} />

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ajans Bilgileri</p>

            {/* Ajans Adı */}
            <div className="group flex flex-col gap-1.5">
              <label htmlFor="reg-agency-name" className="text-xs font-semibold text-slate-700">
                Ajans / Şirket Adı <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                <input
                  id="reg-agency-name"
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder="Örnek Medya Ajansı"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Sektör */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-sector" className="text-xs font-semibold text-slate-700">
                Sektör / Faaliyet Alanı
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="reg-sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                >
                  <option value="">Seçiniz (isteğe bağlı)</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-1 border-t border-slate-100 pt-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Yetkili Bilgileri</p>
            </div>

            {/* Ad Soyad */}
            <div className="group flex flex-col gap-1.5">
              <label htmlFor="reg-full-name" className="text-xs font-semibold text-slate-700">
                Adınız Soyadınız <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                <input
                  id="reg-full-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ahmet Yılmaz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* E-posta */}
            <div className="group flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-slate-700">
                Kurumsal E-posta <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ahmet@ajans.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="group flex flex-col gap-1.5">
              <label htmlFor="reg-phone" className="text-xs font-semibold text-slate-700">
                Cep Telefonu
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                <input
                  id="reg-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="5XX XXX XX XX"
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* İleri butonu */}
            <button
              type="button"
              disabled={!canProceed}
              onClick={() => setStep(2)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Devam Et
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ajans Detayları</p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                ← Geri dön
              </button>
            </div>

            {/* Çalışan Sayısı */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-employee-count" className="text-xs font-semibold text-slate-700">
                Ekip Büyüklüğü
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="reg-employee-count"
                  name="employee_count"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                >
                  <option value="">Seçiniz (isteğe bağlı)</option>
                  {EMPLOYEE_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Web Sitesi */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-website" className="text-xs font-semibold text-slate-700">
                Web Sitesi
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-website"
                  name="website"
                  type="url"
                  autoComplete="url"
                  placeholder="https://ajansim.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Adres */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-address" className="text-xs font-semibold text-slate-700">
                Şehir / Adres
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-address"
                  name="address"
                  type="text"
                  placeholder="İstanbul, Türkiye"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Hesap Güvenliği</p>
            </div>

            {/* Şifre */}
            <div className="group flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-xs font-semibold text-slate-700">
                Şifre <span className="text-rose-500">*</span>
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
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
              <p className="text-[11px] text-slate-400">
                En az 6 karakter, harf ve rakam içermesi önerilir.
              </p>
            </div>

            {/* Hata bildirimi */}
            {state?.error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            {/* Gizlilik Notu */}
            <p className="text-[11px] text-slate-400">
              Kayıt olarak{' '}
              <a href="#" className="font-semibold text-indigo-600 hover:underline">Kullanım Koşulları</a>
              {' '}ve{' '}
              <a href="#" className="font-semibold text-indigo-600 hover:underline">Gizlilik Politikası</a>
              {' '}nı kabul etmiş olursunuz.
            </p>

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
                  Ajansı Kaydet
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
