'use client'

import { useState, useTransition, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { EmployeeTaskItem, BrandFilterOption } from '../../types'
import { EmployeeTasksHeader } from './EmployeeTasksHeader'
import { EmployeeTasksFilterBar } from './EmployeeTasksFilterBar'
import { EmployeeTasksKanbanView } from './EmployeeTasksKanbanView'
import { EmployeeTasksListView } from './EmployeeTasksListView'
import { EmployeeTaskDetailModal } from './EmployeeTaskDetailModal'
import { claimTaskAction } from '@/app/actions/employee'
import { getSavedSettings } from '@/lib/settings'

interface EmployeeTasksClientViewProps {
  myTasks: EmployeeTaskItem[]
  poolTasks: EmployeeTaskItem[]
  brands: BrandFilterOption[]
  initialTab?: 'my_tasks' | 'pool'
  initialTaskId?: string
  initialStatus?: string
}

export function EmployeeTasksClientView({
  myTasks,
  poolTasks,
  brands,
  initialTab = 'my_tasks',
  initialTaskId,
  initialStatus,
}: EmployeeTasksClientViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'my_tasks' | 'pool'>(initialTab)
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'all')

  // Kullanıcının Ayarlar -> Çalışma Alanı sekmesinde seçtiği varsayılan görünümü uygula
  useEffect(() => {
    const saved = getSavedSettings()
    if (saved.defaultTaskView === 'kanban' || saved.defaultTaskView === 'list') {
      setActiveView(saved.defaultTaskView)
    }
  }, [])

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

  const [, startTransition] = useTransition()

  // URL parametreleri (initialTab, initialStatus, initialTaskId) değiştiğinde senkronize et
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (initialStatus) setSelectedStatus(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    if (initialTaskId) {
      const target =
        myTasks.find((t) => t.id === initialTaskId) ||
        poolTasks.find((t) => t.id === initialTaskId) ||
        null
      if (target) {
        setSelectedTask(target)
        setIsModalOpen(true)
      }
    }
  }, [initialTaskId, myTasks, poolTasks])

  // Server revalidation sonrası açık modalın seçili görev verisini anlık güncelle
  useEffect(() => {
    if (selectedTask) {
      const updated =
        myTasks.find((t) => t.id === selectedTask.id) ||
        poolTasks.find((t) => t.id === selectedTask.id) ||
        null
      if (updated) {
        setSelectedTask(updated)
      } else {
        setSelectedTask(null)
        setIsModalOpen(false)
      }
    }
  }, [myTasks, poolTasks])

  const rawTasks = activeTab === 'my_tasks' ? myTasks : poolTasks

  const filteredTasks = useMemo(() => {
    return rawTasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLocaleLowerCase('tr-TR')
        const brandMatch = task.brand_name.toLocaleLowerCase('tr-TR').includes(query)
        const noteMatch = (task.assignment_note || '').toLocaleLowerCase('tr-TR').includes(query)
        const platformMatch = task.platform.toLocaleLowerCase('tr-TR').includes(query)
        if (!brandMatch && !noteMatch && !platformMatch) return false
      }

      if (selectedBrand !== 'all' && task.brand_id !== selectedBrand) {
        return false
      }

      if (selectedPlatform !== 'all' && task.platform !== selectedPlatform) {
        return false
      }

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
