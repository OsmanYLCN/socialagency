'use client'

import { Mail, Volume2, Bell, CheckSquare, Calendar, BarChart2 } from 'lucide-react'
import { UserSettings } from '@/lib/settings'

interface NotificationTabProps {
  settings: UserSettings
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
}

export function NotificationTab({ settings, updateSetting }: NotificationTabProps) {
  const EMAIL_NOTIFICATIONS = [
    {
      key: 'emailTaskAssigned' as const,
      title: 'Yeni Görev Atamaları',
      description: 'Size veya ekibinize yeni bir görev atandığında anında e-posta gönder.',
      icon: CheckSquare,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      key: 'emailTaskStatusChanged' as const,
      title: 'Görev Durumu Değişiklikleri',
      description: 'Görevler revizeye gönderildiğinde veya tamamlandığında e-posta bildirimi al.',
      icon: Bell,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      key: 'emailContentApproval' as const,
      title: 'İçerik Planı Onay & Revize',
      description: 'Müşteri bir içerik taslağını onayladığında veya geri bildirim bıraktığında haber ver.',
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      key: 'emailWeeklyDigest' as const,
      title: 'Haftalık Performans Özeti',
      description: 'Her pazartesi sabahı haftalık ajans aktivite ve görev özet raporunu ilet.',
      icon: BarChart2,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  const handleDesktopNotificationToggle = (checked: boolean) => {
    updateSetting('desktopNotifications', checked)
    if (checked && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. E-posta Bildirimleri */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Mail className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">E-posta Bildirimleri</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hangi durumlarda e-posta adresinize anlık bildirim gönderileceğini seçin.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 dark:border-[#272b37] dark:bg-[#16181f] dark:divide-[#272b37] overflow-hidden shadow-xs">
          {EMAIL_NOTIFICATIONS.map((item) => {
            const Icon = item.icon
            const isChecked = settings[item.key]

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-[#1a1d25]"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color} dark:bg-opacity-20`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => updateSetting(item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-[#272b37] peer peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none" />
                </label>
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. Sistem ve Masaüstü Bildirimleri */}
      <section className="space-y-3 border-t border-slate-100 dark:border-[#272b37] pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Volume2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Uygulama İçi ve Masaüstü Bildirimleri</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tarayıcı açıkken sesli ve görsel bildirimlerin nasıl davranacağını belirleyin.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 dark:border-[#272b37] dark:bg-[#16181f] dark:divide-[#272b37] overflow-hidden shadow-xs">
          {/* Bildirim Sesleri */}
          <div className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-[#1a1d25]">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-[#1a1d25] dark:text-slate-300">
                <Volume2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Bildirim Sesleri</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Yeni bir mesaj, görev veya bildirim geldiğinde hafif bir ses uyarısı çal.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-[#272b37] peer peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none" />
            </label>
          </div>

          {/* Masaüstü Anlık Bildirimleri */}
          <div className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-[#1a1d25]">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Bell className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Masaüstü Anlık Bildirimleri</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Platform sekmesi arka planda kalsa dahi masaüstünüze anlık bildirim kutucuğu gönder.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.desktopNotifications}
                onChange={(e) => handleDesktopNotificationToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-[#272b37] peer peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none" />
            </label>
          </div>
        </div>
      </section>
    </div>
  )
}
