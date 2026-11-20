'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import {
  User,
  DollarSign,
  Mail,
  Check,
  Loader2,
  X,
  AlertCircle,
  Power,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  CreditCard,
  HeartHandshake,
  FileText,
} from 'lucide-react'
import { updateEmployeeAction, toggleEmployeeStatusAction } from '@/app/actions/agency'
import type { EmployeeItem } from './EmployeesClientView'

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

interface EditEmployeeModalProps {
  isOpen: boolean
  employee: EmployeeItem | null
  onClose: () => void
}

// Çalışan bilgi, departman, özlük ve maaş düzenleme modalı
export function EditEmployeeModal({ isOpen, employee, onClose }: EditEmployeeModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [salary, setSalary] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [title, setTitle] = useState('')
  const [workType, setWorkType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [city, setCity] = useState('')
  const [iban, setIban] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [notes, setNotes] = useState('')

  const [isToggling, startTransition] = useTransition()
  const [toggleError, setToggleError] = useState<string | null>(null)

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName ?? '')
      setLastName(employee.lastName ?? '')
      setSalary(employee.salary > 0 ? String(employee.salary) : '0')
      setPhone(employee.metadata?.phone ?? '')
      setDepartment(employee.metadata?.department ?? '')
      setTitle(employee.metadata?.title ?? '')
      setWorkType(employee.metadata?.workType ?? '')
      setStartDate(employee.metadata?.startDate ?? '')
      setCity(employee.metadata?.city ?? '')
      setIban(employee.metadata?.iban ?? '')
      setEmergencyContact(employee.metadata?.emergencyContact ?? '')
      setNotes(employee.metadata?.notes ?? '')
      setToggleError(null)
    }
  }, [employee])

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateEmployeeAction(prevState, formData)
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

  const handleToggleStatus = () => {
    setToggleError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('employee_id', employee.id)
      formData.set('is_active', employee.isActive ? 'false' : 'true')
      const res = await toggleEmployeeStatusAction(null, formData)
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
              <User className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Çalışan & Özlük Dosyasını Düzenle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personelin departman, ünvan, maaş ve iletişim detaylarını güncelleyin</p>
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
          <input type="hidden" name="employee_id" value={employee.id} />

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

          {/* 1. Kişisel Bilgiler & Maaş */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ee-first-name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="ee-first-name"
                  name="first_name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ahmet"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ee-last-name" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Soyad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="ee-last-name"
                  name="last_name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Yılmaz"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ee-phone" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                İletişim Telefonu
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="ee-phone"
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
              <label htmlFor="ee-city" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Şehir / Lokasyon
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="ee-city"
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

          {/* 2. Departman, Ünvan & Çalışma Modeli */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-100 pt-4 dark:border-[#272b37]">
            <div>
              <label htmlFor="ee-department" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Departman / Birim
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select
                  id="ee-department"
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                >
                  <option value="">Departman seçin...</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="ee-title" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pozisyon / Ünvan
              </label>
              <input
                id="ee-title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Kıdemli Video Editörü"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="ee-work-type" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Çalışma Modeli
              </label>
              <select
                id="ee-work-type"
                name="work_type"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
              >
                <option value="">Model seçin...</option>
                {WORK_MODELS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ee-start-date" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                İşe Başlama Tarihi
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="ee-start-date"
                  name="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* 3. Finansal & Bordro Bilgileri */}
          <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-[#272b37]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ee-salary" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Aylık Net Maaş (₺)
                </label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="ee-salary"
                    name="salary"
                    type="number"
                    min="0"
                    step="1"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="0"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ee-iban" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Banka IBAN Numarası
                </label>
                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="ee-iban"
                    name="iban"
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-mono text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ee-emergency" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Acil Durum İletişim Kişisi
                </label>
                <div className="relative">
                  <HeartHandshake className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="ee-emergency"
                    name="emergency_contact"
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="İsim & Telefon"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ee-notes" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ajans İçi Personel Notu
                </label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="ee-notes"
                    name="notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Yetkinlikler, kullanılan yazılımlar..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Hesap Bilgisi & Durum Değiştirme */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-[#272b37] dark:bg-[#1a1d25]">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Giriş Hesabı</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    employee.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#16181f] dark:text-slate-400 dark:border-[#272b37]'
                  }`}
                >
                  {employee.isActive ? 'Aktif' : 'Askıda'}
                </span>
                <button
                  type="button"
                  disabled={isToggling}
                  onClick={handleToggleStatus}
                  title={employee.isActive ? 'Hesabı askıya al' : 'Hesabı aktifleştir'}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-300 dark:hover:bg-[#222632] dark:hover:text-slate-100"
                >
                  {isToggling ? (
                    <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
                  ) : (
                    <Power className={`h-3 w-3 ${employee.isActive ? 'text-amber-500' : 'text-emerald-500'}`} />
                  )}
                  <span>{employee.isActive ? 'Askıya Al' : 'Aktifleştir'}</span>
                </button>
              </div>
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
