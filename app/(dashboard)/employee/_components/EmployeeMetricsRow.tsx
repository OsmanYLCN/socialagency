import { Clock, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react'

interface EmployeeMetricsRowProps {
  inProgressCount: number
  revisionsCount: number
  pendingApprovalCount: number
  completedCount: number
  completionPercentage: number
}

export function EmployeeMetricsRow({
  inProgressCount,
  revisionsCount,
  pendingApprovalCount,
  completedCount,
  completionPercentage,
}: EmployeeMetricsRowProps) {
  const metrics = [
    {
      label: 'Üretimdeki Görevler',
      value: inProgressCount,
      badge: 'Devam Eden',
      badgeColor: 'text-indigo-600 dark:text-indigo-400',
      icon: Clock,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40',
      borderHighlight: '',
    },
    {
      label: 'Revizyon Talepleri',
      value: revisionsCount,
      badge: revisionsCount > 0 ? 'Acil Düzeltme' : 'Temiz',
      badgeColor: revisionsCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
      icon: RotateCcw,
      iconBg: revisionsCount > 0
        ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40'
        : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800',
      borderHighlight: revisionsCount > 0 ? 'border-rose-200/80 dark:border-rose-900/50 ring-1 ring-rose-500/10' : '',
    },
    {
      label: 'Onay Aşamasındakiler',
      value: pendingApprovalCount,
      badge: 'İncelemede',
      badgeColor: 'text-amber-600 dark:text-amber-400',
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40',
      borderHighlight: '',
    },
    {
      label: 'Tamamlanan İşler',
      value: completedCount,
      badge: `%${completionPercentage} Başarı`,
      badgeColor: 'text-emerald-600 dark:text-emerald-400',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40',
      borderHighlight: '',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className={`flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4.5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-[#383d4e] ${item.borderHighlight}`}
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.iconBg}`}>
              <Icon className="h-5.5 w-5.5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 leading-none">
                {item.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2 leading-none">
                <span className="text-2xl font-black tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
                  {item.value}
                </span>
                <span className={`truncate text-xs font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
