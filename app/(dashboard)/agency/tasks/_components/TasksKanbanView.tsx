'use client'

import { useMemo } from 'react'
import { TasksKanbanColumn } from './TasksKanbanColumn'
import type { TaskItem, EmployeeOption } from './TasksClientView'

interface TasksKanbanViewProps {
  tasks: TaskItem[]
  employees: EmployeeOption[]
  onTaskClick: (task: TaskItem) => void
  onEditClick: (task: TaskItem) => void
  onDeleteClick: (task: TaskItem) => void
}

const COLUMNS_CONFIG: {
  id: TaskItem['status']
  title: string
  badgeColor: string
  dotColor: string
  borderColor: string
}[] = [
  {
    id: 'unassigned',
    title: 'İş Havuzu',
    badgeColor: 'bg-slate-200 text-slate-700',
    dotColor: 'bg-slate-400',
    borderColor: 'border-slate-300',
  },
  {
    id: 'assigned',
    title: 'Üretimde',
    badgeColor: 'bg-blue-100 text-blue-700',
    dotColor: 'bg-blue-500',
    borderColor: 'border-blue-300',
  },
  {
    id: 'pending_approval',
    title: 'Onay Bekliyor',
    badgeColor: 'bg-amber-100 text-amber-700',
    dotColor: 'bg-amber-500',
    borderColor: 'border-amber-300',
  },
  {
    id: 'revision_requested',
    title: 'Revizyonda',
    badgeColor: 'bg-rose-100 text-rose-700',
    dotColor: 'bg-rose-500',
    borderColor: 'border-rose-300',
  },
  {
    id: 'completed',
    title: 'Tamamlandı',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    dotColor: 'bg-emerald-500',
    borderColor: 'border-emerald-300',
  },
]

export function TasksKanbanView({
  tasks,
  employees,
  onTaskClick,
  onEditClick,
  onDeleteClick,
}: TasksKanbanViewProps) {
  // Görevleri durumlarına göre grupla
  const groupedTasks = useMemo(() => {
    const map: Record<TaskItem['status'], TaskItem[]> = {
      unassigned: [],
      assigned: [],
      pending_approval: [],
      revision_requested: [],
      completed: [],
    }

    for (const task of tasks) {
      if (map[task.status]) {
        map[task.status].push(task)
      } else {
        map.unassigned.push(task)
      }
    }

    return map
  }, [tasks])

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start select-none">
      {COLUMNS_CONFIG.map((col) => (
        <TasksKanbanColumn
          key={col.id}
          config={col}
          tasks={groupedTasks[col.id] || []}
          employees={employees}
          onTaskClick={onTaskClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  )
}
