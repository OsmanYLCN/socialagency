import { Building2 } from 'lucide-react'

export default function AgencyPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
          <Building2 className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="mb-2 text-xl font-extrabold tracking-tight text-slate-900">
          Ajans Paneli
        </h1>
        <p className="text-sm leading-relaxed text-slate-500">
          Hoş Geldiniz, Ajans Paneline giriş yaptınız. İçerikler buraya eklenecektir.
        </p>
      </div>
    </div>
  )
}
