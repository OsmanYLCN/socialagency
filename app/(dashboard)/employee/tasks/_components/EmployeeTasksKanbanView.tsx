'use client'

import { Clock, RotateCcw, AlertCircle, CheckCircle2, Briefcase } from 'lucide-react'
import type { EmployeeTaskItem } from '../../types'
import { EmployeeTaskCard } from './EmployeeTaskCard'

interface EmployeeTasksKanbanViewProps {
  tasks: EmployeeTaskItem[]
  activeTab: 'my_tasks' | 'pool'
  onTaskClick: (task: EmployeeTaskItem) => void
  onClaimClick?: (task: EmployeeTaskItem) => void
}

interface ColumnConfig {
  id: EmployeeTaskItem['status']
  title: string
  icon: React.ElementType
  colorClasses: {
    header: string
    badge: string
    dot: string
    border: string
  }
}

const MY_TASK_COLUMNS: ColumnConfig[] = [
  {
    id: 'assigned',
    title: 'Üretimde',
    icon: Clock,
    colorClasses: {
      header: 'text-blue-700 dark:text-blue-300',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
      dot: 'bg-blue-500',
      border: 'border-blue-200/60 dark:border-blue-900/40',
    },
  },
  {
    id: 'revision_requested',
    title: 'Revizyonda',
    icon: RotateCcw,
    colorClasses: {
      header: 'text-rose-700 dark:text-rose-300',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300',
      dot: 'bg-rose-500',
      border: 'border-rose-200/60 dark:border-rose-900/40',
    },
  },
  {
    id: 'pending_approval',
    title: 'Onay Bekliyor',
    icon: AlertCircle,
    colorClasses: {
      header: 'text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
      dot: 'bg-amber-500',
      border: 'border-amber-200/60 dark:border-amber-900/40',
    },
  },
  {
    id: 'completed',
    title: 'Tamamlandı',
    icon: CheckCircle2,
    colorClasses: {
      header: 'text-emerald-700 dark:text-emerald-300',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200/60 dark:border-emerald-900/40',
    },
  },
]

export function EmployeeTasksKanbanView({
  tasks,
  activeTab,
  onTaskClick,
  onClaimClick,
}: EmployeeTasksKanbanViewProps) {
  if (activeTab === 'pool') {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 dark:border-[#272b37] dark:bg-[#16181f]/40">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Ajans İş Havuzu ({tasks.length} Görev)
          </h3>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-[#272b37] dark:bg-[#16181f]">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              İş havuzunda şu an açık görev yok
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Ajans yöneticiniz yeni bir içerik görevi ürettiğinde burada listelenecektir.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <EmployeeTaskCard
                key={task.id}
                task={task}
                isPoolTask={true}
                onTaskClick={onTaskClick}
                onClaimClick={onClaimClick}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {MY_TASK_COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id)
        const Icon = col.icon

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-[#272b37] dark:bg-[#1a1d25]/60"
          >
            {/* Kolon Başlığı */}
            <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 dark:border-[#272b37]/80">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.colorClasses.dot}`} />
                <Icon className={`h-4 w-4 ${col.colorClasses.header}`} />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${col.colorClasses.header}`}>
                  {col.title}
                </h3>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${col.colorClasses.badge}`}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Kolon Kartları */}
            <div className="mt-3 space-y-3 min-h-[220px]">
              {colTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200/80 bg-white/40 p-4 text-center dark:border-[#272b37] dark:bg-[#16181f]/40">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Görev yok
                  </span>
                </div>
              ) : (
                colTasks.map((task) => (
                  <EmployeeTaskCard
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
