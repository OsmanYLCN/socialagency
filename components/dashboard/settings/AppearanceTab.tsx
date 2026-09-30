'use client'

import { Sun, Moon, Laptop, Sparkles, Check } from 'lucide-react'
import { UserSettings, ThemeMode, DensityMode } from '@/lib/settings'

interface AppearanceTabProps {
  settings: UserSettings
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
}

export function AppearanceTab({ settings, updateSetting }: AppearanceTabProps) {
  const THEME_OPTIONS: Array<{
    id: ThemeMode
    title: string
    description: string
    icon: React.ElementType
    preview: React.ReactNode
  }> = [
    {
      id: 'light',
      title: 'Açık Tema',
      description: 'Ferah ve aydınlık çalışma ortamı',
      icon: Sun,
      preview: (
        <div className="h-20 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <div className="h-2 w-8 rounded-full bg-slate-200" />
            <div className="h-2 w-4 rounded-full bg-indigo-500" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full rounded bg-slate-100" />
            <div className="h-2 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ),
    },
    {
      id: 'dark',
      title: 'Koyu Tema',
      description: 'Gözü yormayan modern karanlık mod',
      icon: Moon,
      preview: (
        <div className="h-20 w-full rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <div className="h-2 w-8 rounded-full bg-slate-700" />
            <div className="h-2 w-4 rounded-full bg-indigo-500" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full rounded bg-slate-800" />
            <div className="h-2 w-2/3 rounded bg-slate-800" />
          </div>
        </div>
      ),
    },
    {
      id: 'system',
      title: 'Sistem Teması',
      description: 'Cihaz ayarınıza göre otomatik değişir',
      icon: Laptop,
      preview: (
        <div className="h-20 w-full rounded-xl border border-slate-200 overflow-hidden shadow-xs flex">
          <div className="w-1/2 bg-white p-2 flex flex-col justify-between border-r border-slate-200">
            <div className="h-2 w-6 rounded bg-slate-200" />
            <div className="h-2 w-8 rounded bg-slate-100" />
          </div>
          <div className="w-1/2 bg-slate-900 p-2 flex flex-col justify-between">
            <div className="h-2 w-6 rounded bg-slate-700" />
            <div className="h-2 w-8 rounded bg-slate-800" />
          </div>
        </div>
      ),
    },
  ]

  const DENSITY_OPTIONS: Array<{
    id: DensityMode
    title: string
    description: string
  }> = [
    {
      id: 'comfortable',
      title: 'Rahat (Comfortable)',
      description: 'Geniş boşluklar, standart kart boyutları ve ferah yerleşim.',
    },
    {
      id: 'compact',
      title: 'Kompakt (Compact)',
      description: 'Sıkıştırılmış satırlar ve tek ekranda daha fazla bilgi görünümü.',
    },
  ]

  return (
    <div className="space-y-8">
      {/* 1. Tema Seçimi */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Arayüz Teması</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Platformun genel renk temasını ve gece/gündüz görünümünü seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = settings.theme === opt.id
            const Icon = opt.icon

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('theme', opt.id)}
                className={`relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xs dark:bg-indigo-950/30 dark:border-indigo-500 dark:ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                {/* Canlı Önizleme */}
                {opt.preview}

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{opt.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{opt.description}</p>
                  </div>

                  {isSelected && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* 2. Arayüz Yoğunluğu */}
      <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Arayüz Yoğunluğu</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tablo ve listelerdeki satır aralıklarını ve veri sıkışıklığını ayarlayın.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DENSITY_OPTIONS.map((opt) => {
            const isSelected = settings.density === opt.id

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('density', opt.id)}
                className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 dark:bg-indigo-950/30 dark:border-indigo-500 dark:ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{opt.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{opt.description}</p>
                </div>

                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                  }`}
                >
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. Akıcı Animasyonlar */}
      <section className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Akıcı Animasyonlar</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Sayfa geçişleri, menü daralma ve mikro etkileşim animasyonlarını etkinleştirir.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.animations}
            onChange={(e) => updateSetting('animations', e.target.checked)}
            className="sr-only peer"
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-700 peer peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none" />
        </label>
      </section>
    </div>
  )
}
