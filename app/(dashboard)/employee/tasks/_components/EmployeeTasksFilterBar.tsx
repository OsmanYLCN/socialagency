'use client'

import { Search, Filter, X } from 'lucide-react'
import type { BrandFilterOption } from '../../types'

interface EmployeeTasksFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedBrand: string
  onBrandChange: (brandId: string) => void
  selectedPlatform: string
  onPlatformChange: (platform: string) => void
  selectedStatus: string
  onStatusChange: (status: string) => void
  brands: BrandFilterOption[]
  activeTab: 'my_tasks' | 'pool'
  onReset: () => void
}

const PLATFORMS = [
  { value: 'all', label: 'Tüm Platformlar' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
]

const STATUSES = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'assigned', label: 'Üretimde' },
  { value: 'revision_requested', label: 'Revizyonda' },
  { value: 'pending_approval', label: 'Onay Bekliyor' },
  { value: 'completed', label: 'Tamamlandı' },
]

export function EmployeeTasksFilterBar({
  searchQuery,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  selectedPlatform,
  onPlatformChange,
  selectedStatus,
  onStatusChange,
  brands,
  activeTab,
  onReset,
}: EmployeeTasksFilterBarProps) {
  const isFiltered =
    searchQuery !== '' ||
    selectedBrand !== 'all' ||
    selectedPlatform !== 'all' ||
    (activeTab === 'my_tasks' && selectedStatus !== 'all')

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-[#272b37] dark:bg-[#16181f]">
      {/* Sol: Arama Çubuğu */}
      <div className="relative min-w-[240px] flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Marka adı, görev notu veya platform ara..."
          className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-[#1a1d25] dark:focus:ring-indigo-900/40"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Sağ: Seçim Filtreleri */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Marka Filtresi */}
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="h-9.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-200 dark:focus:ring-indigo-900/40 cursor-pointer"
        >
          <option value="all">Tüm Markalar ({brands.length})</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Platform Filtresi */}
        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="h-9.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-200 dark:focus:ring-indigo-900/40 cursor-pointer"
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Durum Filtresi (Sadece Bana Atananlar sekmesindeyken) */}
        {activeTab === 'my_tasks' && (
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-200 dark:focus:ring-indigo-900/40 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        {/* Temizle Butonu */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9.5 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-[#272b37] dark:bg-[#16181f] dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Sıfırla</span>
          </button>
        )}
      </div>
    </div>
  )
}
