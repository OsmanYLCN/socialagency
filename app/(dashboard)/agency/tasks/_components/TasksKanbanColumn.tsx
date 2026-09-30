'use client'

import { TaskCard } from './TaskCard'
import type { TaskItem, EmployeeOption } from './TasksClientView'

interface ColumnConfig {
  id: TaskItem['status']
  title: string
  badgeColor: string
  dotColor: string
  borderColor: string
}

interface TasksKanbanColumnProps {
  config: ColumnConfig
  tasks: TaskItem[]
  employees: EmployeeOption[]
  onTaskClick: (task: TaskItem) => void
  onEditClick: (task: TaskItem) => void
  onDeleteClick: (task: TaskItem) => void
}

export function TasksKanbanColumn({
  config,
  tasks,
  employees,
  onTaskClick,
  onEditClick,
  onDeleteClick,
}: TasksKanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] flex-1 rounded-2xl bg-slate-100/70 p-3 border border-slate-200/60 dark:bg-[#14161d] dark:border-[#272b37]">
      {/* Sütun Başlığı */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{config.title}</h3>
        </div>
        <span
          className={`inline-flex h-5 items-center justify-center rounded-full px-2 text-[11px] font-bold ${config.badgeColor}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Görev Kartları Listesi */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 p-6 text-center dark:border-[#272b37] dark:bg-[#16181f]/40">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Bu aşamada görev yok</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              employees={employees}
              onTaskClick={onTaskClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          ))
        )}
      </div>
    </div>
  )
}
