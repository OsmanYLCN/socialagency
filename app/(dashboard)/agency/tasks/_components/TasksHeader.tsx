'use client'

import { LayoutGrid, List, Plus } from 'lucide-react'

interface TasksHeaderProps {
  agencyName: string
  viewMode: 'kanban' | 'list'
  onViewModeChange: (mode: 'kanban' | 'list') => void
  onNewTaskClick: () => void
}

export function TasksHeader({
  agencyName,
  viewMode,
  onViewModeChange,
  onNewTaskClick,
}: TasksHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Görev Yönetimi
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{agencyName}</span> bünyesinde üretilen tüm içerikler ve operasyonel iş akışı
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Görünüm Değiştirici: Kanban / Liste */}
        <div className="flex items-center rounded-xl border border-slate-200/90 bg-slate-100/80 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Kanban Panosu Görünümü"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Liste / Tablo Görünümü"
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Liste</span>
          </button>
        </div>

        {/* Yeni Görev Oluştur Butonu */}
        <button
          type="button"
          onClick={onNewTaskClick}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Yeni Görev Oluştur
        </button>
      </div>
    </div>
  )
}
