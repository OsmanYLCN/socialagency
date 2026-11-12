'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  Layers,
  FileImage,
  Video,
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import type { EmployeeTaskItem } from '../types'
import { getTaskDueStatus } from '@/lib/utils'

interface EmployeeActiveTasksListProps {
  tasks: EmployeeTaskItem[]
  onOpenTaskModal?: (task: EmployeeTaskItem) => void
}

const PLATFORM_CONFIG: Record<string, { label: string; badge: string }> = {
  instagram: {
    label: 'Instagram',
    badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-900/40',
  },
  tiktok: {
    label: 'TikTok',
    badge: 'bg-slate-900 text-white border-slate-900 dark:bg-black dark:border-slate-800 dark:text-slate-200',
  },
  linkedin: {
    label: 'LinkedIn',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40',
  },
  youtube: {
    label: 'YouTube',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40',
  },
  x: {
    label: 'X (Twitter)',
    badge: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-[#1a1d25] dark:text-slate-300 dark:border-[#272b37]',
  },
}

function getFormatIcon(content: string) {
  switch (content) {
    case 'reels':
    case 'shorts':
      return <Video className="h-3 w-3" />
    case 'carousel':
      return <Layers className="h-3 w-3" />
    case 'post':
    case 'story':
      return <FileImage className="h-3 w-3" />
    default:
      return <Sparkles className="h-3 w-3" />
  }
}

export function EmployeeActiveTasksList({ tasks }: EmployeeActiveTasksListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'revisions' | 'in_progress' | 'approval'>('all')

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'revisions') return t.status === 'revision_requested'
    if (activeTab === 'in_progress') return t.status === 'assigned'
    if (activeTab === 'approval') return t.status === 'pending_approval'
    return t.status !== 'completed'
  })

  const revisionsCount = tasks.filter((t) => t.status === 'revision_requested').length
  const inProgressCount = tasks.filter((t) => t.status === 'assigned').length
  const approvalCount = tasks.filter((t) => t.status === 'pending_approval').length

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-[#272b37]">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Aktif Görevlerim & Üretim Akışı
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Üzerinize atanmış açık ve revizyon bekleyen işlerin güncel listesi
          </p>
        </div>

        {/* Tab filtreleri */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-[#1a1d25]">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Tümü ({tasks.filter((t) => t.status !== 'completed').length})
          </button>
          {revisionsCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('revisions')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                activeTab === 'revisions'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30'
              }`}
            >
              Revizyondakiler ({revisionsCount})
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('in_progress')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              activeTab === 'in_progress'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Üretimde ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approval')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              activeTab === 'approval'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#222632] dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Onayda ({approvalCount})
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-[#1a1d25] dark:text-slate-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Bu kategoride bekleyen bir görev bulunmuyor
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            İş havuzundan yeni bir görev alabilir veya tamamlanan işlerinizi inceleyebilirsiniz.
          </p>
          <Link
            href="/employee/tasks?tab=pool"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:bg-[#242834] transition-colors"
          >
            <span>İş Havuzuna Git</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filteredTasks.slice(0, 5).map((task) => {
            const platformConfig = PLATFORM_CONFIG[task.platform] ?? PLATFORM_CONFIG.instagram
            const dueStatus = getTaskDueStatus(task.due_date, task.status)
            const latestRevision = task.revisions[0]

            return (
              <div
                key={task.id}
                className={`group flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                  task.status === 'revision_requested'
                    ? 'border-rose-200/80 bg-rose-50/20 hover:border-rose-300 dark:border-rose-950/60 dark:bg-rose-950/10 dark:hover:border-rose-900/80'
                    : 'border-slate-100 bg-slate-50/40 hover:border-slate-200 hover:bg-slate-50/80 dark:border-[#272b37] dark:bg-[#1a1d25]/60 dark:hover:border-[#383d4e] dark:hover:bg-[#1a1d25]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {task.brand_name}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${platformConfig.badge}`}>
                      {getFormatIcon(task.content)}
                      <span>{platformConfig.label} {task.content.toUpperCase()}</span>
                    </span>

                    {task.status === 'revision_requested' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60">
                        <RotateCcw className="h-3 w-3" />
                        Revizyon İsteniyor
                      </span>
                    ) : task.status === 'pending_approval' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60">
                        <AlertCircle className="h-3 w-3" />
                        Onay Bekliyor
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60">
                        <Clock className="h-3 w-3" />
                        Üretimde
                      </span>
                    )}
                  </div>

                  {task.assignment_note && (
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                      {task.assignment_note}
                    </p>
                  )}

                  {latestRevision && task.status === 'revision_requested' && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-900/40 line-clamp-1">
                      <strong>Revizyon Notu:</strong> {latestRevision.customer_note}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Teslim: {new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
                    </span>

                    {dueStatus.isOverdue ? (
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        (Gecikmiş)
                      </span>
                    ) : dueStatus.isToday ? (
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        (Bugün Son Gün)
                      </span>
                    ) : null}

                    {task.content_url && (
                      <a
                        href={task.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Mevcut İçerik Linki</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-2 sm:pt-0">
                  <Link
                    href={`/employee/tasks?taskId=${task.id}`}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-200 dark:hover:bg-[#222632] transition-colors"
                  >
                    <span>{task.content_url ? 'Teslimi Güncelle' : 'İçerik Yükle'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}

          {filteredTasks.length > 5 && (
            <div className="pt-2 text-center">
              <Link
                href="/employee/tasks"
                className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Tüm {filteredTasks.length} görevi görüntüle →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
