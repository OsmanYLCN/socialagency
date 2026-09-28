'use client'

import { useState } from 'react'
import { ContentPlanMetrics } from './ContentPlanMetrics'

export interface BrandOption {
  id: string
  name: string
}

export interface ContentTemplateItem {
  id: string
  brand_id: string
  brand_name: string
  day_of_week: number
  platform: string
  content: string
  quantity: number
  default_description: string | null
  is_active: boolean
  last_generated_at: string | null
  created_at: string
}

export interface CalendarTaskItem {
  id: string
  brand_id: string
  brand_name: string
  template_id: string | null
  platform: string
  content: string
  due_date: string
  status: string
  assignment_note: string | null
}

export interface ContentPlanClientViewProps {
  agencyName: string
  brands: BrandOption[]
  templates: ContentTemplateItem[]
  calendarTasks: CalendarTaskItem[]
  weeklyTargetCount: number
  activeTemplatesCount: number
  totalTemplatesCount: number
  monthlyCompletionRate: number
  totalMonthlyTasks: number
  completedMonthlyTasks: number
  topPlatform: { platform: string; count: number } | null
}

export function ContentPlanClientView({
  brands,
  templates,
  weeklyTargetCount,
  activeTemplatesCount,
  totalTemplatesCount,
  monthlyCompletionRate,
  totalMonthlyTasks,
  completedMonthlyTasks,
  topPlatform,
}: ContentPlanClientViewProps) {
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'matrix' | 'calendar'>('matrix')

  // Markaya gore filtrelenmis sablonlar
  const filteredTemplates = templates.filter((tpl) => {
    if (selectedBrandId === 'all') return true
    return tpl.brand_id === selectedBrandId
  })

  return (
    <div className="space-y-6">
      {/* 4 Ozet KPI Metrik Karti */}
      <ContentPlanMetrics
        weeklyTargetCount={weeklyTargetCount}
        activeTemplatesCount={activeTemplatesCount}
        totalTemplatesCount={totalTemplatesCount}
        monthlyCompletionRate={monthlyCompletionRate}
        totalMonthlyTasks={totalMonthlyTasks}
        completedMonthlyTasks={completedMonthlyTasks}
        topPlatform={topPlatform}
      />

      {/* Gecici Asama 2 Bilgilendirme Alani */}
      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">
            Aşama 2 Veri Altyapısı Aktif
          </h3>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            {brands.length} marka ve {filteredTemplates.length} şablon için veritabanı bağlantısı sağlandı.
            Aşama 3&apos;te Haftalık Şablon Matrisi ve Şablon Yönetim modalları eklenecektir.
          </p>
        </div>
      </div>
    </div>
  )
}
