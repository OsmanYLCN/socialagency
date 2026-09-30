'use client'

import { useState, useEffect } from 'react'
import {
  Palette,
  Globe,
  Bell,
  ShieldCheck,
  Sliders,
  Check,
  Save,
  RotateCcw,
} from 'lucide-react'
import {
  UserSettings,
  DEFAULT_SETTINGS,
  getSavedSettings,
  saveSettings,
} from '@/lib/settings'
import { AppearanceTab } from './AppearanceTab'
import { LocalizationTab } from './LocalizationTab'

export type SettingsTabId =
  | 'appearance'
  | 'localization'
  | 'notifications'
  | 'security'
  | 'workspace'

interface SettingsTabItem {
  id: SettingsTabId
  label: string
  description: string
  icon: React.ElementType
}

const TABS: SettingsTabItem[] = [
  {
    id: 'appearance',
    label: 'Görünüm & Tema',
    description: 'Arayüz teması, yoğunluk ve animasyonlar',
    icon: Palette,
  },
  {
    id: 'localization',
    label: 'Dil & Bölge',
    description: 'Arayüz dili, saat dilimi ve tarih formatı',
    icon: Globe,
  },
  {
    id: 'notifications',
    label: 'Bildirim Tercihleri',
    description: 'E-posta ve uygulama içi bildirim kanalları',
    icon: Bell,
  },
  {
    id: 'security',
    label: 'Güvenlik & Oturumlar',
    description: 'İki adımlı doğrulama ve aktif cihazlar',
    icon: ShieldCheck,
  },
  {
    id: 'workspace',
    label: 'Çalışma Alanı',
    description: 'Varsayılan panolar ve iş akışı tercihleri',
    icon: Sliders,
  },
]

interface SettingsShellProps {
  children?: (props: {
    settings: UserSettings
    updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
    activeTab: SettingsTabId
  }) => React.ReactNode
}

export function SettingsShell({ children }: SettingsShellProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('appearance')
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [savedSettings, setSavedSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('Değişiklikler başarıyla kaydedildi.')

  // İstemci tarafında kaydedilmiş ayarları yükle
  useEffect(() => {
    const loaded = getSavedSettings()
    setSettings(loaded)
    setSavedSettings(loaded)
    setIsLoaded(true)
  }, [])

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings)

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    saveSettings(settings)
    setSavedSettings(settings)
    setToastMessage('Ayarlarınız başarıyla kaydedildi.')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    saveSettings(DEFAULT_SETTINGS)
    setSavedSettings(DEFAULT_SETTINGS)
    setToastMessage('Ayarlar varsayılan değerlere sıfırlandı.')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const activeTabMeta = TABS.find((t) => t.id === activeTab) ?? TABS[0]

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20 select-none">
      {/* Başlık Alanı */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Sistem Ayarları
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Arayüz görünümünü, bölgesel tercihleri ve bildirim kanallarını yapılandırın.
          </p>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            title="Tüm ayarları sıfırla"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            Sıfırla
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges && isLoaded}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              hasChanges
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="h-3.5 w-3.5" />
            {hasChanges ? 'Değişiklikleri Kaydet' : 'Kaydedildi'}
          </button>
        </div>
      </div>

      {/* Ana Gövde: Sol Sekmeler + Sağ İçerik */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sol Sekme Menüsü */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <nav className="flex flex-row gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-all cursor-pointer shrink-0 lg:w-full ${
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <span className="text-sm font-semibold whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Sağ İçerik Alanı */}
        <main className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
            {/* Sekme Başlığı */}
            <div className="border-b border-slate-100 pb-5 mb-6">
              <h2 className="text-lg font-bold text-slate-900">{activeTabMeta.label}</h2>
              <p className="text-xs text-slate-500 mt-1">{activeTabMeta.description}</p>
            </div>

            {/* İçerik */}
            {activeTab === 'appearance' && (
              <AppearanceTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === 'localization' && (
              <LocalizationTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab !== 'appearance' && activeTab !== 'localization' && (
              children ? (
                children({ settings, updateSetting, activeTab })
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm font-medium">Bu sekmenin içerikleri hazırlanıyor...</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Kaydedilmemiş Değişiklik Bildirim Çubuğu (Floating Bar) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 px-5 py-3.5 shadow-xl shadow-slate-900/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-xs font-semibold text-slate-700">
              Kaydedilmemiş değişiklikleriniz var.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Başarı Toast Bildirimi */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 px-4 py-3 text-white shadow-xl shadow-slate-900/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
