'use client'

import { useTransition } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  FileImage,
  Layers,
  Sparkles,
  FileText,
  Clock,
  Building2,
  CheckCircle2,
  PauseCircle,
} from 'lucide-react'
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  XTwitterIcon,
  LinkedinIcon,
} from '@/components/icons/PlatformIcons'
import { toggleContentTemplateStatusAction } from '@/app/actions/agency'
import type { ContentTemplateItem } from './ContentPlanClientView'

interface ContentTemplateMatrixProps {
  templates: ContentTemplateItem[]
  onOpenCreateModalWithDay: (day: number) => void
  onOpenEditModal: (template: ContentTemplateItem) => void
  onOpenDeleteModal: (template: ContentTemplateItem) => void
}

const DAYS_OF_WEEK = [
  { num: 1, name: 'Pazartesi', short: 'Pzt' },
  { num: 2, name: 'Salı', short: 'Sal' },
  { num: 3, name: 'Çarşamba', short: 'Çar' },
  { num: 4, name: 'Perşembe', short: 'Per' },
  { num: 5, name: 'Cuma', short: 'Cum' },
  { num: 6, name: 'Cumartesi', short: 'Cmt' },
  { num: 7, name: 'Pazar', short: 'Paz' },
]

function renderPlatformBadge(platform: string) {
  const p = platform.toLowerCase()
  switch (p) {
    case 'instagram':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50/70 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
          <InstagramIcon className="h-3 w-3 shrink-0" />
          <span>Instagram</span>
        </span>
      )
    case 'tiktok':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/90 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
          <TikTokIcon className="h-3 w-3 shrink-0" />
          <span>TikTok</span>
        </span>
      )
    case 'youtube':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-red-100 bg-red-50/70 px-2 py-0.5 text-[11px] font-semibold text-red-700">
          <YoutubeIcon className="h-3 w-3 shrink-0" />
          <span>YouTube</span>
        </span>
      )
    case 'x':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
          <XTwitterIcon className="h-3 w-3 shrink-0" />
          <span>X</span>
        </span>
      )
    case 'linkedin':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-sky-100 bg-sky-50/70 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
          <LinkedinIcon className="h-3 w-3 shrink-0" />
          <span>LinkedIn</span>
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
          {platform}
        </span>
      )
  }
}

function renderFormatBadge(content: string) {
  const c = content.toLowerCase()
  switch (c) {
    case 'reels':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-purple-100 bg-purple-50/70 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
          <Video className="h-2.5 w-2.5" />
          Reels
        </span>
      )
    case 'post':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50/70 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
          <FileImage className="h-2.5 w-2.5" />
          Post
        </span>
      )
    case 'carousel':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50/70 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
          <Layers className="h-2.5 w-2.5" />
          Carousel
        </span>
      )
    case 'story':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-pink-100 bg-pink-50/70 px-1.5 py-0.5 text-[10px] font-medium text-pink-700">
          <Sparkles className="h-2.5 w-2.5" />
          Story
        </span>
      )
    case 'shorts':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50/70 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
          <Video className="h-2.5 w-2.5" />
          Shorts
        </span>
      )
    case 'tweet':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
          <FileText className="h-2.5 w-2.5" />
          Tweet
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
          {content}
        </span>
      )
  }
}

export function ContentTemplateMatrix({
  templates,
  onOpenCreateModalWithDay,
  onOpenEditModal,
  onOpenDeleteModal,
}: ContentTemplateMatrixProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (templateId: string) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('template_id', templateId)
      await toggleContentTemplateStatusAction(null, formData)
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
      {DAYS_OF_WEEK.map((day) => {
        const dayTemplates = templates.filter((t) => t.day_of_week === day.num)
        const totalItemsForDay = dayTemplates
          .filter((t) => t.is_active)
          .reduce((sum, t) => sum + (t.quantity > 0 ? t.quantity : 1), 0)

        return (
          <div
            key={day.num}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3 shadow-xs transition-all hover:border-slate-300"
          >
            {/* Gun Basligi */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">{day.name}</span>
                <span className="rounded-full bg-slate-200/80 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600">
                  {totalItemsForDay}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenCreateModalWithDay(day.num)}
                title={`${day.name} gününe şablon ekle`}
                className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Sablon Kartlari Listesi */}
            <div className="mt-3 flex flex-1 flex-col gap-2.5">
              {dayTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`group relative flex flex-col justify-between rounded-xl border bg-white p-3 shadow-2xs transition-all hover:shadow-xs ${
                    template.is_active
                      ? 'border-slate-200/90 hover:border-slate-300'
                      : 'border-slate-200/50 bg-slate-50/80 opacity-70'
                  }`}
                >
                  {/* Marka & Aktif/Pasif Toggle */}
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="flex items-center gap-1 truncate text-[11px] font-semibold text-slate-700">
                      <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
                      <span className="truncate">{template.brand_name}</span>
                    </span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleToggle(template.id)}
                      title={template.is_active ? 'Şablonu duraklat' : 'Şablonu aktifleştir'}
                      className="shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      {template.is_active ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <PauseCircle className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>

                  {/* Platform & Format Etiketleri */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {renderPlatformBadge(template.platform)}
                    {renderFormatBadge(template.content)}
                    {template.quantity > 1 && (
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100">
                        {template.quantity}x
                      </span>
                    )}
                  </div>

                  {/* Varsa Varsayilan Not/Brief */}
                  {template.default_description && (
                    <p className="mt-2 line-clamp-2 text-[11px] text-slate-500 italic">
                      &quot;{template.default_description}&quot;
                    </p>
                  )}

                  {/* Aksiyon Butonlari (Hover durumunda veya mobilde gorunur) */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.is_active ? 'Haftalık Rutin' : 'Devre Dışı'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(template)}
                        title="Şablonu Düzenle"
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDeleteModal(template)}
                        title="Şablonu Sil"
                        className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bos Gun Durumu */}
              {dayTemplates.length === 0 && (
                <button
                  type="button"
                  onClick={() => onOpenCreateModalWithDay(day.num)}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 bg-white/60 p-4 text-center text-slate-400 transition-all hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-600 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-[11px] font-medium">Şablon Ekle</span>
                </button>
              )}
            </div>

            {/* Sutun Alti Hizli Ekle Butonu */}
            {dayTemplates.length > 0 && (
              <button
                type="button"
                onClick={() => onOpenCreateModalWithDay(day.num)}
                className="mt-2.5 flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-1.5 text-[11px] font-medium text-slate-500 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Ekle</span>
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
