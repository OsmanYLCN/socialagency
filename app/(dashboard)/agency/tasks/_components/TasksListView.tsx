'use client'

import { useState, useTransition, useMemo } from 'react'
import {
  Calendar,
  ExternalLink,
  MoreHorizontal,
  User,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  Pencil,
  Trash2,
  Video,
  FileImage,
  Layers,
  Sparkles,
  ArrowUpDown,
  MessageSquare,
  UserCheck,
} from 'lucide-react'
import type { TaskItem, EmployeeOption } from './TasksClientView'
import { updateTaskStatusAction, assignTaskAction } from '@/app/actions/agency'
import { getTaskDueStatus } from '@/lib/utils'

interface TasksListViewProps {
  tasks: TaskItem[]
  employees: EmployeeOption[]
  onTaskClick: (task: TaskItem) => void
  onEditClick: (task: TaskItem) => void
  onDeleteClick: (task: TaskItem) => void
}

type SortField = 'dueDate' | 'brandName' | 'status' | 'platform'
type SortOrder = 'asc' | 'desc'

// Platform stil eşlemesi
const PLATFORM_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  instagram: {
    label: 'Instagram',
    badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80',
    dot: 'bg-fuchsia-500',
  },
  tiktok: {
    label: 'TikTok',
    badge: 'bg-slate-900 text-white border-slate-900',
    dot: 'bg-cyan-400',
  },
  linkedin: {
    label: 'LinkedIn',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-600',
  },
  youtube: {
    label: 'YouTube',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-600',
  },
  x: {
    label: 'X (Twitter)',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    dot: 'bg-slate-700',
  },
}

