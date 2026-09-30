'use client'

import { CheckSquare, Clock, RotateCcw, AlertTriangle } from 'lucide-react'
import type { TasksMetrics } from './TasksClientView'

export function TasksMetricsRow({
  totalTasks,
  inProgressTasks,
  revisionAndPendingTasks,
  overdueTasks,
  unassignedTasks,
  completedTasks,
}: TasksMetrics) {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Toplam Görev */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-[#383d4e]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:border dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
          <CheckSquare className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Toplam Görev
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 shrink-0 dark:text-slate-100">
              {totalTasks}
            </span>
            <span className="text-xs font-semibold text-emerald-600 shrink-0 whitespace-nowrap dark:text-emerald-400">
              %{completionRate} Tamamlandı
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
            {unassignedTasks > 0 ? `${unassignedTasks} görev iş havuzunda` : 'Tüm işler personele atandı'}
          </p>
        </div>
      </div>

      {/* 2. Üretimde Olanlar */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-[#383d4e]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:border dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
          <Clock className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Üretim Aşamasında
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 shrink-0 dark:text-slate-100">
              {inProgressTasks}
            </span>
            <span className="text-xs font-semibold text-blue-600 shrink-0 whitespace-nowrap dark:text-blue-400">
              Devam Eden
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
            Ekip tarafından hazırlanan içerikler
          </p>
        </div>
      </div>

      {/* 3. Onay & Revizyonda */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-[#383d4e]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:border dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <RotateCcw className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Onay & Revizyon
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 shrink-0 dark:text-slate-100">
              {revisionAndPendingTasks}
            </span>
            <span className="text-xs font-semibold text-amber-600 shrink-0 whitespace-nowrap dark:text-amber-400">
              İnceleme Bekleyen
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
            Müşteri veya ajans kontrolündeki işler
          </p>
        </div>
      </div>

      {/* 4. Geciken Görevler */}
      <div
        className={`flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-xs transition-all dark:bg-[#16181f] ${
          overdueTasks > 0
            ? 'border-rose-200/90 bg-rose-50/20 hover:border-rose-300 dark:border-rose-900/50 dark:bg-rose-950/20 dark:hover:border-rose-800'
            : 'border-slate-200/80 hover:border-slate-300 dark:border-[#272b37] dark:hover:border-[#383d4e]'
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            overdueTasks > 0
              ? 'bg-rose-100 text-rose-600 dark:border dark:border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400'
              : 'bg-slate-100 text-slate-500 dark:border dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-400'
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Geciken Görevler
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black tracking-tight shrink-0 ${
                overdueTasks > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {overdueTasks}
            </span>
            {overdueTasks > 0 ? (
              <span className="text-xs font-bold text-rose-600 shrink-0 whitespace-nowrap dark:text-rose-400">
                Acil Eylem Gerekli
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 shrink-0 whitespace-nowrap dark:text-emerald-400">
                Zamanında
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
            {overdueTasks > 0 ? 'Teslim tarihi geçmiş işler' : 'Geciken görev bulunmuyor'}
          </p>
        </div>
      </div>
    </div>
  )
}
