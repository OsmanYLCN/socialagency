import type { Metadata } from 'next'
import { Video, Sparkles } from 'lucide-react'
import { requireAgencyOwner } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Toplantılar – SMAUP',
  description: 'Ajans ve müşteri video görüşme ve randevu planlama modülü.',
}

export default async function AgencyMeetingsPage() {
  await requireAgencyOwner()

  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/40">
          <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 mb-3 border border-blue-200/60 dark:border-blue-900/40">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SMAUP Meet • Çok Yakında</span>
        </div>
        <h1 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Online Görüşmeler & Takvim
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Müşterilerinizle periyodik değerlendirme toplantıları organize edebileceğiniz, Google Meet ve Zoom entegrasyonlu toplantı odası modülü geliştirilmektedir.
        </p>
      </div>
    </div>
  )
}
