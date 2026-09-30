'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  Smartphone,
  Monitor,
  Laptop,
  LogOut,
  AlertCircle,
  Check,
  KeyRound,
} from 'lucide-react'

export function SecurityTab() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [sessionTerminated, setSessionTerminated] = useState(false)

  const handleTerminateOtherSessions = () => {
    setSessionTerminated(true)
    setTimeout(() => setSessionTerminated(false), 4000)
  }

  return (
    <div className="space-y-8">
      {/* 1. İki Adımlı Doğrulama (2FA) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <KeyRound className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">İki Adımlı Doğrulama (2FA)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hesabınıza giriş yaparken şifrenize ek olarak tek kullanımlık doğrulama kodu isteyerek güvenliği artırın.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:border-[#272b37] dark:bg-[#16181f]">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Authenticator Uygulaması (TOTP)</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    is2FAEnabled
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                      : 'bg-slate-100 text-slate-600 dark:bg-[#1a1d25] dark:text-slate-400'
                  }`}
                >
                  {is2FAEnabled ? 'Aktif' : 'Devre Dışı'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Google Authenticator, Apple Passwords veya 1Password gibi TOTP destekli uygulamalarla giriş güvenliğinizi en üst seviyeye çıkarın.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (is2FAEnabled) {
                setIs2FAEnabled(false)
              } else {
                setShow2FAModal(true)
              }
            }}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              is2FAEnabled
                ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none'
            }`}
          >
            {is2FAEnabled ? '2FA Devre Dışı Bırak' : '2FA Etkinleştir'}
          </button>
        </div>
      </section>

      {/* 2. Aktif Cihazlar ve Oturumlar */}
      <section className="space-y-3 border-t border-slate-100 dark:border-[#272b37] pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Monitor className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Aktif Cihazlar & Oturumlar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hesabınıza şu anda bağlı olan oturumları ve cihazları yönetin.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTerminateOtherSessions}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-rose-400 dark:hover:bg-[#222632] transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            Diğer Oturumları Kapat
          </button>
        </div>

        {sessionTerminated && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-300 animate-in fade-in duration-150">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            Mevcut cihazınız hariç diğer tüm cihazlardaki açık oturumlar sonlandırıldı.
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 dark:border-[#272b37] dark:bg-[#16181f] dark:divide-[#272b37] overflow-hidden shadow-xs">
          {/* Bu Cihaz (Aktif) */}
          <div className="flex items-center justify-between p-4 bg-slate-50/40 dark:bg-[#1a1d25]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Chrome on Windows (Bu Cihaz)</p>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Şu Anda Aktif
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  İstanbul, Türkiye • IP: 10.74.***.*** • Son işlem: Az önce
                </p>
              </div>
            </div>
          </div>

          {/* Diğer Cihaz */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-[#1a1d25] dark:text-slate-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Safari on iPhone (Mobil)</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  İstanbul, Türkiye • Son görülme: 2 gün önce
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Beklemede</span>
          </div>
        </div>
      </section>

      {/* 2FA Kurulum Modalı */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 dark:border-[#272b37] dark:bg-[#16181f]">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#272b37] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">İki Adımlı Doğrulama Kurulumu</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Authenticator uygulamanızı bağlayın</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                1. Telefonunuzdaki Authenticator uygulamasını (Google Authenticator, Apple Passwords vb.) açın.
              </p>
              <div className="flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-6 text-center dark:bg-[#14161d] dark:border-[#272b37]">
                <div className="space-y-1">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-[#1a1d25] dark:border-[#272b37]">
                    <KeyRound className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2">KOD: SMAUP-SEC-7729-AUTH</p>
                </div>
              </div>
              <p>2. Uygulamanın ürettiği 6 haneli kodu her girişte kullanacaksınız.</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#272b37]">
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-[#272b37] dark:text-slate-300 dark:hover:bg-[#222632] cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  setIs2FAEnabled(true)
                  setShow2FAModal(false)
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 cursor-pointer"
              >
                Etkinleştirmeyi Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
