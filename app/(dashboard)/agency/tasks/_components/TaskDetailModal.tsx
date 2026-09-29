'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  X,
  Calendar,
  Building2,
  User,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  MessageSquare,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Pencil,
  Trash2,
  UserCheck,
  Video,
  FileImage,
  Layers,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import type { TaskItem, EmployeeOption } from './TasksClientView'
import {
  updateTaskStatusAction,
  assignTaskAction,
  updateTaskContentUrlAction,
  requestTaskRevisionAction,
  addTaskCommentAction,
} from '@/app/actions/agency'
import { getTaskDueStatus } from '@/lib/utils'

interface TaskDetailModalProps {
  task: TaskItem | null
  isOpen: boolean
  onClose: () => void
  employees: EmployeeOption[]
  onEditClick: (task: TaskItem) => void
  onDeleteClick: (task: TaskItem) => void
}

const PLATFORM_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  instagram: {
    label: 'Instagram',
    badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80',
    dot: 'bg-fuchsia-500',
  },
  tiktok: {
    label: 'TikTok',
    badge: 'bg-slate-900 text-white border-slate-900',
    dot: 'bg-cyan-400',
  },
  linkedin: {
    label: 'LinkedIn',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-600',
  },
  youtube: {
    label: 'YouTube',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-600',
  },
  x: {
    label: 'X (Twitter)',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    dot: 'bg-slate-700',
  },
}

