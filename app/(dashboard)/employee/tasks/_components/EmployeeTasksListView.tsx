'use client'

import {
  Calendar,
  ExternalLink,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Video,
  FileImage,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Plus,
} from 'lucide-react'
import type { EmployeeTaskItem } from '../../types'
import { getTaskDueStatus } from '@/lib/utils'

interface EmployeeTasksListViewProps {
  tasks: EmployeeTaskItem[]
  isPool?: boolean
  onTaskClick: (task: EmployeeTaskItem) => void
  onClaimClick?: (task: EmployeeTaskItem) => void
}

const PLATFORM_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  instagram: {
    label: 'Instagram',
    badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-900/40',
    dot: 'bg-fuchsia-500',
  },
  tiktok: {
    label: 'TikTok',
    badge: 'bg-slate-900 text-white border-slate-900 dark:bg-black dark:border-slate-800 dark:text-slate-200',
    dot: 'bg-cyan-400',
  },
  linkedin: {
    label: 'LinkedIn',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40',
    dot: 'bg-blue-600',
  },
  youtube: {
    label: 'YouTube',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40',
    dot: 'bg-rose-600',
  },
  x: {
    label: 'X (Twitter)',
    badge: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-[#1a1d25] dark:text-slate-300 dark:border-[#272b37]',
    dot: 'bg-slate-700',
  },
}

const STATUS_CONFIG: Record<EmployeeTaskItem['status'], { label: string; badge: string; dot: string }> = {
  unassigned: {
    label: 'İş Havuzu',
    badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1a1d25] dark:text-slate-300 dark:border-[#272b37]',
    dot: 'bg-slate-400',
  },
  assigned: {
    label: 'Üretimde',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40',
    dot: 'bg-blue-500',
  },
  pending_approval: {
    label: 'Onay Bekliyor',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40',
    dot: 'bg-amber-500',
  },
  revision_requested: {
    label: 'Revizyonda',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40',
    dot: 'bg-rose-500',
  },
  completed: {
    label: 'Tamamlandı',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40',
    dot: 'bg-emerald-500',
  },
}

function getFormatIcon(content: string) {
  switch (content) {
    case 'reels':
    case 'shorts':
      return <Video className="h-3.5 w-3.5" />
    case 'carousel':
      return <Layers className="h-3.5 w-3.5" />
    case 'post':
    case 'story':
      return <FileImage className="h-3.5 w-3.5" />
    default:
      return <Sparkles className="h-3.5 w-3.5" />
  }
}

export function EmployeeTasksListView({
  tasks,
  isPool = false,
  onTaskClick,
  onClaimClick,
}: EmployeeTasksListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-[#272b37] dark:bg-[#16181f]">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Kriterlere uygun görev bulunamadı
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Arama veya filtrelerinizi değiştirerek tekrar deneyebilirsiniz.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-[#272b37] dark:bg-[#1a1d25]/60 dark:text-slate-400">
              <th className="px-5 py-3.5">Marka & Brief</th>
              <th className="px-4 py-3.5">Platform</th>
              <th className="px-4 py-3.5">Format</th>
              <th className="px-4 py-3.5">Teslim Tarihi</th>
              <th className="px-4 py-3.5">Durum</th>
              <th className="px-4 py-3.5">İçerik Linki</th>
              <th className="px-5 py-3.5 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#272b37]/60">
            {tasks.map((task) => {
              const platformConfig = PLATFORM_CONFIG[task.platform] ?? PLATFORM_CONFIG.instagram
              const statusConfig = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.assigned
              const dueStatus = getTaskDueStatus(task.due_date, task.status)

              return (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-[#1a1d25] cursor-pointer"
                >
                  {/* Marka & Not */}
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">
                      {task.brand_name}
                    </span>
                    {task.assignment_note && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                        {task.assignment_note}
                      </span>
                    )}
                  </td>

                  {/* Platform */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${platformConfig.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${platformConfig.dot}`} />
                      <span>{platformConfig.label}</span>
                    </span>
                  </td>

                  {/* Format */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-[#202430] dark:text-slate-300">
                      {getFormatIcon(task.content)}
                      <span>{task.content.toUpperCase()}</span>
                    </span>
                  </td>

                  {/* Teslim Tarihi */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span
                        className={`font-medium ${
                          dueStatus.isOverdue
                            ? 'text-rose-600 font-bold dark:text-rose-400'
                            : dueStatus.isToday
                            ? 'text-amber-600 font-bold dark:text-amber-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {new Date(task.due_date).toLocaleDateString('tr-TR')}
                      </span>
                      {dueStatus.isOverdue && (
                        <span className="rounded bg-rose-50 px-1 py-0.2 text-[9px] font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                          Gecikti
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Durum */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${statusConfig.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                      <span>{statusConfig.label}</span>
                    </span>
                  </td>

                  {/* İçerik Linki */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {task.content_url ? (
                      <a
                        href={task.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Linki Aç</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    )}
                  </td>

                  {/* İşlem */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    {isPool ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onClaimClick?.(task)
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Üzerime Al</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick(task)
                        }}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition-colors"
                      >
                        İncele / Teslim Et
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
