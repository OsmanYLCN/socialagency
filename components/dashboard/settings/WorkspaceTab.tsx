'use client'

import {
  LayoutGrid,
  List,
  Calendar,
  CalendarDays,
  Save,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react'
import {
  UserSettings,
  TaskViewMode,
  ContentViewMode,
} from '@/lib/settings'

interface WorkspaceTabProps {
  settings: UserSettings
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
  onReset: () => void
}

export function WorkspaceTab({
  settings,
  updateSetting,
  onReset,
}: WorkspaceTabProps) {
  const TASK_VIEW_OPTIONS: Array<{
    id: TaskViewMode
    title: string
    description: string
    icon: React.ElementType
  }> = [
    {
      id: 'kanban',
      title: 'Kanban Panosu',
      description: 'Görsel sütunlar ve kartlar üzerinden iş akışı takibi.',
      icon: LayoutGrid,
    },
    {
      id: 'list',
      title: 'Liste Tablosu',
      description: 'Kompakt veri satırları ve hızlı sıralanabilir tablo görünümü.',
      icon: List,
    },
  ]

  const CONTENT_VIEW_OPTIONS: Array<{
    id: ContentViewMode
    title: string
    description: string
    icon: React.ElementType
  }> = [
    {
      id: 'matrix',
      title: '7 Günlük Haftalık Matris',
      description: 'Günlük içerik slotları ve haftalık planlama matrisi.',
      icon: CalendarDays,
    },
    {
      id: 'calendar',
      title: 'Aylık Takvim',
      description: 'Tüm ayı tek bakışta gösteren geniş takvim ızgarası.',
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-8">
      {/* 1. Görev Yönetimi Varsayılan Görünümü */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <LayoutGrid className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Görev Yönetimi Varsayılan Görünümü</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Görevler sayfasına girdiğinizde ilk açılacak görünüm türünü seçin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TASK_VIEW_OPTIONS.map((opt) => {
            const isSelected = settings.defaultTaskView === opt.id
            const Icon = opt.icon

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('defaultTaskView', opt.id)}
                className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xs dark:bg-indigo-950/30 dark:border-indigo-500 dark:ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-[#272b37] dark:bg-[#1a1d25] dark:hover:border-[#383d4e] dark:hover:bg-[#222632]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-[#222632] dark:text-slate-400'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{opt.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* 2. İçerik Planı Varsayılan Görünümü */}
      <section className="space-y-3 border-t border-slate-100 dark:border-[#272b37] pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">İçerik Planı Varsayılan Görünümü</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              İçerik planlama sayfasına girdiğinizde açılacak varsayılan görünüm.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CONTENT_VIEW_OPTIONS.map((opt) => {
            const isSelected = settings.defaultContentView === opt.id
            const Icon = opt.icon

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('defaultContentView', opt.id)}
                className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xs dark:bg-indigo-950/30 dark:border-indigo-500 dark:ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-[#272b37] dark:bg-[#1a1d25] dark:hover:border-[#383d4e] dark:hover:bg-[#222632]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-[#222632] dark:text-slate-400'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{opt.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. Otomatik Taslak Kaydetme */}
      <section className="flex items-center justify-between border-t border-slate-100 dark:border-[#272b37] pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Save className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Otomatik Taslak Kaydetme</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              İçerik yazarken veya görev formu doldururken değişiklikleri anlık olarak tarayıcı taslağına kaydet.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoSaveDrafts}
            onChange={(e) => updateSetting('autoSaveDrafts', e.target.checked)}
            className="sr-only peer"
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-[#272b37] peer peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none" />
        </label>
      </section>

      {/* 4. Tüm Ayarları Sıfırlama */}
      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-rose-950/50 dark:bg-rose-950/20 pt-6">
        <div>
          <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Varsayılan Ayarlara Dön</h4>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
            Tüm tema, dil, bildirim ve çalışma alanı ayarlarınızı ilk fabrika değerlerine sıfırlar.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-700 shadow-xs hover:bg-rose-50 dark:border-rose-900/50 dark:bg-[#16181f] dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all cursor-pointer shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Tümünü Sıfırla
        </button>
      </section>
    </div>
  )
}
