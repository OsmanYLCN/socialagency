import { Clock, CheckCircle2, AlertCircle, PlusCircle, UserCheck } from 'lucide-react'

export interface RecentActivityItem {
  id: string
  title: string
  subtitle: string
  timeAgo: string
  type: 'task' | 'brand' | 'employee' | 'approval'
}

interface RecentActivitiesProps {
  activities?: RecentActivityItem[]
}

// Son aktiviteler panelini gösterir
export function AgencyRecentActivities({ activities = [] }: RecentActivitiesProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white dark:border-[#272b37] dark:bg-[#16181f] p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Son Aktiviteler</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Ajans içi son operasyonel hareketler ve sistem bildirimleri</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-[#272b37] dark:bg-[#1a1d25] py-10 text-center">
          <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-[#212530] dark:text-slate-400">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Henüz Bir Aktivite Kaydı Bulunmuyor</p>
          <p className="mt-1 max-w-sm text-[11px] text-slate-400 dark:text-slate-500">
            Yeni bir görev atandığında, müşteri eklendiğinde veya onay süreçlerinde gerçekleşen anlık hareketler burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((act) => {
            const Icon =
              act.type === 'brand'
                ? PlusCircle
                : act.type === 'employee'
                  ? UserCheck
                  : act.type === 'approval'
                    ? CheckCircle2
                    : AlertCircle

            const iconBg =
              act.type === 'brand'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40'
                : act.type === 'employee'
                  ? 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/40'
                  : act.type === 'approval'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40'
                    : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40'

            return (
              <div
                key={act.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/40 dark:border-[#272b37] dark:bg-[#1a1d25] dark:hover:border-[#383d4e] dark:hover:bg-[#20242e] p-3.5 transition-all hover:border-slate-300 hover:bg-white hover:shadow-xs"
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{act.title}</p>
                    <span className="shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">{act.timeAgo}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{act.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
