import { Building2, Users, Clock, AlertCircle } from 'lucide-react'

interface MetricsProps {
  activeBrandsCount: number
  employeeCount: number
  todayTasksCount: number
  pendingApprovalCount: number
}

// Temel ajans metriklerini gösterir
export function AgencyMetricsRow({
  activeBrandsCount,
  employeeCount,
  todayTasksCount,
  pendingApprovalCount,
}: MetricsProps) {
  const metrics = [
    {
      label: 'Aktif Müşteri',
      value: activeBrandsCount,
      icon: Building2,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      label: 'Çalışan Sayısı',
      value: employeeCount,
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Bugünkü Görevler',
      value: todayTasksCount,
      icon: Clock,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      label: 'Onay Bekleyen İşler',
      value: pendingApprovalCount,
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
                {item.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
