'use client'

import { useState, useActionState, useTransition, useEffect } from 'react'
import {
  X,
  Calendar,
  Building2,
  User,
  Link as LinkIcon,
  ExternalLink,
  MessageSquare,
  RotateCcw,
  CheckCircle2,
  Clock,
  Send,
  Video,
  FileImage,
  Layers,
  Sparkles,
  Loader2,
  Plus,
  ArrowRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react'
import type { EmployeeTaskItem } from '../../types'
import {
  updateEmployeeTaskContentUrlAction,
  addEmployeeTaskCommentAction,
  claimTaskAction,
  releaseTaskAction,
} from '@/app/actions/employee'
import { getTaskDueStatus } from '@/lib/utils'

interface EmployeeTaskDetailModalProps {
  task: EmployeeTaskItem | null
  isOpen: boolean
  onClose: () => void
  onTaskUpdated?: () => void
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
      return <Video className="h-4 w-4" />
    case 'carousel':
      return <Layers className="h-4 w-4" />
    case 'post':
    case 'story':
      return <FileImage className="h-4 w-4" />
    default:
      return <Sparkles className="h-4 w-4" />
  }
}

export function EmployeeTaskDetailModal({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
}: EmployeeTaskDetailModalProps) {
  const [contentUrlInput, setContentUrlInput] = useState('')
  const [sendToApproval, setSendToApproval] = useState(true)
  const [commentInput, setCommentInput] = useState('')

  const [urlState, urlFormAction, isUrlPending] = useActionState(updateEmployeeTaskContentUrlAction, null)
  const [commentState, commentFormAction, isCommentPending] = useActionState(addEmployeeTaskCommentAction, null)
  const [claimState, claimFormAction, isClaimPending] = useActionState(claimTaskAction, null)
  const [releaseState, releaseFormAction, isReleasePending] = useActionState(releaseTaskAction, null)

  useEffect(() => {
    if (task) {
      setContentUrlInput(task.content_url || '')
      setSendToApproval(task.status !== 'pending_approval')
    }
  }, [task])

  useEffect(() => {
    if (urlState?.success || claimState?.success || releaseState?.success) {
      onTaskUpdated?.()
    }
  }, [urlState, claimState, releaseState, onTaskUpdated])

  useEffect(() => {
    if (commentState?.success) {
      setCommentInput('')
      onTaskUpdated?.()
    }
  }, [commentState, onTaskUpdated])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !task) return null

  const platformConfig = PLATFORM_CONFIG[task.platform] ?? PLATFORM_CONFIG.instagram
  const statusConfig = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.assigned
  const dueStatus = getTaskDueStatus(task.due_date, task.status)
  const isPoolTask = task.status === 'unassigned' || !task.assignee_id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-[#272b37] dark:bg-[#16181f] overflow-hidden">
        {/* Modal Başlığı */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-[#272b37]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
              {task.brand_name}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold border ${platformConfig.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${platformConfig.dot}`} />
              <span>{platformConfig.label}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-[#202430] dark:text-slate-300">
              {getFormatIcon(task.content)}
              <span>{task.content.toUpperCase()}</span>
            </span>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold border ${statusConfig.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
              <span>{statusConfig.label}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-[#202430] dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Gövdesi (Kaydırılabilir) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Teslimat ve Zaman Çizelgesi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-[#272b37] dark:bg-[#1a1d25]/50">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Teslim Tarihi
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{new Date(task.due_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                {dueStatus.isOverdue && (
                  <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                    Gecikmiş
                  </span>
                )}
                {dueStatus.isToday && (
                  <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
                    Bugün
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Görev Durumu
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                  task.status === 'revision_requested'
                    ? 'text-rose-600 dark:text-rose-400'
                    : task.status === 'pending_approval'
                    ? 'text-amber-600 dark:text-amber-400'
                    : task.status === 'completed'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Görev Brief / Notu */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Görev Notu / Brief
            </h4>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs leading-relaxed text-slate-700 dark:border-[#272b37] dark:bg-[#1a1d25]/60 dark:text-slate-300">
              {task.assignment_note || 'Bu görev için ek bir not veya brief belirtilmemiş.'}
            </div>
          </div>

          {/* Revizyon Talepleri Varsa */}
          {task.revisions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Revizyon Geçmişi ({task.revisions.length})
                </h4>
              </div>
              <div className="space-y-2.5">
                {task.revisions.map((rev, index) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-3.5 text-xs text-rose-900 dark:border-rose-950/60 dark:bg-rose-950/20 dark:text-rose-200"
                  >
                    <div className="flex items-center justify-between text-[11px] text-rose-700/80 dark:text-rose-400 font-semibold mb-1">
                      <span>Revizyon #{task.revisions.length - index}</span>
                      <span>{new Date(rev.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {rev.customer_note}
                    </p>
                    {rev.previous_url && (
                      <div className="mt-2 pt-2 border-t border-rose-100 dark:border-rose-950 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span>Önceki link:</span>
                        <a
                          href={rev.previous_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 hover:underline dark:text-rose-400 inline-flex items-center gap-1 truncate max-w-[280px]"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>{rev.previous_url}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İçerik Linki Teslim Alanı (Yalnızca çalışanın üzerindeyse) */}
          {!isPoolTask && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 dark:border-indigo-950/50 dark:bg-indigo-950/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                    İçerik Linki Teslim Et (Drive / Figma / WeTransfer)
                  </h4>
                </div>
                {task.content_url && (
                  <a
                    href={task.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <span>Mevcut Linki Aç</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <form action={urlFormAction} className="space-y-3 mt-3">
                <input type="hidden" name="task_id" value={task.id} />

                <div>
                  <input
                    type="url"
                    name="content_url"
                    value={contentUrlInput}
                    onChange={(e) => setContentUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/... veya https://figma.com/..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-900/40"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="send_to_approval"
                      value="true"
                      checked={sendToApproval}
                      onChange={(e) => setSendToApproval(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-[#272b37] dark:bg-[#1a1d25]"
                    />
                    <span>Kaydederken görevi doğrudan ajans onayına gönder</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isUrlPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isUrlPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{sendToApproval ? 'Kaydet ve Onaya Gönder' : 'Linki Kaydet'}</span>
                      </>
                    )}
                  </button>
                </div>

                {urlState?.error && (
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    {urlState.error}
                  </p>
                )}
                {urlState?.success && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    İçerik linki başarıyla kaydedildi!
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Ekip İçi Yorumlar */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Ekip İçi Yorumlar ({task.comments.length})
              </h4>
            </div>

            {task.comments.length > 0 ? (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {task.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-[#272b37] dark:bg-[#1a1d25]/60"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {comm.author_name}
                        </span>
                        <span className="rounded bg-slate-200/80 px-1.5 py-0.2 text-[9px] font-semibold text-slate-700 dark:bg-[#252936] dark:text-slate-300 uppercase">
                          {comm.author_role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {comm.created_at ? new Date(comm.created_at).toLocaleDateString('tr-TR') : ''}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {comm.comment_text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-1">
                Bu görevde henüz bir yorum bulunmuyor.
              </p>
            )}

            {/* Yeni Yorum Ekle */}
            <form action={commentFormAction} className="mt-3 flex items-center gap-2">
              <input type="hidden" name="task_id" value={task.id} />
              <input
                type="text"
                name="comment_text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Görekle ilgili bir soru veya not yazın..."
                className="h-9.5 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-100 dark:placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={isCommentPending || !commentInput.trim()}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isCommentPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Gönder</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Alt Çubuk / Havuz ve İade Aksiyonları */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 dark:border-[#272b37] dark:bg-[#1a1d25]/60">
          <div>
            {isPoolTask ? (
              <form action={claimFormAction}>
                <input type="hidden" name="task_id" value={task.id} />
                <button
                  type="submit"
                  disabled={isClaimPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isClaimPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>Bu Görevi Üzerime Al</span>
                </button>
              </form>
            ) : (
              <form action={releaseFormAction}>
                <input type="hidden" name="task_id" value={task.id} />
                <button
                  type="submit"
                  disabled={isReleasePending}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-300 dark:hover:bg-[#222632] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isReleasePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                  <span>İş Havuzuna Bırak</span>
                </button>
              </form>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-200 dark:hover:bg-[#222632] transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
