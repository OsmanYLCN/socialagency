'use client'

import { useState, useMemo, useEffect } from 'react'
import { TasksHeader } from './TasksHeader'
import { TasksMetricsRow } from './TasksMetricsRow'
import { TasksFilterBar, TaskFilterState } from './TasksFilterBar'
import { TasksKanbanView } from './TasksKanbanView'
import { TasksListView } from './TasksListView'
import { CreateTaskModal } from './CreateTaskModal'
import { TaskDetailModal } from './TaskDetailModal'
import { EditTaskModal } from './EditTaskModal'
import { DeleteTaskModal } from './DeleteTaskModal'
import { getLocalDateString } from '@/lib/utils'
import { getSavedSettings } from '@/lib/settings'

export interface TaskCommentItem {
  id: string
  profileId: string
  authorName: string
  authorRole: string
  commentText: string
  createdAt: string
}

export interface TaskRevisionItem {
  id: string
  previousUrl: string
  customerNote: string
  createdAt: string
}

export interface TaskItem {
  id: string
  brandId: string
  brandName: string
  assigneeId: string | null
  assigneeName: string | null
  assigneeEmail: string | null
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'x' | 'youtube'
  content: 'reels' | 'post' | 'story' | 'shorts' | 'tweet' | 'carousel'
  dueDate: string
  status: 'unassigned' | 'assigned' | 'pending_approval' | 'revision_requested' | 'completed'
  contentUrl: string | null
  assignmentNote: string | null
  createdAt: string | null
  commentsCount: number
  revisionsCount: number
  comments: TaskCommentItem[]
  revisions: TaskRevisionItem[]
}

export interface BrandOption {
  id: string
  name: string
}

export interface EmployeeOption {
  id: string
  name: string
  email: string
}

export interface TasksMetrics {
  totalTasks: number
  inProgressTasks: number
  revisionAndPendingTasks: number
  overdueTasks: number
  unassignedTasks: number
  completedTasks: number
}

export interface TasksClientViewProps {
  agencyName: string
  tasks: TaskItem[]
  brands: BrandOption[]
  employees: EmployeeOption[]
  metrics: TasksMetrics
  initialTaskId?: string
  initialBrandId?: string
}

const INITIAL_FILTERS: TaskFilterState = {
  search: '',
  brandId: '',
  assigneeId: '',
  platform: '',
  content: '',
  timeFilter: '',
}

