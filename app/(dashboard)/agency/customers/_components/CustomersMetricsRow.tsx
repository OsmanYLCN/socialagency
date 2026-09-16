import { Building2, TrendingUp, CheckSquare, DollarSign } from 'lucide-react'

export interface CustomerMetrics {
  totalBrands: number
  activeBrands: number
  monthlyRevenue: number
  activeTasksCount: number
}

// Musteri sayfasi ozet metrik kartlarini gosterir
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
      sub: `${activeBrands} aktif`,
      icon: Building2,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      label: 'Aktif Markalar',
      value: activeBrands,
      sub: totalBrands > 0 ? `%${Math.round((activeBrands / totalBrands) * 100)} aktiflik` : '-',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Aylık Toplam Gelir',
      value: monthlyRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }),
      sub: totalBrands > 0
        ? `Ortalama ${Math.round(monthlyRevenue / totalBrands).toLocaleString('tr-TR')} ₺`
        : '-',
      icon: DollarSign,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      isText: true,
    },
    {
      label: 'Aktif Gorevler',
      value: activeTasksCount,
      sub: 'Uretim / Onay bekleyen',
      icon: CheckSquare,
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
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="mt-0.5 truncate text-2xl font-black tracking-tight text-slate-900">
                {item.value}
              </p>
              {item.sub && (
                <p className="mt-0.5 truncate text-[11px] text-slate-400">{item.sub}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
