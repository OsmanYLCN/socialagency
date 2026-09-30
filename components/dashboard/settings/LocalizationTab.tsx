'use client'

import { Check, Clock, CalendarDays } from 'lucide-react'
import {
  UserSettings,
  LanguageMode,
  DateFormatMode,
  WeekStartMode,
} from '@/lib/settings'

interface LocalizationTabProps {
  settings: UserSettings
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
}

export function LocalizationTab({ settings, updateSetting }: LocalizationTabProps) {
  const TIMEZONES = [
    { value: 'Europe/Istanbul', label: 'İstanbul (GMT+3)' },
    { value: 'Europe/London', label: 'Londra (GMT+0)' },
    { value: 'Europe/Berlin', label: 'Berlin / Paris (GMT+1)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  ]

  const DATE_FORMATS: Array<{ id: DateFormatMode; label: string; sample: string }> = [
    { id: 'DD.MM.YYYY', label: 'Gün.Ay.Yıl', sample: '30.09.2026' },
    { id: 'YYYY-MM-DD', label: 'Yıl-Ay-Gün', sample: '2026-09-30' },
    { id: 'MM/DD/YYYY', label: 'Ay/Gün/Yıl', sample: '09/30/2026' },
  ]

  return (
    <div className="space-y-8">
      {/* 1. Arayüz Dili */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Arayüz Dili</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Menülerin, butonların ve sistem etiketlerinin görüntüleneceği dili seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Türkçe */}
          <button
            type="button"
            onClick={() => updateSetting('language', 'tr' as LanguageMode)}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
              settings.language === 'tr'
                ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-xs font-black text-red-600 border border-red-200/50">
                TR
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">Türkçe</p>
                <p className="text-[11px] text-slate-400">Varsayılan sistem dili</p>
              </div>
            </div>

            {settings.language === 'tr' && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            )}
          </button>

          {/* English */}
          <button
            type="button"
            onClick={() => updateSetting('language', 'en' as LanguageMode)}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
              settings.language === 'en'
                ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-600 border border-blue-200/50">
                EN
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">English</p>
                <p className="text-[11px] text-slate-400">International English</p>
              </div>
            </div>

            {settings.language === 'en' && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </section>

      {/* 2. Saat Dilimi */}
      <section className="space-y-3 border-t border-slate-100 pt-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Saat Dilimi (Timezone)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            İçerik planlama takvimi ve görev teslim tarihleri bu saat dilimine göre hesaplanır.
          </p>
        </div>

        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Clock className="h-4 w-4" />
          </div>
          <select
            value={settings.timezone}
            onChange={(e) => updateSetting('timezone', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 shadow-xs transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 3. Tarih Formatı */}
      <section className="space-y-3 border-t border-slate-100 pt-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Tarih Formatı</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tarihlerin arayüzde nasıl gösterileceğini belirleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DATE_FORMATS.map((df) => {
            const isSelected = settings.dateFormat === df.id

            return (
              <button
                key={df.id}
                type="button"
                onClick={() => updateSetting('dateFormat', df.id)}
                className={`flex flex-col gap-1 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">{df.label}</p>
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  )}
                </div>
                <p className="text-xs font-mono text-indigo-600 font-semibold mt-1">
                  {df.sample}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* 4. Haftanın Başlangıç Günü */}
      <section className="space-y-3 border-t border-slate-100 pt-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Haftanın Başlangıç Günü</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            İçerik planı matrisi ve takvim görünümleri için ilk sütun günü.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => updateSetting('weekStart', 'monday' as WeekStartMode)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              settings.weekStart === 'monday'
                ? 'border-indigo-600 bg-indigo-50/30 text-indigo-700 ring-2 ring-indigo-600/20'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Pazartesi (Varsayılan)
          </button>

          <button
            type="button"
            onClick={() => updateSetting('weekStart', 'sunday' as WeekStartMode)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              settings.weekStart === 'sunday'
                ? 'border-indigo-600 bg-indigo-50/30 text-indigo-700 ring-2 ring-indigo-600/20'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Pazar
          </button>
        </div>
      </section>
    </div>
  )
}
