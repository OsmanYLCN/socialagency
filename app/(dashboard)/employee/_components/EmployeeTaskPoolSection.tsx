'use client'

import { useActionState, useTransition } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Layers,
  FileImage,
  Video,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Plus,
} from 'lucide-react'
import type { EmployeeTaskItem } from '../types'
import { claimTaskAction } from '@/app/actions/employee'

interface EmployeeTaskPoolSectionProps {
  poolTasks: EmployeeTaskItem[]
  totalPoolCount: number
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

function ClaimButton({ taskId }: { taskId: string }) {
  const [state, formAction, isPending] = useActionState(claimTaskAction, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="task_id" value={taskId} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Alınıyor...</span>
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" />
            <span>Üzerime Al</span>
          </>
        )}
      </button>
      {state?.error && (
        <span className="block mt-1 text-[10px] text-rose-500">{state.error}</span>
      )}
    </form>
  )
}

export function EmployeeTaskPoolSection({ poolTasks, totalPoolCount }: EmployeeTaskPoolSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-[#272b37]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Açık İş Havuzu (Ajans Görevleri)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Atama bekleyen işleri tek tıkla üzerinize alabilirsiniz
            </p>
          </div>
        </div>

        <Link
          href="/employee/tasks?tab=pool"
          className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Tümünü Gör ({totalPoolCount})
        </Link>
      </div>

      {poolTasks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Şu an ajans iş havuzunda boşta bekleyen görev bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {poolTasks.map((task) => {
            const platformConfig = PLATFORM_CONFIG[task.platform] ?? PLATFORM_CONFIG.instagram

            return (
              <div
                key={task.id}
                className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 hover:border-slate-200 dark:border-[#272b37] dark:bg-[#1a1d25]/40 dark:hover:border-[#383d4e] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {task.brand_name}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium border ${platformConfig.badge}`}>
                      {getFormatIcon(task.content)}
                      <span>{task.content.toUpperCase()}</span>
                    </span>
                  </div>

                  {task.assignment_note && (
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {task.assignment_note}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100/80 dark:border-[#272b37]/60">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
                  </span>

                  <ClaimButton taskId={task.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
