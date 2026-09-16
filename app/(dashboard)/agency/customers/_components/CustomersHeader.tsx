'use client'

import { Building2, Plus } from 'lucide-react'

interface CustomersHeaderProps {
  agencyName: string
  onAddClick: () => void
}

// Musteriler sayfasinin baslik ve eylem alanini gosterir
export function CustomersHeader({ agencyName, onAddClick }: CustomersHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Musteriler
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{agencyName}</span>{' '}
          bunyesinde yonetilen markalar ve musteri hesaplari
        </p>
      </div>
      <button
        type="button"
        onClick={onAddClick}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Yeni Musteri Ekle
      </button>
    </div>
  )
}
