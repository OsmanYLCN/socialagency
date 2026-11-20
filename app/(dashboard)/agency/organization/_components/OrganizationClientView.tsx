'use client'

import { useState, useActionState, useTransition } from 'react'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  AtSign,
  Calendar,
  Users,
  Briefcase,
  Receipt,
  FileText,
  Check,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  ExternalLink,
  Landmark,
} from 'lucide-react'
import {
  updateAgencyDetailsAction,
  createTransactionAction,
  deleteTransactionAction,
} from '@/app/actions/agency'
import { getLocalDateString } from '@/lib/utils'

export interface AgencyDetailsDTO {
  id: string
  name: string
  status: string
  contactEmail: string
  contactPhone: string
  establishedYear: number | null
  employeeCount: number | null
  workModel: 'remote' | 'hybrid' | 'office' | null
  address: string
  mapsUrl: string
  createdAt: string | null
  website: string
  instagram: string
  linkedin: string
  sector: string
  taxOffice: string
  taxId: string
  description: string
}

export interface TransactionDTO {
  id: string
  type: 'income' | 'expense'
  category: 'salary' | 'client_payment' | 'software_tool' | 'office' | 'other'
  amount: number
  description: string | null
  transactionDate: string
  createdAt: string
}

export interface FinancialSummaryDTO {
  monthlyContractRevenue: number
  monthlyPayrollExpense: number
  extraIncome: number
  extraExpense: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMarginPct: number
  activeBrandsCount: number
  activeEmployeesCount: number
}

interface OrganizationClientViewProps {
  agency: AgencyDetailsDTO
  transactions: TransactionDTO[]
  financialSummary: FinancialSummaryDTO
}

const CATEGORY_LABELS: Record<TransactionDTO['category'], string> = {
  client_payment: 'Müşteri Ödemesi / Ek Proje',
  salary: 'Personel & Prim Ödemesi',
  software_tool: 'Yazılım & SaaS Lisans (Adobe, Figma vb.)',
  office: 'Ofis, Kira & Operasyon',
  other: 'Diğer Gelir / Gider',
}

const WORK_MODEL_OPTIONS = [
  { value: 'office', label: 'Tam Zamanlı Ofis' },
  { value: 'hybrid', label: 'Hibrit (Ofis + Uzaktan)' },
  { value: 'remote', label: 'Tamamen Uzaktan (Remote)' },
]

