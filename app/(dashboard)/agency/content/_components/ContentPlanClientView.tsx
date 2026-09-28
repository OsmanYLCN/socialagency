'use client'

import { useState } from 'react'
import { ContentPlanHeader } from './ContentPlanHeader'
import { ContentPlanMetrics } from './ContentPlanMetrics'
import { ContentTemplateMatrix } from './ContentTemplateMatrix'
import { InteractiveContentCalendar } from './InteractiveContentCalendar'
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
  calendarTasks,
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
        <InteractiveContentCalendar
          tasks={calendarTasks}
          selectedBrandId={selectedBrandId}
        />
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
