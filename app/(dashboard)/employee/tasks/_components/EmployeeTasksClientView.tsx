'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { EmployeeTaskItem, BrandFilterOption } from '../../types'
import { EmployeeTasksHeader } from './EmployeeTasksHeader'
import { EmployeeTasksFilterBar } from './EmployeeTasksFilterBar'
import { EmployeeTasksKanbanView } from './EmployeeTasksKanbanView'
import { EmployeeTasksListView } from './EmployeeTasksListView'
import { EmployeeTaskDetailModal } from './EmployeeTaskDetailModal'
import { claimTaskAction } from '@/app/actions/employee'

interface EmployeeTasksClientViewProps {
  myTasks: EmployeeTaskItem[]
  poolTasks: EmployeeTaskItem[]
  brands: BrandFilterOption[]
  initialTab?: 'my_tasks' | 'pool'
  initialTaskId?: string
}

export function EmployeeTasksClientView({
  myTasks,
  poolTasks,
  brands,
  initialTab = 'my_tasks',
  initialTaskId,
}: EmployeeTasksClientViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'my_tasks' | 'pool'>(initialTab)
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const [selectedTask, setSelectedTask] = useState<EmployeeTaskItem | null>(() => {
    if (initialTaskId) {
      return (
        myTasks.find((t) => t.id === initialTaskId) ||
        poolTasks.find((t) => t.id === initialTaskId) ||
        null
      )
    }
    return null
  })
  const [isModalOpen, setIsModalOpen] = useState(Boolean(initialTaskId))

  const [isPending, startTransition] = useTransition()

  // Aktif sekmedeki görev havuzu
  const rawTasks = activeTab === 'my_tasks' ? myTasks : poolTasks

  // Filtrelenmiş görev listesi
  const filteredTasks = useMemo(() => {
    return rawTasks.filter((task) => {
      // Metin araması
      if (searchQuery.trim()) {
        const query = searchQuery.toLocaleLowerCase('tr-TR')
        const brandMatch = task.brand_name.toLocaleLowerCase('tr-TR').includes(query)
        const noteMatch = (task.assignment_note || '').toLocaleLowerCase('tr-TR').includes(query)
        const platformMatch = task.platform.toLocaleLowerCase('tr-TR').includes(query)
        if (!brandMatch && !noteMatch && !platformMatch) return false
      }

      // Marka filtresi
      if (selectedBrand !== 'all' && task.brand_id !== selectedBrand) {
        return false
      }

      // Platform filtresi
      if (selectedPlatform !== 'all' && task.platform !== selectedPlatform) {
        return false
      }

      // Durum filtresi (sadece Bana Atananlar'da)
      if (activeTab === 'my_tasks' && selectedStatus !== 'all' && task.status !== selectedStatus) {
        return false
      }

      return true
    })
  }, [rawTasks, searchQuery, selectedBrand, selectedPlatform, selectedStatus, activeTab])

  const handleTaskClick = (task: EmployeeTaskItem) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleClaimClick = async (task: EmployeeTaskItem) => {
    const formData = new FormData()
    formData.append('task_id', task.id)
    startTransition(async () => {
      await claimTaskAction(null, formData)
      router.refresh()
    })
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedBrand('all')
    setSelectedPlatform('all')
    setSelectedStatus('all')
  }

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Sekmeler */}
      <EmployeeTasksHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setSelectedStatus('all')
        }}
        activeView={activeView}
        onViewChange={setActiveView}
        myTasksCount={myTasks.length}
        poolCount={poolTasks.length}
      />

      {/* Arama ve Filtreleme Çubuğu */}
      <EmployeeTasksFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        brands={brands}
        activeTab={activeTab}
        onReset={handleResetFilters}
      />

      {/* Görünüm: Kanban veya Tablo/Liste */}
      {activeView === 'kanban' ? (
        <EmployeeTasksKanbanView
          tasks={filteredTasks}
          activeTab={activeTab}
          onTaskClick={handleTaskClick}
          onClaimClick={handleClaimClick}
        />
      ) : (
        <EmployeeTasksListView
          tasks={filteredTasks}
          isPool={activeTab === 'pool'}
          onTaskClick={handleTaskClick}
          onClaimClick={handleClaimClick}
        />
      )}

      {/* Görev Detay & İş Teslim Modalı */}
      <EmployeeTaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
        }}
        onTaskUpdated={() => {
          router.refresh()
        }}
      />
    </div>
  )
}
