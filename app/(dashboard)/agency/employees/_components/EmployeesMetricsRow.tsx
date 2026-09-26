import { Users, UserCheck, DollarSign, CheckSquare } from 'lucide-react'

export interface EmployeeMetrics {
  totalEmployees: number
  activeEmployees: number
  totalMonthlySalary: number
  assignedTasksCount: number
}

// Calisanlar sayfasi ozet metrik kartlarini gosterir
export function EmployeesMetricsRow({
  totalEmployees,
  activeEmployees,
  totalMonthlySalary,
  assignedTasksCount,
}: EmployeeMetrics) {
  const metrics = [
    {
      label: 'Toplam Ekip',
      value: totalEmployees,
      sub: `${activeEmployees} aktif`,
      icon: Users,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      label: 'Aktif Personel',
      value: activeEmployees,
      sub:
        totalEmployees > 0
          ? `%${Math.round((activeEmployees / totalEmployees) * 100)} aktiflik`
          : '-',
      icon: UserCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Aylık Toplam Bordro',
      value: totalMonthlySalary.toLocaleString('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
      }),
      sub:
        totalEmployees > 0
          ? `Ort. ${Math.round(totalMonthlySalary / totalEmployees).toLocaleString('tr-TR')} ₺ / kişi`
          : '-',
      icon: DollarSign,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      label: 'Atanmış Aktif İşler',
      value: assignedTasksCount,
      sub: 'Üretim sürecinde',
      icon: CheckSquare,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-500">{item.label}</p>
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