const STATUS_CONFIG: Record<TaskItem['status'], { label: string; badge: string; dot: string }> = {
  unassigned: {
    label: 'İş Havuzu',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  assigned: {
    label: 'Üretimde',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
  },
  pending_approval: {
    label: 'Onay Bekliyor',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  revision_requested: {
    label: 'Revizyonda',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
  },
  completed: {
    label: 'Tamamlandı',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  employees,
  onEditClick,
  onDeleteClick,
}: TaskDetailModalProps) {
  const [contentUrlInput, setContentUrlInput] = useState('')
  const [sendToApproval, setSendToApproval] = useState(true)
  const [revisionNote, setRevisionNote] = useState('')
  const [isRevisionOpen, setIsRevisionOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (task) {
      setContentUrlInput(task.contentUrl || '')
      setRevisionNote('')
      setIsRevisionOpen(false)
      setCommentText('')
      setActionError(null)
    }
  }, [task])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !task) return null

  const platformInfo = PLATFORM_CONFIG[task.platform] ?? {
    label: task.platform,
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  }
  const statusInfo = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.unassigned

  // Tarih ve gecikme hesabı (saat dilimi kayması olmadan kesin kontrol)
  const { isOverdue, isToday } = getTaskDueStatus(task.dueDate, task.status)

  // Durum Değiştirme
  const handleStatusChange = (newStatus: TaskItem['status']) => {
    setActionError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', task.id)
      formData.set('status', newStatus)
      const res = await updateTaskStatusAction(null, formData)
      if (res?.error) setActionError(res.error)
    })
  }

  // Personel Atama
  const handleAssign = (assigneeId: string) => {
    setIsAssignOpen(false)
    setActionError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', task.id)
      formData.set('assignee_id', assigneeId)
      const res = await assignTaskAction(null, formData)
      if (res?.error) setActionError(res.error)
    })
  }

  // İçerik Linki Kaydetme
  const handleSaveContentUrl = (e: React.FormEvent) => {
    e.preventDefault()
    setActionError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', task.id)
      formData.set('content_url', contentUrlInput)
      formData.set('send_to_approval', sendToApproval ? 'true' : 'false')
      const res = await updateTaskContentUrlAction(null, formData)
      if (res?.error) setActionError(res.error)
    })
  }

  // Revizyon Talep Etme
  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault()
    if (!revisionNote.trim()) return
    setActionError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', task.id)
      formData.set('note', revisionNote.trim())
      const res = await requestTaskRevisionAction(null, formData)
      if (res?.error) {
        setActionError(res.error)
      } else {
        setRevisionNote('')
        setIsRevisionOpen(false)
      }
    })
  }

  // Yorum Ekleme
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setActionError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', task.id)
      formData.set('comment_text', commentText.trim())
      const res = await addTaskCommentAction(null, formData)
      if (res?.error) {
        setActionError(res.error)
      } else {
        setCommentText('')
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* 1. Üst Başlık Barı */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/60 px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${platformInfo.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${platformInfo.dot}`} />
              {platformInfo.label}
            </span>

            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 uppercase">
              {task.content}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${statusInfo.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </span>

            <h2 className="text-base font-bold text-slate-900 ml-1">
              {task.brandName}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEditClick(task)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Düzenle</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteClick(task)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
              title="Görevi Sil"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hata Bildirimi */}
        {actionError && (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <span>{actionError}</span>
          </div>
        )}

        {/* 2. İki Sütunlu Gövde */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon (2 Birim): Brief, İçerik Linki, Revizyon Geçmişi */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brief & Açıklama */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-3">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>Kreatif Brief & Prodüksiyon Notu</span>
              </div>
              {task.assignmentNote ? (
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {task.assignmentNote}
                </p>
              ) : (
                <p className="text-xs italic text-slate-400">Bu görev için brief açıklaması girilmemiş.</p>
              )}
            </div>

            {/* İçerik & Tasarım Bağlantısı */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <LinkIcon className="h-4 w-4 text-indigo-600" />
                  <span>Üretilen İçerik / Tasarım Bağlantısı</span>
                </div>
                {task.contentUrl && (
                  <a
                    href={task.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    <span>Bağlantıyı Aç</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <form onSubmit={handleSaveContentUrl} className="space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={contentUrlInput}
                    onChange={(e) => setContentUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/... veya Canva / Figma linki"
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Kaydet</span>
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendToApproval}
                    onChange={(e) => setSendToApproval(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] font-medium text-slate-600">
                    Kaydedildiğinde görevi doğrudan &quot;Onay Bekliyor&quot; aşamasına taşı
                  </span>
                </label>
              </form>
            </div>

            {/* Revizyon Geçmişi & Talep Alanı */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <RotateCcw className="h-4 w-4 text-rose-600" />
                  <span>Revizyon Geçmişi ({task.revisionsCount})</span>
                </div>
                {!isRevisionOpen && (
                  <button
                    type="button"
                    onClick={() => setIsRevisionOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <span>+ Revizyon Talep Et</span>
                  </button>
                )}
              </div>

              {/* Yeni Revizyon Talep Formu */}
              {isRevisionOpen && (
                <form
                  onSubmit={handleRequestRevision}
                  className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-2.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-rose-900">Revizyon Notu Yazın</p>
                    <button
                      type="button"
                      onClick={() => setIsRevisionOpen(false)}
                      className="text-xs text-rose-500 hover:text-rose-700"
                    >
                      İptal
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="Müşterinin veya ajansın talep ettiği düzeltmeler (örn: kapak görseli fontu değişecek, saniye 5'teki logo büyütülecek)..."
                    className="w-full rounded-lg border border-rose-200 bg-white p-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isPending || !revisionNote.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      <span>Revizyona Gönder</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Revizyon Listesi */}
              {task.revisions.length === 0 ? (
                <p className="text-xs italic text-slate-400 py-1">Bu görev için henüz revizyon talebi girilmemiş.</p>
              ) : (
                <div className="space-y-3">
                  {task.revisions.map((rev, idx) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-700">
                          Revizyon #{task.revisions.length - idx}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{rev.customerNote}</p>
                      {rev.previousUrl && (
                        <div className="pt-1">
                          <a
                            href={rev.previousUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 hover:underline"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                            <span>Önceki Tasarım Bağlantısı</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon (1 Birim): Bilgiler, Hızlı Aşamalar, Yorumlar */}
          <div className="space-y-6">
            {/* Görev Meta Bilgileri */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Görev Bilgileri
              </h3>

              {/* Teslim Tarihi */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Teslim Tarihi:</span>
                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    isOverdue
                      ? 'text-rose-600'
                      : isToday
                      ? 'text-amber-700'
                      : 'text-slate-800'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {task.dueDate} {isOverdue ? '(Gecikti)' : isToday ? '(Bugün)' : ''}
                </span>
              </div>

              {/* Görevli Personel */}
              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Görevli:</span>
                  <button
                    type="button"
                    onClick={() => setIsAssignOpen((v) => !v)}
                    className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Değiştir
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700 shrink-0">
                    {task.assigneeName ? task.assigneeName.slice(0, 2).toUpperCase() : '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">
                      {task.assigneeName ?? 'İş Havuzunda (Atanmamış)'}
                    </p>
                    {task.assigneeEmail && (
                      <p className="text-[11px] text-slate-400 truncate">{task.assigneeEmail}</p>
                    )}
                  </div>
                </div>

                {/* Hızlı Atama Dropdown */}
                {isAssignOpen && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-in fade-in">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleAssign('')}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                    >
                      <span>📋 İş Havuzuna Gönder</span>
                    </button>
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        disabled={isPending}
                        onClick={() => handleAssign(emp.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium disabled:opacity-50 cursor-pointer ${
                          task.assigneeId === emp.id
                            ? 'bg-indigo-50 font-bold text-indigo-700'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <User className="h-3 w-3 text-slate-400" />
                        <span className="truncate">{emp.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hızlı Aşama Butonları */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-500 mb-2">Aşama Değiştir:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange('assigned')}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all disabled:opacity-50 cursor-pointer ${
                      task.status === 'assigned'
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ⏳ Üretimde
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange('pending_approval')}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all disabled:opacity-50 cursor-pointer ${
                      task.status === 'pending_approval'
                        ? 'border-amber-300 bg-amber-50 text-amber-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📤 Onaya Sun
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange('completed')}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all disabled:opacity-50 cursor-pointer ${
                      task.status === 'completed'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ✅ Tamamlandı
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange('unassigned')}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all disabled:opacity-50 cursor-pointer ${
                      task.status === 'unassigned'
                        ? 'border-slate-300 bg-slate-200 text-slate-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📋 Havuz
                  </button>
                </div>
              </div>
            </div>

            {/* Ajans İçi Yorumlar & Notlaşma */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2.5">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                <span>Ajans İçi Yorumlar ({task.commentsCount})</span>
              </div>

              {/* Yorumlar Akışı */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {task.comments.length === 0 ? (
                  <p className="text-xs italic text-slate-400 py-2">Henüz yorum yazılmamış.</p>
                ) : (
                  task.comments.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{c.commentText}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Yeni Yorum Formu */}
              <form onSubmit={handleAddComment} className="flex gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ekip için not veya yorum yazın..."
                  className="h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-100"
                />
                <button
                  type="submit"
                  disabled={isPending || !commentText.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                  title="Yorum Gönder"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
