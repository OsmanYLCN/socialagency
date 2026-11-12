'use client'

import {
  Calendar,
  MessageSquare,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Video,
  FileImage,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Plus,
} from 'lucide-react'
import type { EmployeeTaskItem } from '../../types'
import { getTaskDueStatus } from '@/lib/utils'

interface EmployeeTaskCardProps {
  task: EmployeeTaskItem
  isPoolTask?: boolean
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

export function EmployeeTaskCard({
  task,
  isPoolTask = false,
  onTaskClick,
  onClaimClick,
}: EmployeeTaskCardProps) {
  const platformConfig = PLATFORM_CONFIG[task.platform] ?? PLATFORM_CONFIG.instagram
  const dueStatus = getTaskDueStatus(task.due_date, task.status)
  const isRevision = task.status === 'revision_requested'

  return (
    <div
      onClick={() => onTaskClick(task)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer ${
        isRevision
          ? 'border-rose-300/80 bg-rose-50/20 hover:border-rose-400 dark:border-rose-900/60 dark:bg-rose-950/20 dark:hover:border-rose-800'
          : 'border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/50 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-[#383d4e] dark:hover:bg-[#1a1d25]'
      }`}
    >
      <div>
        {/* Üst Başlık & Platform & Format Rozetleri */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-black tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {task.brand_name}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${platformConfig.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${platformConfig.dot}`} />
              <span>{platformConfig.label}</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-[#202430] dark:text-slate-300">
              {getFormatIcon(task.content)}
              <span>{task.content.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Not / Açıklama */}
        {task.assignment_note && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {task.assignment_note}
          </p>
        )}

        {/* Revizyon Uyarı Kutusu */}
        {isRevision && task.revisions.length > 0 && (
          <div className="mt-2 flex items-start gap-1.5 rounded-xl border border-rose-200/80 bg-rose-100/40 p-2 text-[11px] text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            <RotateCcw className="h-3.5 w-3.5 shrink-0 mt-0.5 animate-spin-reverse" />
            <p className="line-clamp-2">
              <strong>Revizyon:</strong> {task.revisions[0].customer_note}
            </p>
          </div>
        )}
      </div>

      {/* Alt Çubuk: Tarih, Yorum, Link ve Aksiyonlar */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 pt-3 text-xs text-slate-400 dark:border-[#272b37]/60 dark:text-slate-500">
        <div className="flex items-center gap-2">
          {/* Teslim Tarihi */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              dueStatus.isOverdue
                ? 'text-rose-600 font-bold dark:text-rose-400'
                : dueStatus.isToday
                ? 'text-amber-600 font-bold dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(task.due_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
          </span>

          {/* İçerik linki mevcut mu */}
          {task.content_url && (
            <span
              title="İçerik linki eklendi"
              className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            >
              <LinkIcon className="h-2.5 w-2.5" />
              <span>Link</span>
            </span>
          )}

          {/* Yorum Sayısı */}
          {task.comments_count > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comments_count}</span>
            </span>
          )}
        </div>

        {/* Sağ: Durum Butonu / Üzerime Al */}
        {isPoolTask ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClaimClick?.(task)
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Al</span>
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-indigo-600 group-hover:underline dark:text-indigo-400">
            Detay →
          </span>
        )}
      </div>
    </div>
  )
}
