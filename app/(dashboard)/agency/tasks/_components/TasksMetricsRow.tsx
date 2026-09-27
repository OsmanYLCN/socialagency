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
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <CheckSquare className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Toplam Görev
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 shrink-0">
              {totalTasks}
            </span>
            <span className="text-xs font-semibold text-emerald-600 shrink-0 whitespace-nowrap">
              %{completionRate} Tamamlandı
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {unassignedTasks > 0 ? `${unassignedTasks} görev iş havuzunda` : 'Tüm işler personele atandı'}
          </p>
        </div>
      </div>

      {/* 2. Üretimde Olanlar */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Clock className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Üretim Aşamasında
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 shrink-0">
              {inProgressTasks}
            </span>
            <span className="text-xs font-semibold text-blue-600 shrink-0 whitespace-nowrap">
              Devam Eden
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            Ekip tarafından hazırlanan içerikler
          </p>
        </div>
      </div>

      {/* 3. Onay & Revizyonda */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <RotateCcw className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Onay & Revizyon
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 shrink-0">
              {revisionAndPendingTasks}
            </span>
            <span className="text-xs font-semibold text-amber-600 shrink-0 whitespace-nowrap">
              İnceleme Bekleyen
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            Müşteri veya ajans kontrolündeki işler
          </p>
        </div>
      </div>

      {/* 4. Geciken Görevler */}
      <div
        className={`flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-xs transition-all ${
          overdueTasks > 0
            ? 'border-rose-200/90 bg-rose-50/20 hover:border-rose-300'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            overdueTasks > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Geciken Görevler
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black tracking-tight shrink-0 ${
                overdueTasks > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {overdueTasks}
            </span>
            {overdueTasks > 0 ? (
              <span className="text-xs font-bold text-rose-600 shrink-0 whitespace-nowrap">
                Acil Eylem Gerekli
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 shrink-0 whitespace-nowrap">
                Zamanında
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {overdueTasks > 0 ? 'Teslim tarihi geçmiş işler' : 'Geciken görev bulunmuyor'}
          </p>
        </div>
      </div>
    </div>
  )
}
