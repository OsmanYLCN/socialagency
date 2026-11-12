import { Calendar, CheckCircle2 } from 'lucide-react'
import type { EmployeeTaskItem } from '../types'

interface EmployeeWeeklyScheduleProps {
  tasks: EmployeeTaskItem[]
}

const DAYS = [
  { dayIndex: 1, label: 'Pzt' },
  { dayIndex: 2, label: 'Sal' },
  { dayIndex: 3, label: 'Çar' },
  { dayIndex: 4, label: 'Per' },
  { dayIndex: 5, label: 'Cum' },
  { dayIndex: 6, label: 'Cmt' },
  { dayIndex: 0, label: 'Paz' },
]

export function EmployeeWeeklySchedule({ tasks }: EmployeeWeeklyScheduleProps) {
  // Bu haftanın Pazartesi gününü bul
  const now = new Date()
  const todayDay = now.getDay()
  const diffToMonday = todayDay === 0 ? -6 : 1 - todayDay
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const weekDays = DAYS.map((d, index) => {
    const currentDay = new Date(monday)
    currentDay.setDate(monday.getDate() + index)
    const dateStr = currentDay.toISOString().slice(0, 10)
    const isToday = currentDay.toDateString() === now.toDateString()

    const dayTasks = tasks.filter((t) => {
      const taskDate = t.due_date.slice(0, 10)
      return taskDate === dateStr
    })

    return {
      name: d.label,
      dateNum: currentDay.getDate(),
      isToday,
      tasks: dayTasks,
    }
  })

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#272b37]">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Haftalık Teslim Takvimim
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Bu Hafta
        </span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {weekDays.map((wd) => (
          <div
            key={wd.name}
            className={`flex flex-col items-center rounded-xl p-2 transition-all ${
              wd.isToday
                ? 'bg-indigo-50 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/60'
                : 'bg-slate-50/50 hover:bg-slate-100/60 dark:bg-[#1a1d25]/50 dark:hover:bg-[#202430]'
            }`}
          >
            <span className={`text-[10px] font-semibold uppercase ${
              wd.isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {wd.name}
            </span>
            <span className={`mt-0.5 text-xs font-bold ${
              wd.isToday ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {wd.dateNum}
            </span>

            {/* Görev adet noktası */}
            <div className="mt-1 flex items-center justify-center min-h-[16px]">
              {wd.tasks.length > 0 ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-xs">
                  {wd.tasks.length}
                </span>
              ) : (
                <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bu haftaki yaklaşan işler özeti */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-[#272b37]">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Yaklaşan Teslimler
        </p>
        {tasks.filter(t => t.status !== 'completed').slice(0, 3).length === 0 ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 py-1">
            Bu hafta bekleyen teslim göreviniz yok.
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {task.brand_name} ({task.content})
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                  {new Date(task.due_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
