import { CheckSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  XTwitterIcon,
  LinkedinIcon,
} from '@/components/icons/PlatformIcons'

export interface PipelineTaskItem {
  id: string
  platform: string
  content: string
  title: string
}

interface TaskPipelineProps {
  pipeline?: {
    planned: PipelineTaskItem[]
    inProgress: PipelineTaskItem[]
    revisionRequested?: PipelineTaskItem[]
    pendingApproval: PipelineTaskItem[]
    shared: PipelineTaskItem[]
  }
}

function renderPlatformIcon(platform: string, className = 'h-3.5 w-3.5') {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <InstagramIcon className={className} />
    case 'tiktok':
      return <TikTokIcon className={className} />
    case 'youtube':
      return <YoutubeIcon className={className} />
    case 'x':
      return <XTwitterIcon className={className} />
    case 'linkedin':
      return <LinkedinIcon className={className} />
    default:
      return <InstagramIcon className={className} />
  }
}

// Görev durumlarını 5 aşamalı sütunlarda gösterir ve doğrudan göreve yönlendirir
export function AgencyTaskPipeline({
  pipeline = {
    planned: [],
    inProgress: [],
    revisionRequested: [],
    pendingApproval: [],
    shared: [],
  },
}: TaskPipelineProps) {
  const revisions = pipeline.revisionRequested ?? []
  const totalInPipeline =
    pipeline.planned.length +
    pipeline.inProgress.length +
    revisions.length +
    pipeline.pendingApproval.length +
    pipeline.shared.length

  const columns = [
    {
      key: 'planned',
      title: 'İş Havuzu',
      emptyText: 'Atanmamış görev yok',
      items: pipeline.planned,
      containerCls: 'border-slate-100 bg-slate-50/80 dark:border-[#272b37] dark:bg-[#14161d]',
      headerBorderCls: 'border-slate-200/70 dark:border-[#272b37]',
      titleCls: 'text-slate-700 dark:text-slate-200',
      badgeCls: 'bg-slate-200 text-slate-700 dark:bg-[#272b37] dark:text-slate-300',
      cardCls: 'border-slate-200/80 hover:border-indigo-300 dark:border-[#272b37] dark:hover:border-indigo-500/50',
      iconCls: 'text-slate-700 dark:text-slate-300',
    },
    {
      key: 'inProgress',
      title: 'Üretimde',
      emptyText: 'Üretimde görev yok',
      items: pipeline.inProgress,
      containerCls: 'border-indigo-100/60 bg-indigo-50/40 dark:border-[#272b37] dark:bg-[#14161d]',
      headerBorderCls: 'border-indigo-100 dark:border-[#272b37]',
      titleCls: 'text-indigo-900 dark:text-indigo-300',
      badgeCls: 'bg-indigo-100 text-indigo-700 dark:border dark:border-indigo-800/40 dark:bg-indigo-950/60 dark:text-indigo-300',
      cardCls: 'border-indigo-100 hover:border-indigo-300 dark:border-[#272b37] dark:hover:border-indigo-500/50',
      iconCls: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      key: 'pendingApproval',
      title: 'Onay Bekliyor',
      emptyText: 'Onay bekleyen yok',
      items: pipeline.pendingApproval,
      containerCls: 'border-amber-100/60 bg-amber-50/40 dark:border-[#272b37] dark:bg-[#14161d]',
      headerBorderCls: 'border-amber-100 dark:border-[#272b37]',
      titleCls: 'text-amber-900 dark:text-amber-300',
      badgeCls: 'bg-amber-100 text-amber-700 dark:border dark:border-amber-800/40 dark:bg-amber-950/60 dark:text-amber-300',
      cardCls: 'border-amber-100 hover:border-amber-300 dark:border-[#272b37] dark:hover:border-amber-500/50',
      iconCls: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'revisionRequested',
      title: 'Revizyonda',
      emptyText: 'Revizyonda iş yok',
      items: revisions,
      containerCls: 'border-rose-100/60 bg-rose-50/40 dark:border-[#272b37] dark:bg-[#14161d]',
      headerBorderCls: 'border-rose-100 dark:border-[#272b37]',
      titleCls: 'text-rose-900 dark:text-rose-300',
      badgeCls: 'bg-rose-100 text-rose-700 dark:border dark:border-rose-800/40 dark:bg-rose-950/60 dark:text-rose-300',
      cardCls: 'border-rose-100 hover:border-rose-300 dark:border-[#272b37] dark:hover:border-rose-500/50',
      iconCls: 'text-rose-600 dark:text-rose-400',
    },
    {
      key: 'shared',
      title: 'Tamamlandı',
      emptyText: 'Tamamlanan yok',
      items: pipeline.shared,
      containerCls: 'border-emerald-100/60 bg-emerald-50/40 dark:border-[#272b37] dark:bg-[#14161d]',
      headerBorderCls: 'border-emerald-100 dark:border-[#272b37]',
      titleCls: 'text-emerald-900 dark:text-emerald-300',
      badgeCls: 'bg-emerald-100 text-emerald-700 dark:border dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-300',
      cardCls: 'border-emerald-100 hover:border-emerald-300 dark:border-[#272b37] dark:hover:border-emerald-500/50',
      iconCls: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Görev Pipeline & Akış Durumu</h3>
          <p className="text-xs text-slate-400 dark:text-slate-400">
            İçerik üretim, onay ve revizyon aşamaları — kartlara tıklayarak görev detayını açabilirsiniz
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 tabular-nums dark:border dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300">
            Toplam: {totalInPipeline} Görev
          </span>
          <Link
            href="/agency/tasks"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-200 dark:hover:bg-[#222632] transition-colors"
          >
            <span>Kanban Panosu</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {columns.map((col) => (
          <div
            key={col.key}
            className={`flex flex-col gap-2.5 rounded-2xl border p-3.5 ${col.containerCls}`}
          >
            <div className={`flex items-center justify-between border-b pb-2 ${col.headerBorderCls}`}>
              <span className={`text-xs font-bold ${col.titleCls}`}>{col.title}</span>
              <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${col.badgeCls}`}>
                {col.items.length}
              </span>
            </div>

            {col.items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                {col.emptyText}
              </div>
            ) : (
              <>
                {col.items.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    href={`/agency/tasks?taskId=${task.id}`}
                    className={`block rounded-xl border bg-white p-3 shadow-2xs transition-all hover:shadow-xs dark:bg-[#1a1d25] ${col.cardCls}`}
                  >
                    <div className={`flex items-center gap-1.5 ${col.iconCls}`}>
                      {renderPlatformIcon(task.platform)}
                      <span className="text-[11px] font-bold capitalize">{task.platform}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-100 line-clamp-1">
                      {task.title}
                    </p>
                  </Link>
                ))}
                {col.items.length > 5 && (
                  <Link
                    href="/agency/tasks"
                    className="block rounded-xl border border-dashed border-slate-200 bg-white/70 p-2 text-center text-[11px] font-semibold text-slate-500 hover:border-indigo-300 hover:bg-white hover:text-indigo-600 transition-colors dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400"
                  >
                    +{col.items.length - 5} daha fazla &rarr;
                  </Link>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
