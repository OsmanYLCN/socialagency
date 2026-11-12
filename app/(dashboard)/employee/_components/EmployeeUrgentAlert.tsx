import Link from 'next/link'
import { AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react'

interface EmployeeUrgentAlertProps {
  revisionsCount: number
  overdueCount: number
}

export function EmployeeUrgentAlert({ revisionsCount, overdueCount }: EmployeeUrgentAlertProps) {
  if (revisionsCount === 0 && overdueCount === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-rose-950/60 dark:bg-rose-950/20">
      <div className="flex items-start sm:items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
          {revisionsCount > 0 ? (
            <RotateCcw className="h-5 w-5 animate-spin-reverse" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
            {revisionsCount > 0 && overdueCount > 0 ? (
              <span>Dikkat: {revisionsCount} revizyon talebi ve {overdueCount} gecikmiş göreviniz var!</span>
            ) : revisionsCount > 0 ? (
              <span>Müşteri veya ajansınızdan {revisionsCount} adet revizyon talebi geldi!</span>
            ) : (
              <span>Teslim tarihi geçmiş {overdueCount} adet göreviniz bulunuyor.</span>
            )}
          </h4>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
            İş akışının aksamaması için lütfen öncelikle bu görevlerin durumunu güncelleyin veya revize içerikleri sisteme yükleyin.
          </p>
        </div>
      </div>

      <div className="shrink-0 self-end sm:self-center">
        <Link
          href={revisionsCount > 0 ? '/employee/tasks?status=revision_requested' : '/employee/tasks'}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500"
        >
          <span>İncele ve Düzelt</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
