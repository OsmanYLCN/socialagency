'use client'

import { Search, X, Filter, RotateCcw } from 'lucide-react'
import type { BrandOption, EmployeeOption } from './TasksClientView'

export interface TaskFilterState {
  search: string
  brandId: string
  assigneeId: string
  platform: string
  content: string
  timeFilter: string
}

interface TasksFilterBarProps {
  filters: TaskFilterState
  onFilterChange: (filters: TaskFilterState) => void
  onResetFilters: () => void
  brands: BrandOption[]
  employees: EmployeeOption[]
  totalCount: number
  filteredCount: number
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
]

const CONTENT_TYPES = [
  { value: 'reels', label: 'Reels' },
  { value: 'post', label: 'Post' },
  { value: 'story', label: 'Story' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'tweet', label: 'Tweet' },
]

export function TasksFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  brands,
  employees,
  totalCount,
  filteredCount,
}: TasksFilterBarProps) {
  const isAnyFilterActive =
    filters.search !== '' ||
    filters.brandId !== '' ||
    filters.assigneeId !== '' ||
    filters.platform !== '' ||
    filters.content !== '' ||
    filters.timeFilter !== ''

  const handleChange = (key: keyof TaskFilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      {/* Üst Sıra: Arama & Hızlı Bilgi */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Marka, görevli, brief veya platformda ara..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Aramayı temizle"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            <span className="font-bold text-slate-800">{filteredCount}</span> / {totalCount} görev listeleniyor
          </span>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Filtreleri Sıfırla
            </button>
          )}
        </div>
      </div>

      {/* Alt Sıra: Filtre Seçimleri */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {/* Marka Filtresi */}
        <div>
          <select
            value={filters.brandId}
            onChange={(e) => handleChange('brandId', e.target.value)}
            className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="">Tüm Markalar</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Görevli Personel Filtresi */}
        <div>
          <select
            value={filters.assigneeId}
            onChange={(e) => handleChange('assigneeId', e.target.value)}
            className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="">Tüm Ekip & Havuz</option>
            <option value="unassigned">📋 İş Havuzu (Atanmamış)</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                👤 {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Filtresi */}
        <div>
          <select
            value={filters.platform}
            onChange={(e) => handleChange('platform', e.target.value)}
            className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="">Tüm Platformlar</option>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* İçerik Formatı Filtresi */}
        <div>
          <select
            value={filters.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="">Tüm Formatlar</option>
            {CONTENT_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Zaman / Aciliyet Filtresi */}
        <div className="col-span-2 sm:col-span-1">
          <select
            value={filters.timeFilter}
            onChange={(e) => handleChange('timeFilter', e.target.value)}
            className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="">Tüm Zamanlar</option>
            <option value="overdue">⚠️ Sadece Gecikenler</option>
            <option value="today">📅 Bugün Teslim</option>
            <option value="this_week">🗓️ Bu Hafta Teslim</option>
          </select>
        </div>
      </div>
    </div>
  )
}