export function TasksClientView({
  agencyName,
  tasks,
  brands,
  employees,
  metrics,
  initialTaskId,
  initialBrandId,
}: TasksClientViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [filters, setFilters] = useState<TaskFilterState>(() => ({
    ...INITIAL_FILTERS,
    brandId: initialBrandId || '',
  }))

  // Kullanıcının Ayarlar -> Çalışma Alanı sekmesinde seçtiği varsayılan görünümü uygula
  useEffect(() => {
    const saved = getSavedSettings()
    if (saved.defaultTaskView === 'kanban' || saved.defaultTaskView === 'list') {
      setViewMode(saved.defaultTaskView)
    }
  }, [])

  // Modal durumları
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [detailTask, setDetailTask] = useState<TaskItem | null>(() => {
    if (initialTaskId) {
      return tasks.find((t) => t.id === initialTaskId) ?? null
    }
    return null
  })
  const [editTask, setEditTask] = useState<TaskItem | null>(null)
  const [deleteTask, setDeleteTask] = useState<TaskItem | null>(null)

  // URL üzerinden gelen ?taskId veya ?brandId değiştiğinde modal/filtreyi senkronize et
  useEffect(() => {
    if (initialTaskId) {
      const target = tasks.find((t) => t.id === initialTaskId)
      if (target) {
        setDetailTask(target)
      }
    }
  }, [initialTaskId, tasks])

  useEffect(() => {
    if (initialBrandId) {
      setFilters((prev) => ({ ...prev, brandId: initialBrandId }))
    }
  }, [initialBrandId])

  // Server revalidation sonrası seçili görevin güncel verilerini senkronize et
  useEffect(() => {
    if (detailTask) {
      const updated = tasks.find((t) => t.id === detailTask.id)
      if (updated) {
        setDetailTask(updated)
      } else {
        setDetailTask(null)
      }
    }
  }, [tasks])

  // Filtrelenmiş görevleri hesapla (Türkçe locale duyarlı)
  const filteredTasks = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('tr-TR')
    const todayStr = getLocalDateString()
    const now = new Date()
    const endOfWeek = new Date(now)
    endOfWeek.setDate(now.getDate() + 7)
    const endOfWeekStr = getLocalDateString(endOfWeek)

    return tasks.filter((t) => {
      if (query) {
        const brandMatch = t.brandName.toLocaleLowerCase('tr-TR').includes(query)
        const assigneeMatch = (t.assigneeName ?? '').toLocaleLowerCase('tr-TR').includes(query)
        const platformMatch = t.platform.toLocaleLowerCase('tr-TR').includes(query)
        const contentMatch = t.content.toLocaleLowerCase('tr-TR').includes(query)
        const noteMatch = (t.assignmentNote ?? '').toLocaleLowerCase('tr-TR').includes(query)
        if (!brandMatch && !assigneeMatch && !platformMatch && !contentMatch && !noteMatch) {
          return false
        }
      }

      if (filters.brandId && t.brandId !== filters.brandId) {
        return false
      }

      if (filters.assigneeId) {
        if (filters.assigneeId === 'unassigned') {
          if (t.assigneeId !== null) return false
        } else if (t.assigneeId !== filters.assigneeId) {
          return false
        }
      }

      if (filters.platform && t.platform !== filters.platform) {
        return false
      }

      if (filters.content && t.content !== filters.content) {
        return false
      }

      if (filters.timeFilter) {
        if (!t.dueDate) return false
        const dueStr = t.dueDate.slice(0, 10)
        if (filters.timeFilter === 'overdue') {
          if (t.status === 'completed' || dueStr >= todayStr) return false
        } else if (filters.timeFilter === 'today') {
          if (dueStr !== todayStr) return false
        } else if (filters.timeFilter === 'this_week') {
          if (dueStr < todayStr || dueStr > endOfWeekStr) return false
        }
      }

      return true
    })
  }, [tasks, filters])

  return (
    <div className="space-y-6">
      <TasksHeader
        agencyName={agencyName}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewTaskClick={() => setIsCreateOpen(true)}
      />

      <TasksMetricsRow {...metrics} />

      <TasksFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(INITIAL_FILTERS)}
        brands={brands}
        employees={employees}
        totalCount={tasks.length}
        filteredCount={filteredTasks.length}
      />

      {viewMode === 'kanban' ? (
        <TasksKanbanView
          tasks={filteredTasks}
          employees={employees}
          onTaskClick={(task) => setDetailTask(task)}
          onEditClick={(task) => setEditTask(task)}
          onDeleteClick={(task) => setDeleteTask(task)}
        />
      ) : (
        <TasksListView
          tasks={filteredTasks}
          employees={employees}
          onTaskClick={(task) => setDetailTask(task)}
          onEditClick={(task) => setEditTask(task)}
          onDeleteClick={(task) => setDeleteTask(task)}
        />
      )}

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        brands={brands}
        employees={employees}
      />

      <TaskDetailModal
        isOpen={!!detailTask}
        task={detailTask}
        onClose={() => setDetailTask(null)}
        employees={employees}
        onEditClick={(task) => {
          setDetailTask(null)
          setEditTask(task)
        }}
        onDeleteClick={(task) => {
          setDetailTask(null)
          setDeleteTask(task)
        }}
      />

      <EditTaskModal
        isOpen={!!editTask}
        task={editTask}
        onClose={() => setEditTask(null)}
        brands={brands}
        employees={employees}
      />

      <DeleteTaskModal
        isOpen={!!deleteTask}
        task={deleteTask}
        onClose={() => setDeleteTask(null)}
      />
    </div>
  )
}
