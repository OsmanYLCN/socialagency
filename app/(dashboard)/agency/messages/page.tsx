import type { Metadata } from 'next'
import { MessageSquare, Sparkles } from 'lucide-react'
import { requireAgencyOwner } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Mesajlar – SMAUP',
  description: 'Ajans içi ve müşterilerle anlık mesajlaşma modülü.',
}

export default async function AgencyMessagesPage() {
  await requireAgencyOwner()

  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 dark:border-indigo-900/40 dark:bg-indigo-950/40">
          <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-900/40">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SMAUP Connect • Çok Yakında</span>
        </div>
        <h1 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Ajans İçi & Müşteri Mesajlaşması
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Ekip üyeleri ve müşterilerinizle gerçek zamanlı sohbet, medya paylaşımı ve kanallar üzerinden doğrudan iletişim kurabileceğiniz mesajlaşma modülü sonraki sürümde aktif edilecektir.
        </p>
      </div>
    </div>
  )
}
