'use client'

import { useState, useMemo } from 'react'
import { TasksHeader } from './TasksHeader'
import { TasksMetricsRow } from './TasksMetricsRow'
import { TasksFilterBar, TaskFilterState } from './TasksFilterBar'

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
}: TasksClientViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [filters, setFilters] = useState<TaskFilterState>(INITIAL_FILTERS)

  // Filtrelenmiş görevleri hesapla (Türkçe locale duyarlı)
  const filteredTasks = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('tr-TR')
    const now = new Date()
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const oneDayMs = 24 * 60 * 60 * 1000

    return tasks.filter((t) => {
      // 1. Metin Arama
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

      // 2. Marka Filtresi
      if (filters.brandId && t.brandId !== filters.brandId) {
        return false
      }

      // 3. Çalışan / Atama Filtresi
      if (filters.assigneeId) {
        if (filters.assigneeId === 'unassigned') {
          if (t.assigneeId !== null) return false
        } else if (t.assigneeId !== filters.assigneeId) {
          return false
        }
      }

      // 4. Platform Filtresi
      if (filters.platform && t.platform !== filters.platform) {
        return false
      }

      // 5. İçerik Formatı Filtresi
      if (filters.content && t.content !== filters.content) {
        return false
      }

      // 6. Zaman Filtresi
      if (filters.timeFilter) {
        const dueTime = new Date(t.dueDate).getTime()
        if (filters.timeFilter === 'overdue') {
          if (t.status === 'completed' || dueTime >= todayMidnight) return false
        } else if (filters.timeFilter === 'today') {
          if (dueTime < todayMidnight || dueTime >= todayMidnight + oneDayMs) return false
        } else if (filters.timeFilter === 'this_week') {
          if (dueTime < todayMidnight || dueTime >= todayMidnight + 7 * oneDayMs) return false
        }
      }

      return true
    })
  }, [tasks, filters])

  return (
    <div className="space-y-6">
      {/* 1. Üst Başlık & Görünüm Değiştirici */}
      <TasksHeader
        agencyName={agencyName}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewTaskClick={() => {
          // Modal açılacak (Aşama 6)
        }}
      />

      {/* 2. Dörtlü Metrik Kartları */}
      <TasksMetricsRow {...metrics} />

      {/* 3. Filtreleme & Arama Çubuğu */}
      <TasksFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(INITIAL_FILTERS)}
        brands={brands}
        employees={employees}
        totalCount={tasks.length}
        filteredCount={filteredTasks.length}
      />

      {/* 4. Görünüm Alanı (Aşama 4 ve 5'te Kanban ve Liste doldurulacak) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs text-center">
        <p className="text-xs font-semibold text-slate-500">
          Görünüm modu: <span className="font-bold text-slate-800">{viewMode === 'kanban' ? 'Kanban Panosu' : 'Liste Görünümü'}</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Toplam {filteredTasks.length} görev filtrelendi. Sıradaki aşamada 5 sütunlu Kanban panosu eklenecektir.
        </p>
      </div>
    </div>
  )
}
