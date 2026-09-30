import { Users } from 'lucide-react'
import { requireRole } from '@/lib/auth'

// Müşteri panelini gösterir
export default async function CustomerPage() {
  await requireRole('customer')

  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm dark:border-[#272b37] dark:bg-[#16181f]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30">
          <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="mb-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Müşteri Paneli
        </h1>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Hoş Geldiniz, Müşteri Paneline giriş yaptınız. İçerikler buraya eklenecektir.
        </p>
      </div>
    </div>
  )
}
