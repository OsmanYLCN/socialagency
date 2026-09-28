'use client'

import { useState } from 'react'
import { ContentPlanHeader } from './ContentPlanHeader'
import { ContentPlanMetrics } from './ContentPlanMetrics'
import { ContentTemplateMatrix } from './ContentTemplateMatrix'
import { CreateTemplateModal } from './CreateTemplateModal'
import { EditTemplateModal } from './EditTemplateModal'
import { DeleteTemplateModal } from './DeleteTemplateModal'
import { GenerateTasksModal } from './GenerateTasksModal'

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

  // Modallar icin durumlar
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [preselectedDay, setPreselectedDay] = useState(1)
  const [editingTemplate, setEditingTemplate] = useState<ContentTemplateItem | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<ContentTemplateItem | null>(null)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  // Markaya gore filtrelenmis sablonlar
  const filteredTemplates = templates.filter((tpl) => {
    if (selectedBrandId === 'all') return true
    return tpl.brand_id === selectedBrandId
  })

  const handleOpenCreateWithDay = (day: number) => {
    setPreselectedDay(day)
    setIsCreateModalOpen(true)
  }

  const handleOpenGeneralCreate = () => {
    setPreselectedDay(1)
    setIsCreateModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 1. Baslik, Marka Filtresi ve Aksiyon Butonlari */}
      <ContentPlanHeader
        brands={brands}
        selectedBrandId={selectedBrandId}
        onSelectBrand={setSelectedBrandId}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenCreateModal={handleOpenGeneralCreate}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
      />

      {/* 2. 4 Ozet KPI Metrik Karti */}
      <ContentPlanMetrics
        weeklyTargetCount={weeklyTargetCount}
        activeTemplatesCount={activeTemplatesCount}
        totalTemplatesCount={totalTemplatesCount}
        monthlyCompletionRate={monthlyCompletionRate}
        totalMonthlyTasks={totalMonthlyTasks}
        completedMonthlyTasks={completedMonthlyTasks}
        topPlatform={topPlatform}
      />

      {/* 3. Ana Icerik Gorunumu */}
      {viewMode === 'matrix' ? (
        <ContentTemplateMatrix
          templates={filteredTemplates}
          onOpenCreateModalWithDay={handleOpenCreateWithDay}
          onOpenEditModal={(tpl) => setEditingTemplate(tpl)}
          onOpenDeleteModal={(tpl) => setDeletingTemplate(tpl)}
        />
      ) : (
        /* Asama 5'te InteractiveContentCalendar baglanacak */
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">İnteraktif Canlı Takvim Görünümü</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Aylık ve haftalık canlı görev takvimi Aşama 5 kapsamında bu alana entegre edilecektir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Şablon Matrisine Dön
          </button>
        </div>
      )}

      {/* 4. Yeni Sablon Ekleme Modali */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        brands={brands}
        initialDay={preselectedDay}
        initialBrandId={selectedBrandId}
      />

      {/* 5. Sablon Duzenleme Modali */}
      <EditTemplateModal
        isOpen={Boolean(editingTemplate)}
        onClose={() => setEditingTemplate(null)}
        brands={brands}
        template={editingTemplate}
      />

      {/* 6. Sablon Silme Onay Modali */}
      <DeleteTemplateModal
        isOpen={Boolean(deletingTemplate)}
        onClose={() => setDeletingTemplate(null)}
        template={deletingTemplate}
      />

      {/* 7. Haftalik Gorevleri Uret Modali */}
      <GenerateTasksModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        brands={brands}
        templates={templates}
        initialBrandId={selectedBrandId}
      />
    </div>
  )
}
