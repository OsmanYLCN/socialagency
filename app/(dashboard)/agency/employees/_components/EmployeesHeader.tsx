import Link from 'next/link'
import { Plus } from 'lucide-react'

interface EmployeesHeaderProps {
  agencyName: string
  onAddClick?: () => void
}

// Calisanlar sayfasinin baslik ve eylem alanini gosterir
export function EmployeesHeader({ agencyName }: EmployeesHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Ekip & Çalışanlar
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{agencyName}</span>{' '}
          bünyesinde görev yapan personel listesi ve hesap yönetimi
        </p>
      </div>
      <Link
        href="/agency/employees/new"
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Yeni Çalışan Ekle
      </Link>
    </div>
  )
}
