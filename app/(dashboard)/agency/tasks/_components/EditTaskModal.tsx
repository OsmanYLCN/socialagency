'use client'

import { useActionState, useEffect, useState } from 'react'
import {
  X,
  Pencil,
  Calendar,
  Building2,
  User,
  FileText,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Video,
  FileImage,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react'
import { updateTaskAction } from '@/app/actions/agency'
import type { TaskItem, BrandOption, EmployeeOption } from './TasksClientView'

interface EditTaskModalProps {
  isOpen: boolean
  task: TaskItem | null
  onClose: () => void
  brands: BrandOption[]
  employees: EmployeeOption[]
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: 'hover:border-fuchsia-400 peer-checked:border-fuchsia-500 peer-checked:bg-fuchsia-50/60 peer-checked:text-fuchsia-700 dark:peer-checked:bg-fuchsia-950/40 dark:peer-checked:text-fuchsia-300 dark:peer-checked:border-fuchsia-800' },
  { id: 'tiktok', name: 'TikTok', color: 'hover:border-slate-800 peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white dark:peer-checked:border-slate-700 dark:peer-checked:bg-black dark:peer-checked:text-slate-200' },
  { id: 'linkedin', name: 'LinkedIn', color: 'hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-blue-50/60 peer-checked:text-blue-700 dark:peer-checked:bg-blue-950/40 dark:peer-checked:text-blue-300 dark:peer-checked:border-blue-800' },
  { id: 'youtube', name: 'YouTube', color: 'hover:border-rose-400 peer-checked:border-rose-600 peer-checked:bg-rose-50/60 peer-checked:text-rose-700 dark:peer-checked:bg-rose-950/40 dark:peer-checked:text-rose-300 dark:peer-checked:border-rose-800' },
  { id: 'x', name: 'X (Twitter)', color: 'hover:border-slate-700 peer-checked:border-slate-900 peer-checked:bg-slate-100 peer-checked:text-slate-900 dark:peer-checked:border-slate-600 dark:peer-checked:bg-[#222632] dark:peer-checked:text-white' },
]

const CONTENT_TYPES = [
  { id: 'reels', name: 'Reels / Video', icon: Video },
  { id: 'post', name: 'Tekli Post', icon: FileImage },
  { id: 'carousel', name: 'Carousel (Kaydırmalı)', icon: Layers },
  { id: 'story', name: 'Story (Hikaye)', icon: Sparkles },
  { id: 'shorts', name: 'Shorts', icon: Video },
  { id: 'tweet', name: 'Tweet / Metin', icon: FileText },
]

export function EditTaskModal({
  isOpen,
  task,
  onClose,
  brands,
  employees,
}: EditTaskModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(task?.platform ?? 'instagram')
  const [selectedContent, setSelectedContent] = useState<string>(task?.content ?? 'reels')

  // Görev değiştiğinde seçimleri senkronize et
  useEffect(() => {
    if (task) {
      setSelectedPlatform(task.platform)
      setSelectedContent(task.content)
    }
  }, [task])

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateTaskAction(prevState, formData)
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

  const formattedDueDate = task.dueDate ? task.dueDate.slice(0, 10) : ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:border-[#272b37] dark:bg-[#16181f]">
        {/* Başlık Barı */}
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#272b37]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Görevi Düzenle</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {task.brandName} &bull; Görev detaylarını ve atamayı güncelleyin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer dark:hover:bg-[#222632] dark:hover:text-slate-200"
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

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="task_id" value={task.id} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Marka Seçimi */}
            <div>
              <label htmlFor="edit-task-brand" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Marka <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select
                  id="edit-task-brand"
                  name="brand_id"
                  required
                  defaultValue={task.brandId}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-[#1a1d25]">
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Görevli Personel */}
            <div>
              <label htmlFor="edit-task-assignee" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Görevli Personel
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select
                  id="edit-task-assignee"
                  name="assignee_id"
                  defaultValue={task.assigneeId ?? ''}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                >
                  <option value="" className="dark:bg-[#1a1d25]">📋 İş Havuzu (Atanmamış)</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id} className="dark:bg-[#1a1d25]">
                      👤 {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Platform Seçimi */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Yayın Platformu <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {PLATFORMS.map((p) => (
                <label key={p.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="platform"
                    value={p.id}
                    checked={selectedPlatform === p.id}
                    onChange={() => setSelectedPlatform(p.id)}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700 transition-all dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 ${p.color}`}
                  >
                    <span>{p.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* İçerik Formatı Seçimi */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              İçerik Formatı <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CONTENT_TYPES.map((c) => {
                const Icon = c.icon
                const isChecked = selectedContent === c.id
                return (
                  <label key={c.id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="content"
                      value={c.id}
                      checked={isChecked}
                      onChange={() => setSelectedContent(c.id)}
                      className="peer sr-only"
                    />
                    <div
                      className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-all ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-700 shadow-xs dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{c.name}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Teslim Tarihi */}
            <div>
              <label htmlFor="edit-task-due-date" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Teslim / Prodüksiyon Tarihi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="edit-task-due-date"
                  name="due_date"
                  type="date"
                  required
                  defaultValue={formattedDueDate}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                />
              </div>
            </div>

            {/* Referans / Varlık Linki */}
            <div>
              <label htmlFor="edit-task-content-url" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Referans / Çalışma Bağlantısı <span className="text-slate-400 dark:text-slate-500 font-normal">(İsteğe bağlı)</span>
              </label>
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="edit-task-content-url"
                  name="content_url"
                  type="url"
                  placeholder="https://drive.google.com/... veya Figma"
                  defaultValue={task.contentUrl ?? ''}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                />
              </div>
            </div>
          </div>

          {/* Brief & Prodüksiyon Notu */}
          <div>
            <label htmlFor="edit-task-note" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Brief & İçerik Notu
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <textarea
                id="edit-task-note"
                name="note"
                rows={3}
                placeholder="Video kurgu talimatları, metin taslağı, kullanılacak müzik veya kreatif yönlendirmeler..."
                defaultValue={task.assignmentNote ?? ''}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
              />
            </div>
          </div>

          {/* Alt Butonlar */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-[#272b37]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:bg-[#222632]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
