'use client'

import {
  Calendar as CalendarIcon,
  Plus,
  Sparkles,
  LayoutGrid,
  CalendarDays,
  Filter,
} from 'lucide-react'
import type { BrandOption } from './ContentPlanClientView'

interface ContentPlanHeaderProps {
  brands: BrandOption[]
  selectedBrandId: string
  onSelectBrand: (brandId: string) => void
  viewMode: 'matrix' | 'calendar'
  onChangeViewMode: (mode: 'matrix' | 'calendar') => void
  onOpenCreateModal: () => void
  onOpenGenerateModal: () => void
}

export function ContentPlanHeader({
  brands,
  selectedBrandId,
  onSelectBrand,
  viewMode,
  onChangeViewMode,
  onOpenCreateModal,
  onOpenGenerateModal,
}: ContentPlanHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Baslik & Aciklama */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              İçerik Planı & Strateji
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Markalarınızın haftalık rutin içerik şablonlarını yönetin ve takvim üzerinde izleyin.
            </p>
          </div>
        </div>
      </div>

      {/* Kontroller: Filtre, Gorunum Toggle & Aksiyon Butonlari */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Marka Secici Dropdown */}
        <div className="relative flex items-center">
          <Filter className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
          <select
            value={selectedBrandId}
            onChange={(e) => onSelectBrand(e.target.value)}
            className="h-10 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">Tüm Markalar ({brands.length})</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 flex items-center text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Gorunum Modu Toggle (Sablon Matrisi / Takvim) */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1 shadow-xs">
          <button
            type="button"
            onClick={() => onChangeViewMode('matrix')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-white font-semibold text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Şablon Matrisi</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('calendar')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white font-semibold text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Canlı Takvim</span>
          </button>
        </div>

        {/* Haftalik Gorevleri Uret Butonu */}
        <button
          type="button"
          onClick={onOpenGenerateModal}
          className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-xs transition-all hover:bg-indigo-100/80 hover:border-indigo-300 active:scale-98 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Haftalık Görevleri Üret</span>
        </button>

        {/* Yeni Sablon Ekle Butonu */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-98 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Şablon Ekle</span>
        </button>
      </div>
    </div>
  )
}
