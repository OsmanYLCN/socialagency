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
      subtext: 'Hazırlanmakta olan işleriniz',
      icon: Clock,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40',
      borderHighlight: '',
    },
    {
      label: 'Revizyon Talepleri',
      value: revisionsCount,
      subtext: revisionsCount > 0 ? 'Öncelikli düzeltme bekleniyor' : 'Bekleyen revizyon yok 🎉',
      icon: RotateCcw,
      iconBg: revisionsCount > 0
        ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40'
        : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800',
      borderHighlight: revisionsCount > 0 ? 'border-rose-200/80 dark:border-rose-900/50 ring-1 ring-rose-500/10' : '',
    },
    {
      label: 'Onay Aşamasındakiler',
      value: pendingApprovalCount,
      subtext: 'İnceleme bekleyen teslimler',
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40',
      borderHighlight: '',
    },
    {
      label: 'Tamamlanan İşler',
      value: completedCount,
      subtext: `%${completionPercentage} başarı oranı`,
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
            className={`flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-[#383d4e] ${item.borderHighlight}`}
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{item.label}</p>
              <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {item.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
                {item.subtext}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
