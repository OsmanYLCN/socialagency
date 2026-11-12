'use client'

import { LayoutGrid, List, CheckSquare, Briefcase } from 'lucide-react'

interface EmployeeTasksHeaderProps {
  activeTab: 'my_tasks' | 'pool'
  onTabChange: (tab: 'my_tasks' | 'pool') => void
  activeView: 'kanban' | 'list'
  onViewChange: (view: 'kanban' | 'list') => void
  myTasksCount: number
  poolCount: number
}

export function EmployeeTasksHeader({
  activeTab,
  onTabChange,
  activeView,
  onViewChange,
  myTasksCount,
  poolCount,
}: EmployeeTasksHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-[#272b37]">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Görevlerim & İş Havuzu
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Size atanan içerik üretimlerini teslim edin, revizyonları yönetin veya iş havuzundan yeni görevler alın.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {/* Tab Switcher: Bana Atananlar vs İş Havuzu */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-[#1a1d25]">
          <button
            type="button"
            onClick={() => onTabChange('my_tasks')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'my_tasks'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Görevlerim</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-[#2c3140] dark:text-slate-300">
              {myTasksCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('pool')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pool'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>İş Havuzu</span>
            {poolCount > 0 && (
              <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {poolCount}
              </span>
            )}
          </button>
        </div>

        {/* View Switcher: Kanban vs Liste */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-[#1a1d25]">
          <button
            type="button"
            onClick={() => onViewChange('kanban')}
            title="Kanban Panosu"
            className={`rounded-lg p-1.5 transition-all cursor-pointer ${
              activeView === 'kanban'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewChange('list')}
            title="Liste Görünümü"
            className={`rounded-lg p-1.5 transition-all cursor-pointer ${
              activeView === 'list'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