export function OrganizationClientView({
  agency,
  transactions,
  financialSummary,
}: OrganizationClientViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'finance'>('profile')

  // Ajans Profili Form State
  const [agencyState, agencyFormAction, isAgencyPending] = useActionState(updateAgencyDetailsAction, null)

  // Yeni Finansal İşlem Form State
  const [txType, setTxType] = useState<'income' | 'expense'>('expense')
  const [txCategory, setTxCategory] = useState<TransactionDTO['category']>('software_tool')
  const [txAmount, setTxAmount] = useState('')
  const [txDate, setTxDate] = useState(() => getLocalDateString())
  const [txDesc, setTxDesc] = useState('')

  const [txState, txFormAction, isTxPending] = useActionState(
    async (prev: { success?: boolean; error?: string } | null, formData: FormData) => {
      const res = await createTransactionAction(prev, formData)
      if (res.success) {
        setTxAmount('')
        setTxDesc('')
      }
      return res
    },
    null
  )

  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [, startDeleteTransition] = useTransition()

  const handleDeleteTransaction = (id: string) => {
    setIsDeletingId(id)
    startDeleteTransition(async () => {
      const fd = new FormData()
      fd.set('transaction_id', id)
      await deleteTransactionAction(null, fd)
      setIsDeletingId(null)
    })
  }

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Sekme Seçici */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center dark:border-[#272b37]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900/50">
              <Building2 className="h-3.5 w-3.5" />
              Kurumsal Yönetim Merkezi
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {agency.name} — Ajans & Finans
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ajansınızın resmi kurumsal bilgilerini, adres ve iletişim kayıtlarını ve aylık kârlılık/nakit akışını yönetin.
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-[#1a1d25] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Ajans Bilgileri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Wallet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Finans & Kârlılık</span>
          </button>
        </div>
      </div>

      {/* SEKME 1: AJANS KURUMSAL BİLGİLERİ */}
      {activeTab === 'profile' && (
        <form action={agencyFormAction} className="space-y-6">
          {agencyState?.error && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{agencyState.error}</span>
            </div>
          )}

          {agencyState?.success && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{agencyState.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Sol 2 Kolon: Kurumsal Kimlik, İletişim ve Adres */}
            <div className="space-y-6 lg:col-span-2">
              {/* 1. Kurumsal Kimlik */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5 dark:border-[#272b37] dark:bg-[#16181f]">
                <div className="border-b border-slate-100 pb-4 dark:border-[#272b37]">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Kurumsal Kimlik & Operasyon Yapısı
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ajansınızın temel ünvanı, çalışma modeli ve uzmanlık alanı.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ajans Adı <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={agency.name}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Uzmanlık / Ana Sektör
                    </label>
                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="sector"
                        defaultValue={agency.sector}
                        placeholder="Örn: 360° Dijital Pazarlama & Sosyal Medya"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Çalışma Modeli
                    </label>
                    <select
                      name="work_model"
                      defaultValue={agency.workModel ?? ''}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    >
                      <option value="">Seçiniz...</option>
                      {WORK_MODEL_OPTIONS.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Kuruluş Yılı
                      </label>
                      <div className="relative">
                        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          name="established_year"
                          min="1950"
                          max="2030"
                          defaultValue={agency.establishedYear ?? ''}
                          placeholder="2021"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Kapasite (Kişi)
                      </label>
                      <div className="relative">
                        <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          name="employee_count"
                          min="1"
                          defaultValue={agency.employeeCount ?? ''}
                          placeholder="15"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kurumsal Tanıtım & Vizyon Notu
                  </label>
                  <div className="relative">
                    <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={agency.description}
                      placeholder="Ajansınızın hizmet kapsamı ve operasyonel çalışma prensipleri..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* 2. İletişim & Adres Bilgileri */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5 dark:border-[#272b37] dark:bg-[#16181f]">
                <div className="border-b border-slate-100 pb-4 dark:border-[#272b37]">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    İletişim, Merkez Ofis Adresi & Lokasyon
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Müşteri sözleşmeleri ve resmi yazışmalarda kullanılan iletişim kayıtları.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Resmi İletişim E-postası <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="contact_email"
                        required
                        defaultValue={agency.contactEmail}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Kurumsal Telefon
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="contact_phone"
                        defaultValue={agency.contactPhone}
                        placeholder="+90 (212) 000 00 00"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Açık Merkez Ofis Adresi
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      name="address"
                      rows={2}
                      defaultValue={agency.address}
                      placeholder="Maslak Mah. Büyükdere Cad. No:123 Sarıyer / İstanbul"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Google Maps Konum Bağlantısı (URL)
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      name="maps_url"
                      defaultValue={agency.mapsUrl}
                      placeholder="https://maps.google.com/..."
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ 1 Kolon: Dijital Varlıklar & Vergi Kayıtları */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 dark:border-[#272b37] dark:bg-[#16181f]">
                <div className="border-b border-slate-100 pb-4 dark:border-[#272b37]">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Dijital Varlıklar & Sosyal Medya
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ajansınızın web ve sosyal medya profilleri.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Resmi Web Sitesi
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="website"
                      defaultValue={agency.website}
                      placeholder="https://ajansiniz.com"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Instagram Hesabı
                  </label>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="instagram"
                      defaultValue={agency.instagram}
                      placeholder="@ajansiniz"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    LinkedIn Şirket Sayfası
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="linkedin"
                      defaultValue={agency.linkedin}
                      placeholder="linkedin.com/company/..."
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 dark:border-[#272b37] dark:bg-[#16181f]">
                <div className="border-b border-slate-100 pb-4 dark:border-[#272b37]">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Vergi & Resmi Fatura Bilgileri
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ajansınızın vergi dairesi ve vergi numarası.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Vergi Dairesi
                  </label>
                  <div className="relative">
                    <Landmark className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="tax_office"
                      defaultValue={agency.taxOffice}
                      placeholder="Örn: Zincirlikuyu V.D."
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Vergi Numarası / VKN
                  </label>
                  <div className="relative">
                    <Receipt className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="tax_id"
                      defaultValue={agency.taxId}
                      placeholder="1234567890"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-mono text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAgencyPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 transition-all cursor-pointer"
                  >
                    {isAgencyPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Kurumsal Bilgileri Kaydet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* SEKME 2: FİNANSAL NAKİT AKIŞI VE KÂRLILIK */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* 4'lü Finansal KPI Kartları */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Aylık Marka Gelirleri</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {financialSummary.monthlyContractRevenue.toLocaleString('tr-TR')} ₺
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                {financialSummary.activeBrandsCount} aktif müşteri sözleşmesi
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Aylık Personel Bordrosu</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                  <TrendingDown className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {financialSummary.monthlyPayrollExpense.toLocaleString('tr-TR')} ₺
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                {financialSummary.activeEmployeesCount} aktif personel maaşı
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Ek Gelir / Gider Hareketleri</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Receipt className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                +{(financialSummary.extraIncome).toLocaleString('tr-TR')} / -{(financialSummary.extraExpense).toLocaleString('tr-TR')} ₺
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Yazılım, ofis ve ek proje kayıtları
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 shadow-xs ${
                financialSummary.netProfit >= 0
                  ? 'border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                  : 'border-rose-200/80 bg-rose-50/30 dark:border-rose-900/50 dark:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Net Operasyonel Kâr</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                    financialSummary.netProfit >= 0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  %{financialSummary.profitMarginPct} Marj
                </span>
              </div>
              <p
                className={`mt-2 text-2xl font-black tabular-nums ${
                  financialSummary.netProfit >= 0
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-rose-700 dark:text-rose-300'
                }`}
              >
                {financialSummary.netProfit >= 0 ? '+' : ''}
                {financialSummary.netProfit.toLocaleString('tr-TR')} ₺
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Toplam Gelir - (Bordro + Giderler)
              </p>
            </div>
          </div>

          {/* Gelir / Gider Ekleme Formu ve İşlem Tablosu */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Sol: Yeni Finansal Hareket Kaydı */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 dark:border-[#272b37] dark:bg-[#16181f] h-fit">
              <div className="border-b border-slate-100 pb-3 dark:border-[#272b37]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Yeni Gelir / Gider Kaydı Ekle
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Yazılım abonelikleri, ofis giderleri veya ek proje ödemelerini kaydedin.
                </p>
              </div>

              {txState?.error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  {txState.error}
                </div>
              )}

              <form action={txFormAction} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-[#1a1d25]">
                  <button
                    type="button"
                    onClick={() => setTxType('expense')}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      txType === 'expense'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Gider (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('income')}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      txType === 'income'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Gelir (+)
                  </button>
                </div>
                <input type="hidden" name="type" value={txType} />

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as TransactionDTO['category'])}
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tutar (₺)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      min="1"
                      step="0.01"
                      required
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="2500"
                      className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tarih
                    </label>
                    <input
                      type="date"
                      name="transaction_date"
                      required
                      value={txDate}
                      onChange={(e) => setTxDate(e.target.value)}
                      className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder="Örn: Adobe Creative Cloud Aylık Lisans"
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTxPending}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isTxPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>Finans Kaydını Ekle</span>
                </button>
              </form>
            </div>

            {/* Sağ 2 Kolon: Finansal Hareket Geçmişi */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-[#272b37] dark:bg-[#16181f]">
              <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-[#272b37]">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Kayıtlı Finansal Hareketler ({transactions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Veritabanındaki (`transactions`) gelir ve gider kayıtları.
                  </p>
                </div>
              </div>

              {transactions.length === 0 ? (
                <div className="py-14 text-center">
                  <Wallet className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Henüz ekstra bir gelir veya gider hareketi eklenmemiş
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Sol taraftaki formu kullanarak yazılım, kira veya ek ödeme kalemlerini kaydedebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-[#272b37] dark:bg-[#1a1d25]">
                        <th className="px-5 py-3">Tarih</th>
                        <th className="px-4 py-3">Kategori & Açıklama</th>
                        <th className="px-4 py-3">Tür</th>
                        <th className="px-4 py-3 text-right">Tutar</th>
                        <th className="px-5 py-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#272b37]/60">
                      {transactions.map((tr) => (
                        <tr key={tr.id} className="hover:bg-slate-50/60 dark:hover:bg-[#1a1d25]/60">
                          <td className="px-5 py-3 whitespace-nowrap font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                            {new Date(tr.transactionDate).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 dark:text-slate-100 block">
                              {CATEGORY_LABELS[tr.category] ?? tr.category}
                            </span>
                            {tr.description && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {tr.description}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                tr.type === 'income'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              }`}
                            >
                              {tr.type === 'income' ? 'Gelir' : 'Gider'}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-black whitespace-nowrap tabular-nums ${
                              tr.type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {tr.type === 'income' ? '+' : '-'}
                            {tr.amount.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="px-5 py-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              disabled={isDeletingId === tr.id}
                              onClick={() => handleDeleteTransaction(tr.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                              title="Kaydı Sil"
                            >
                              {isDeletingId === tr.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
