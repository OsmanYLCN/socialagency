import { Building2, TrendingUp, CheckSquare, DollarSign } from 'lucide-react'

export interface CustomerMetrics {
  totalBrands: number
  activeBrands: number
  monthlyRevenue: number
  activeTasksCount: number
}

// Müşteri sayfası özet metrik kartlarını gösterir
export function CustomersMetricsRow({
  totalBrands,
  activeBrands,
  monthlyRevenue,
  activeTasksCount,
}: CustomerMetrics) {
  const metrics = [
    {
      label: 'Toplam Marka',
      value: totalBrands,
      badge: `${activeBrands} Aktif`,
      badgeColor: 'text-indigo-600 dark:text-indigo-400',
      icon: Building2,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50',
    },
    {
      label: 'Aktif Markalar',
      value: activeBrands,
      badge: totalBrands > 0 ? `%${Math.round((activeBrands / totalBrands) * 100)} Oran` : null,
      badgeColor: 'text-emerald-600 dark:text-emerald-400',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50',
    },
    {
      label: 'Aylık Toplam Gelir',
      value: monthlyRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }),
      badge: null,
      badgeColor: 'text-sky-600 dark:text-sky-400',
      icon: DollarSign,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-900/50',
    },
    {
      label: 'Aktif Görevler',
      value: activeTasksCount,
      badge: 'Üretimde',
      badgeColor: 'text-amber-600 dark:text-amber-400',
      icon: CheckSquare,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4.5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-slate-700"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.iconBg}`}>
              <Icon className="h-5.5 w-5.5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 leading-none">
                {item.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2 leading-none">
                <span className="truncate text-2xl font-black tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
                  {item.value}
                </span>
                {item.badge && (
                  <span className={`truncate text-xs font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
