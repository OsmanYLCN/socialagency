'use client'

import { useState } from 'react'

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

export function TasksClientView({
  agencyName,
  tasks,
  brands,
  employees,
  metrics,
}: TasksClientViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  return (
    <div className="space-y-6">
      {/* Aşama 2 İskeleti: Veri akışı ve tipler bağlandı */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              Görev Yönetimi
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{agencyName}</span> bünyesindeki tüm içerik ve prodüksiyon iş akışı
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
              {tasks.length} Görev Listelendi
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
