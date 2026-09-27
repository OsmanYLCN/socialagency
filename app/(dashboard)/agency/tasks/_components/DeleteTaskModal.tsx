'use client'

import { useActionState, useEffect } from 'react'
import {
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  MessageSquare,
  RotateCcw,
} from 'lucide-react'
import { deleteTaskAction } from '@/app/actions/agency'
import type { TaskItem } from './TasksClientView'

interface DeleteTaskModalProps {
  isOpen: boolean
  task: TaskItem | null
  onClose: () => void
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X (Twitter)',
}

const CONTENT_LABELS: Record<string, string> = {
  reels: 'Reels / Video',
  post: 'Tekli Post',
  carousel: 'Carousel (Kaydırmalı)',
  story: 'Story (Hikaye)',
  shorts: 'Shorts',
  tweet: 'Tweet / Metin',
}

export function DeleteTaskModal({
  isOpen,
  task,
  onClose,
}: DeleteTaskModalProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await deleteTaskAction(prevState, formData)
      if (result.success) {
        onClose()
      }
      return result
    },
    null
  )

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

  const hasDependencies = task.commentsCount > 0 || task.revisionsCount > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Başlık */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Görevi Sil</h2>
              <p className="text-xs text-slate-500">Bu işlem kalıcıdır ve geri alınamaz</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hata Bildirimi */}
        {state?.error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Görev Özet Kartı */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-900">{task.brandName}</span>
            </div>
            <span className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
              {PLATFORM_LABELS[task.platform] || task.platform} &bull; {CONTENT_LABELS[task.content] || task.content}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Teslim: {new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-700">
                {task.assigneeName ? `👤 ${task.assigneeName}` : '📋 İş Havuzu'}
              </span>
            </div>
          </div>
        </div>

        {/* Uyarı Açıklaması */}
        <div className="space-y-2 mb-6">
          <p className="text-xs leading-relaxed text-slate-600">
            Bu içerik görevini sistemden kalıcı olarak kaldırmak üzeresiniz.
          </p>

          {hasDependencies && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800 space-y-1">
              <p className="font-semibold text-amber-900">Bağlı Öğeler:</p>
              <div className="flex items-center gap-4 text-[11px]">
                {task.commentsCount > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                    {task.commentsCount} yorum silinecek
                  </span>
                )}
                {task.revisionsCount > 0 && (
                  <span className="flex items-center gap-1">
                    <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                    {task.revisionsCount} revizyon silinecek
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Aksiyon Butonları */}
        <form action={formAction}>
          <input type="hidden" name="task_id" value={task.id} />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-rose-500/20 transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Evet, Görevi Sil
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
