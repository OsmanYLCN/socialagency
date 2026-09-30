'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  X,
  Sparkles,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react'
import { generateTasksFromTemplatesAction } from '@/app/actions/agency'
import type { BrandOption, ContentTemplateItem } from './ContentPlanClientView'

interface GenerateTasksModalProps {
  isOpen: boolean
  onClose: () => void
  brands: BrandOption[]
  templates: ContentTemplateItem[]
  initialBrandId?: string
}

function getMondayOfDate(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

function addDays(d: Date, days: number): Date {
  const res = new Date(d)
  res.setDate(res.getDate() + days)
  return res
}

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDayAndMonth(d: Date): string {
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

export function GenerateTasksModal({
  isOpen,
  onClose,
  brands,
  templates,
  initialBrandId,
}: GenerateTasksModalProps) {
  // Haftalarin hesaplanmasi
  const weekOptions = useMemo(() => {
    const now = new Date()
    const thisMonday = getMondayOfDate(now)
    const thisSunday = addDays(thisMonday, 6)

    const nextMonday = addDays(thisMonday, 7)
    const nextSunday = addDays(nextMonday, 6)

    const next2Monday = addDays(thisMonday, 14)
    const next2Sunday = addDays(next2Monday, 6)

    return [
      {
        id: 'this_week',
        label: 'Bu Hafta',
        startDate: toYYYYMMDD(thisMonday),
        rangeText: `${formatDayAndMonth(thisMonday)} - ${formatDayAndMonth(thisSunday)}`,
        isCurrent: true,
      },
      {
        id: 'next_week',
        label: 'Gelecek Hafta',
        startDate: toYYYYMMDD(nextMonday),
        rangeText: `${formatDayAndMonth(nextMonday)} - ${formatDayAndMonth(nextSunday)}`,
        isRecommended: true,
      },
      {
        id: 'next_2_weeks',
        label: '2 Hafta Sonra',
        startDate: toYYYYMMDD(next2Monday),
        rangeText: `${formatDayAndMonth(next2Monday)} - ${formatDayAndMonth(next2Sunday)}`,
      },
    ]
  }, [])

  const [selectedWeekDate, setSelectedWeekDate] = useState(weekOptions[1]?.startDate || '')
  const [selectedBrand, setSelectedBrand] = useState(initialBrandId || 'all')

  useEffect(() => {
    if (isOpen) {
      if (initialBrandId) setSelectedBrand(initialBrandId)
      setSelectedWeekDate(weekOptions[1]?.startDate || '')
    }
  }, [isOpen, initialBrandId, weekOptions])

  const [state, formAction, isPending] = useActionState(
    async (
      prevState: { success?: boolean; error?: string; count?: number; skipped?: number } | null,
      formData: FormData
    ) => {
      const result = await generateTasksFromTemplatesAction(prevState, formData)
      return result
    },
    null
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Onizleme hesaplamalari
  const activeTemplates = templates.filter((t) => {
    if (!t.is_active) return false
    if (selectedBrand === 'all') return true
    return t.brand_id === selectedBrand
  })

  const estimatedTasksCount = activeTemplates.reduce(
    (acc, t) => acc + (t.quantity > 0 ? t.quantity : 1),
    0
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Arka Plan Karartmasi */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Penceresi */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl transition-all dark:border dark:border-[#272b37] dark:bg-[#16181f]">
        {/* Baslik */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#272b37] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Haftalık Görevleri Üret</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rutin şablonlardan tek tıkla operasyonel görevler açın</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#222632] dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Eger Islem Basariyla Tamamlandiysa Ozet Ekrani Goster */}
        {state?.success ? (
          <div className="space-y-4 px-6 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Görevler Başarıyla Oluşturuldu!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{state.count} yeni görev</span> başarıyla açılarak <strong>İş Havuzu</strong>&apos;na aktarıldı.
                {state.skipped && state.skipped > 0 ? (
                  <span className="block mt-1 text-slate-400 dark:text-slate-500">
                    ({state.skipped} görev bu hafta için daha önce açılmış olduğu için mükerrer olmaması adına atlandı)
                  </span>
                ) : null}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-left text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 space-y-1">
              <p className="font-semibold">Sırada Ne Var?</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Görev Yönetimi sayfasındaki &quot;İş Havuzu&quot; sütunundan yeni üretilen bu içerikleri ekip üyelerinize atayabilir veya ekiplerin kendi görevlerini havuzdan almasını sağlayabilirsiniz.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:bg-[#222632] transition-colors cursor-pointer"
              >
                Kapat
              </button>
              <Link
                href="/agency/tasks"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <span>Görev Yönetimine Git</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Form Ekrani */
          <form action={formAction} className="space-y-4 px-6 py-5">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Hedef Hafta Secimi */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Görevlerin Açılacağı Hedef Hafta
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {weekOptions.map((opt) => (
                  <label key={opt.id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="week_start_date"
                      value={opt.startDate}
                      checked={selectedWeekDate === opt.startDate}
                      onChange={() => setSelectedWeekDate(opt.startDate)}
                      className="peer sr-only"
                    />
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-3 text-left transition-all hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50/60 peer-checked:text-indigo-950 dark:border-[#272b37] dark:bg-[#1a1d25] dark:hover:bg-[#222632] dark:peer-checked:border-indigo-500 dark:peer-checked:bg-indigo-950/40 dark:peer-checked:text-indigo-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{opt.label}</span>
                        {opt.isRecommended && (
                          <span className="rounded-md bg-indigo-100 px-1 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                            Önerilen
                          </span>
                        )}
                      </div>
                      <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {opt.rangeText}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Marka Secimi */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kapsam Marka
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <select
                  name="brand_id"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-medium text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/40"
                >
                  <option value="all">Tüm Markalar ({brands.length} Marka)</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ozet Kart / Bilgilendirme */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-2 text-xs dark:border-[#272b37] dark:bg-[#1a1d25]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Kapsamdaki Aktif Şablonlar:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{activeTemplates.length} Şablon</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-[#272b37] pt-2">
                <span className="text-slate-500 dark:text-slate-400">Üretilecek Toplam Görev Sayısı:</span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{estimatedTasksCount} Görev</span>
              </div>
            </div>

            {/* Guvenlik ve Mukerrer Koruma Notu */}
            <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Akıllı Mükerrer Koruması:</strong> Hedef hafta için daha önce açılmış görevler otomatik tespit edilir ve çift görev açılması engellenir. Üretilen tüm işler &quot;İş Havuzu&quot;nda bekler.
              </p>
            </div>

            {/* Butonlar */}
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-[#272b37] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:bg-[#222632] transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={isPending || estimatedTasksCount === 0}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>{isPending ? 'Görevler Üretiliyor...' : `${estimatedTasksCount} Görevi Başlat`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