// Durum stil eşlemesi
const STATUS_CONFIG: Record<TaskItem['status'], { label: string; badge: string; dot: string }> = {
  unassigned: {
    label: 'İş Havuzu',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  assigned: {
    label: 'Üretimde',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
  },
  pending_approval: {
    label: 'Onay Bekliyor',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  revision_requested: {
    label: 'Revizyonda',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
  },
  completed: {
    label: 'Tamamlandı',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
}

function getFormatIcon(content: string) {
  switch (content) {
    case 'reels':
    case 'shorts':
      return <Video className="h-3.5 w-3.5" />
    case 'carousel':
      return <Layers className="h-3.5 w-3.5" />
    case 'post':
    case 'story':
      return <FileImage className="h-3.5 w-3.5" />
    default:
      return <Sparkles className="h-3.5 w-3.5" />
  }
}

export function TasksListView({
  tasks,
  employees,
  onTaskClick,
  onEditClick,
  onDeleteClick,
}: TasksListViewProps) {
  const [sortField, setSortField] = useState<SortField>('dueDate')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openAssignId, setOpenAssignId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Sıralama fonksiyonu
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0
      if (sortField === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (sortField === 'brandName') {
        comparison = a.brandName.localeCompare(b.brandName, 'tr-TR')
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status)
      } else if (sortField === 'platform') {
        comparison = a.platform.localeCompare(b.platform)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [tasks, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Hızlı Durum Değiştirme
  const handleStatusChange = (taskId: string, newStatus: TaskItem['status']) => {
    setOpenMenuId(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', taskId)
      formData.set('status', newStatus)
      await updateTaskStatusAction(null, formData)
    })
  }

  // Hızlı Personel Atama
  const handleAssign = (taskId: string, assigneeId: string) => {
    setOpenAssignId(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', taskId)
      formData.set('assignee_id', assigneeId)
      await assignTaskAction(null, formData)
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <th
                onClick={() => handleSort('platform')}
                className="py-3.5 pl-6 pr-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Platform & Format</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('brandName')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Marka & Brief Notu</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>

              <th className="py-3.5 px-4">Görevli Personel</th>

              <th
                onClick={() => handleSort('dueDate')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Teslim Tarihi</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Aşama / Durum</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>

              <th className="py-3.5 px-4">İçerik Linki</th>

              <th className="py-3.5 pl-4 pr-6 text-right">İşlemler</th>
            </tr>
          </thead>

          <tbody className={`divide-y divide-slate-100 text-xs ${isPending ? 'opacity-60' : ''}`}>
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <p className="text-sm font-semibold text-slate-600">Filtrelere uygun görev bulunamadı</p>
                  <p className="mt-1 text-xs text-slate-400">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => {
                const platformInfo = PLATFORM_CONFIG[task.platform] ?? {
                  label: task.platform,
                  badge: 'bg-slate-100 text-slate-700 border-slate-200',
                  dot: 'bg-slate-500',
                }
                const statusInfo = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.unassigned

                const { isOverdue, isToday, isCompleted } = getTaskDueStatus(task.dueDate, task.status)

                return (
                  <tr
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* 1. Platform & Format */}
                    <td className="py-3.5 pl-6 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${platformInfo.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${platformInfo.dot}`} />
                          {platformInfo.label}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 uppercase">
                          {getFormatIcon(task.content)}
                          {task.content}
                        </span>
                      </div>
                    </td>

                    {/* 2. Marka & Brief Notu */}
                    <td className="py-3.5 px-4 min-w-[200px] max-w-xs">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {task.brandName}
                          </span>
                          {task.revisionsCount > 0 && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded shrink-0"
                              title={`${task.revisionsCount} kez revizyon istendi`}
                            >
                              <RotateCcw className="h-2.5 w-2.5" />
                              {task.revisionsCount} rev
                            </span>
                          )}
                          {task.commentsCount > 0 && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 shrink-0"
                              title={`${task.commentsCount} yorum`}
                            >
                              <MessageSquare className="h-2.5 w-2.5" />
                              {task.commentsCount}
                            </span>
                          )}
                        </div>
                        {task.assignmentNote ? (
                          <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                            {task.assignmentNote}
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-300 italic">Brief girilmemiş</span>
                        )}
                      </div>
                    </td>

                    {/* 3. Görevli Personel */}
                    <td
                      className="py-3.5 px-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative">
                        {task.assigneeName ? (
                          <button
                            type="button"
                            onClick={() =>
                              setOpenAssignId(openAssignId === task.id ? null : task.id)
                            }
                            className="flex items-center gap-2 rounded-lg py-1 px-1.5 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                            title="Görevliyi değiştir"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 shrink-0">
                              {task.assigneeName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-700 truncate max-w-[120px]">
                              {task.assigneeName}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setOpenAssignId(openAssignId === task.id ? null : task.id)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <User className="h-3 w-3" />
                            <span>Ata</span>
                          </button>
                        )}

                        {/* Personel Atama Dropdown */}
                        {openAssignId === task.id && (
                          <div
                            className="absolute left-0 top-8 z-30 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="px-2 py-1 text-[11px] font-bold text-slate-800 border-b border-slate-100 mb-1">
                              Personele Ata
                            </p>
                            <button
                              type="button"
                              onClick={() => handleAssign(task.id, '')}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <span>📋 İş Havuzuna Gönder (Atanmamış)</span>
                            </button>
                            {employees.map((emp) => (
                              <button
                                key={emp.id}
                                type="button"
                                onClick={() => handleAssign(task.id, emp.id)}
                                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                                  task.assigneeId === emp.id
                                    ? 'bg-indigo-50 font-bold text-indigo-700'
                                    : 'text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                <span className="truncate">{emp.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 4. Teslim Tarihi */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold ${
                          isOverdue
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : isToday
                            ? 'bg-amber-100 text-amber-800 font-bold'
                            : isCompleted
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-600 bg-slate-50'
                        }`}
                      >
                        {isOverdue ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        )}
                        <span>{task.dueDate}</span>
                        {isOverdue && <span className="text-[10px] uppercase font-bold">(Gecikti)</span>}
                        {isToday && <span className="text-[10px] uppercase font-bold">(Bugün)</span>}
                      </div>
                    </td>

                    {/* 5. Durum / Aşama */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${statusInfo.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* 6. İçerik Linki */}
                    <td
                      className="py-3.5 px-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.contentUrl ? (
                        <a
                          href={task.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Görüntüle</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* 7. İşlemler Menüsü */}
                    <td
                      className="py-3.5 pl-4 pr-6 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(openMenuId === task.id ? null : task.id)
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Aksiyon Menüsü */}
                        {openMenuId === task.id && (
                          <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null)
                                onTaskClick(task)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <span>Detay Gör & Yorum</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null)
                                onEditClick(task)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5 text-slate-400" />
                              <span>Görevi Düzenle</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Aşama Değiştir
                            </div>
                            {task.status !== 'assigned' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(task.id, 'assigned')}
                                className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <span>Üretime Al</span>
                              </button>
                            )}
                            {task.status !== 'pending_approval' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(task.id, 'pending_approval')}
                                className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                              >
                                <span>Onaya Sun</span>
                              </button>
                            )}
                            {task.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(task.id, 'completed')}
                                className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Tamamlandı</span>
                              </button>
                            )}

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null)
                                onDeleteClick(task)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Görevi Sil</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
