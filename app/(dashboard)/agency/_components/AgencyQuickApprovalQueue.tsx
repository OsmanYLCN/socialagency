'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  Send,
  X,
} from 'lucide-react'
import { updateTaskStatusAction, requestTaskRevisionAction } from '@/app/actions/agency'

export interface QuickApprovalTaskItem {
  id: string
  brandName: string
  assigneeName: string
  platform: string
  content: string
  dueDate: string
  contentUrl: string | null
  assignmentNote: string | null
}

interface AgencyQuickApprovalQueueProps {
  tasks: QuickApprovalTaskItem[]
}

export function AgencyQuickApprovalQueue({ tasks }: AgencyQuickApprovalQueueProps) {
  const [revisionTaskId, setRevisionTaskId] = useState<string | null>(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  if (tasks.length === 0) return null

  const handleApprove = (taskId: string) => {
    setErrorMsg(null)
    setProcessingId(taskId)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('task_id', taskId)
      fd.set('status', 'completed')
      const res = await updateTaskStatusAction(null, fd)
      if (res?.error) setErrorMsg(res.error)
      setProcessingId(null)
    })
  }

  const handleRequestRevision = (taskId: string) => {
    if (!revisionNote.trim()) {
      setErrorMsg('Lütfen revizyon nedenini kısaca belirtin.')
      return
    }
    setErrorMsg(null)
    setProcessingId(taskId)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('task_id', taskId)
      fd.set('note', revisionNote.trim())
      const res = await requestTaskRevisionAction(null, fd)
      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        setRevisionTaskId(null)
        setRevisionNote('')
      }
      setProcessingId(null)
    })
  }

  return (
    <div className="rounded-2xl border border-amber-200/90 bg-amber-50/40 p-5 shadow-xs dark:border-amber-900/50 dark:bg-amber-950/15">
      <div className="flex flex-col justify-between gap-3 border-b border-amber-200/60 pb-4 sm:flex-row sm:items-center dark:border-amber-900/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Hızlı Onay Masası
              </h3>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white tabular-nums">
                {tasks.length} Bekleyen Teslim
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Ekip üyelerinin teslim ettiği içerik bağlantılarını inceleyin, tek tıkla onaylayın veya revizyon talep edin.
            </p>
          </div>
        </div>

        <Link
          href="/agency/tasks"
          className="text-xs font-semibold text-amber-800 hover:underline dark:text-amber-300 shrink-0"
        >
          Tüm Görev Panosunu Aç &rarr;
        </Link>
      </div>

      {errorMsg && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {tasks.map((task) => {
          const isBusy = processingId === task.id
          const isRevising = revisionTaskId === task.id

          return (
            <div
              key={task.id}
              className="rounded-xl border border-amber-200/70 bg-white p-4 shadow-2xs transition-all dark:border-[#272b37] dark:bg-[#16181f]"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/agency/tasks?taskId=${task.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                    >
                      {task.brandName}
                    </Link>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-700 dark:bg-[#222632] dark:text-slate-300">
                      {task.platform} • {task.content}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <User className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{task.assigneeName}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 tabular-nums">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
                    </span>
                  </div>

                  {task.assignmentNote && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {task.assignmentNote}
                    </p>
                  )}
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {task.contentUrl ? (
                    <a
                      href={task.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>İçeriği İncele</span>
                    </a>
                  ) : (
                    <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-400 dark:bg-[#1a1d25]">
                      Link Eklenmemiş
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => {
                      if (isRevising) {
                        setRevisionTaskId(null)
                      } else {
                        setRevisionTaskId(task.id)
                        setRevisionNote('')
                        setErrorMsg(null)
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Revizyon İste</span>
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleApprove(task.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isBusy && !isRevising ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    <span>Onayla</span>
                  </button>
                </div>
              </div>

              {/* Satır İçi Revizyon Notu Girişi */}
              {isRevising && (
                <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center dark:border-[#272b37]">
                  <input
                    type="text"
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="Çalışana iletilecek revizyon notunu yazın (Örn: Kapak görselindeki tipografiyi büyütelim)..."
                    className="h-9 flex-1 rounded-xl border border-rose-200 bg-rose-50/30 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-rose-400 focus:bg-white dark:border-rose-900/60 dark:bg-[#1a1d25] dark:text-slate-100"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleRequestRevision(task.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      <span>Revizyonu Gönder</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevisionTaskId(null)}
                      className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-2.5 text-xs text-slate-500 hover:bg-slate-100 dark:border-[#272b37] dark:hover:bg-[#222632] cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
