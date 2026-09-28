'use client'

import { useActionState, useEffect, useState } from 'react'
import {
  X,
  Plus,
  Building2,
  Calendar,
  Layers,
  FileText,
  Loader2,
  AlertCircle,
  Video,
  FileImage,
  Sparkles,
  Hash,
} from 'lucide-react'
import { createContentTemplateAction } from '@/app/actions/agency'
import type { BrandOption } from './ContentPlanClientView'

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  brands: BrandOption[]
  initialDay?: number
  initialBrandId?: string
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', borderClass: 'peer-checked:border-rose-500 peer-checked:bg-rose-50/60 peer-checked:text-rose-700' },
  { id: 'tiktok', name: 'TikTok', borderClass: 'peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white' },
  { id: 'youtube', name: 'YouTube', borderClass: 'peer-checked:border-red-600 peer-checked:bg-red-50/60 peer-checked:text-red-700' },
  { id: 'x', name: 'X (Twitter)', borderClass: 'peer-checked:border-slate-800 peer-checked:bg-slate-100 peer-checked:text-slate-900' },
  { id: 'linkedin', name: 'LinkedIn', borderClass: 'peer-checked:border-sky-600 peer-checked:bg-sky-50/60 peer-checked:text-sky-700' },
]

const CONTENT_TYPES = [
  { id: 'reels', name: 'Reels / Video', icon: Video },
  { id: 'post', name: 'Tekli Post', icon: FileImage },
  { id: 'carousel', name: 'Carousel (Kaydırmalı)', icon: Layers },
  { id: 'story', name: 'Story (Hikaye)', icon: Sparkles },
  { id: 'shorts', name: 'Shorts', icon: Video },
  { id: 'tweet', name: 'Tweet / Metin', icon: FileText },
]

const DAYS_OF_WEEK = [
  { num: 1, name: 'Pazartesi' },
  { num: 2, name: 'Salı' },
  { num: 3, name: 'Çarşamba' },
  { num: 4, name: 'Perşembe' },
  { num: 5, name: 'Cuma' },
  { num: 6, name: 'Cumartesi' },
  { num: 7, name: 'Pazar' },
]

export function CreateTemplateModal({
  isOpen,
  onClose,
  brands,
  initialDay = 1,
  initialBrandId,
}: CreateTemplateModalProps) {
  const [selectedBrand, setSelectedBrand] = useState(
    initialBrandId && initialBrandId !== 'all' ? initialBrandId : brands[0]?.id || ''
  )
  const [selectedDay, setSelectedDay] = useState(initialDay)
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')
  const [selectedContent, setSelectedContent] = useState('reels')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (isOpen) {
      if (initialBrandId && initialBrandId !== 'all') {
        setSelectedBrand(initialBrandId)
      } else if (brands.length > 0) {
        setSelectedBrand(brands[0].id)
      }
      setSelectedDay(initialDay || 1)
    }
  }, [isOpen, initialDay, initialBrandId, brands])

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await createContentTemplateAction(prevState, formData)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Arka Plan Karartmasi */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Penceresi */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl transition-all">
        {/* Baslik */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Yeni İçerik Şablonu Ekle</h2>
              <p className="text-xs text-slate-500">Haftalık rutin paylaşım kuralı tanımlayın</p>
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

        {/* Form */}
        <form action={formAction} className="space-y-4 px-6 py-5">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Marka & Gun Secimi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Marka <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  name="brand_id"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-medium text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Yayınlanacağı Gün <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  name="day_of_week"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-medium text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d.num} value={d.num}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Platform Secimi */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Sosyal Medya Platformu <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((platform) => (
                <label key={platform.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="platform"
                    value={platform.id}
                    checked={selectedPlatform === platform.id}
                    onChange={() => setSelectedPlatform(platform.id)}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex items-center justify-center rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 ${platform.borderClass}`}
                  >
                    {platform.name}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Icerik Formati Secimi */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              İçerik Formatı <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <label key={type.id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="content"
                      value={type.id}
                      checked={selectedContent === type.id}
                      onChange={() => setSelectedContent(type.id)}
                      className="peer sr-only"
                    />
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 py-2 px-2.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50/70 peer-checked:text-indigo-700">
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{type.name}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Adet */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Haftalık Paylaşım Adedi
            </label>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                name="quantity"
                min="1"
                max="20"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Belirtilen gün içinde bu formattan kaç adet üretileceğini belirler (Genelde 1).
            </p>
          </div>

          {/* Varsayilan Aciklama / Brief Notu */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Varsayılan Brief / Strateji Notu <span className="font-normal text-slate-400">(İsteğe bağlı)</span>
            </label>
            <textarea
              name="default_description"
              rows={2}
              maxLength={500}
              placeholder="Örn: Haftalık ürün tanıtım videosu veya eğlenceli reels konsepti..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

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
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Şablonu Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
