'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  ShieldCheck,
  Smartphone,
  Monitor,
  Laptop,
  LogOut,
  Check,
  KeyRound,
  Loader2,
  Clock,
  MailCheck,
} from 'lucide-react'
import {
  getSessionSecurityInfoAction,
  terminateOtherSessionsAction,
  type SessionSecurityInfo,
} from '@/app/actions/profile'

function parseDeviceLabel(ua: string): { label: string; isMobile: boolean } {
  const lower = ua.toLowerCase()
  const isMobile = lower.includes('iphone') || lower.includes('android') || lower.includes('mobile')
  let browser = 'Web Tarayıcısı'
  if (lower.includes('edg/')) browser = 'Microsoft Edge'
  else if (lower.includes('chrome/')) browser = 'Google Chrome'
  else if (lower.includes('firefox/')) browser = 'Mozilla Firefox'
  else if (lower.includes('safari/') && !lower.includes('chrome')) browser = 'Apple Safari'

  let os = 'Bilgisayar'
  if (lower.includes('windows')) os = 'Windows'
  else if (lower.includes('mac os')) os = 'macOS'
  else if (lower.includes('iphone') || lower.includes('ipad')) os = 'iOS'
  else if (lower.includes('android')) os = 'Android'
  else if (lower.includes('linux')) os = 'Linux'

  return { label: `${browser} (${os})`, isMobile }
}

export function SecurityTab() {
  const [info, setInfo] = useState<SessionSecurityInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  const loadInfo = async () => {
    setIsLoading(true)
    try {
      const data = await getSessionSecurityInfoAction()
      setInfo(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInfo()
  }, [])

  const handleTerminateOtherSessions = () => {
    setFeedback(null)
    startTransition(async () => {
      const res = await terminateOtherSessionsAction()
      if (res.success) {
        setFeedback(
          res.removedCount && res.removedCount > 0
            ? `Mevcut cihazınız hariç diğer ${res.removedCount} aktif oturum başarıyla sonlandırıldı.`
            : 'Mevcut cihazınız dışında açık başka bir oturum bulunamadı.'
        )
        await loadInfo()
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* 1. Hesap Güvenlik ve Kimlik Doğrulama Özeti */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <KeyRound className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Hesap Güvenlik Durumu</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oturum doğrulama, e-posta onayı ve JWT kriptografik erişim koruma durumu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex items-start gap-3.5 dark:border-[#272b37] dark:bg-[#16181f]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50">
              <MailCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">E-posta & Kimlik Onayı</p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                  {info?.emailConfirmed ? 'Doğrulandı' : 'Aktif'}
                </span>
              </div>
              <p className="mt-1 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                {info?.email || 'Yükleniyor...'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                Şifrenizi üst menüdeki &quot;Kişisel Bilgiler&quot; penceresinden mevcut şifre onayıyla değiştirebilirsiniz.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex items-start gap-3.5 dark:border-[#272b37] dark:bg-[#16181f]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Oturum Kalkanı (Anti-Spoofing)</p>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60">
                  Etkin
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                Son Giriş:{' '}
                {info?.lastSignInAt
                  ? new Date(info.lastSignInAt).toLocaleString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Şu anda aktif'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                HTTP-Only çerez ve her istekte Supabase JWT doğrulaması ile korunmaktadır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Veritabanındaki Gerçek Aktif Cihazlar ve Oturumlar */}
      <section className="space-y-3 border-t border-slate-100 dark:border-[#272b37] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Monitor className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Aktif Cihazlar & Açık Oturumlar ({info?.sessions.length ?? 1})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Veritabanında hesabınıza bağlı gerçek oturum kayıtları.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isPending || isLoading}
            onClick={handleTerminateOtherSessions}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-rose-400 dark:hover:bg-[#222632] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            Diğer Oturumları Kapat
          </button>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-300 animate-in fade-in duration-150">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 dark:border-[#272b37] dark:bg-[#16181f] dark:divide-[#272b37] overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span>Aktif oturumlar yükleniyor...</span>
            </div>
          ) : !info || info.sessions.length === 0 ? (
            <div className="flex items-center justify-between p-4 bg-slate-50/40 dark:bg-[#1a1d25]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Mevcut Tarayıcı Oturumu</p>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Şu Anda Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Doğrulanmış Oturum • Son işlem: Az önce
                  </p>
                </div>
              </div>
            </div>
          ) : (
            info.sessions.map((sess) => {
              const device = parseDeviceLabel(sess.userAgent)
              const DeviceIcon = device.isMobile ? Smartphone : Laptop

              return (
                <div
                  key={sess.id}
                  className={`flex items-center justify-between p-4 ${
                    sess.isCurrent ? 'bg-slate-50/40 dark:bg-[#1a1d25]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        sess.isCurrent
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-[#222632] dark:text-slate-400'
                      }`}
                    >
                      <DeviceIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {device.label}
                        </p>
                        {sess.isCurrent && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            En Güncel Oturum
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        IP: {sess.ip} • Son aktivite:{' '}
                        {new Date(sess.updatedAt).toLocaleString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                      <Clock className="h-3 w-3" />
                      Açık
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
