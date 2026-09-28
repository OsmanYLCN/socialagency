'use client'

import { useActionState, useEffect } from 'react'
import { X, Trash2, AlertTriangle, Loader2, AlertCircle } from 'lucide-react'
import { deleteContentTemplateAction } from '@/app/actions/agency'
import type { ContentTemplateItem } from './ContentPlanClientView'

interface DeleteTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: ContentTemplateItem | null
}

const DAYS_MAP: Record<number, string> = {
  1: 'Pazartesi',
  2: 'Salı',
  3: 'Çarşamba',
  4: 'Perşembe',
  5: 'Cuma',
  6: 'Cumartesi',
  7: 'Pazar',
}

export function DeleteTemplateModal({
  isOpen,
  onClose,
  template,
}: DeleteTemplateModalProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await deleteContentTemplateAction(prevState, formData)
      if (result.success) {
        onClose()
      }
      return result
    },
    null
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Arka Plan Karartmasi */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Penceresi */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all">
        {/* Baslik */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Şablonu Sil</h2>
              <p className="text-xs text-slate-500">Bu kural haftalık plandan kaldırılacak</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Icerik */}
        <form action={formAction} className="space-y-4 px-6 py-5">
          <input type="hidden" name="template_id" value={template.id} />

          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs text-slate-700 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Marka:</span>
              <span className="font-semibold text-slate-900">{template.brand_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Yayın Günü:</span>
              <span className="font-semibold text-slate-900">{DAYS_MAP[template.day_of_week] || 'Bilinmiyor'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Platform & Format:</span>
              <span className="font-semibold text-slate-900 uppercase">
                {template.platform} - {template.content}
              </span>
            </div>
            {template.quantity > 1 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Adet:</span>
                <span className="font-semibold text-slate-900">{template.quantity}x</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Bu işlem içerik şablonunu haftalık plandan silecektir. <strong>Geçmişte bu şablondan üretilmiş olan mevcut görevleriniz silinmez ve korunur.</strong>
          </p>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              <span>Şablonu Sil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
