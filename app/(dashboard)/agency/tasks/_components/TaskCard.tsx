'use client'

import { useState, useTransition } from 'react'
import {
  Calendar,
  MessageSquare,
  RotateCcw,
  ExternalLink,
  MoreHorizontal,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pencil,
  Trash2,
  UserCheck,
  Video,
  FileImage,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import type { TaskItem, EmployeeOption } from './TasksClientView'
import { updateTaskStatusAction, assignTaskAction } from '@/app/actions/agency'
import { getTaskDueStatus } from '@/lib/utils'

interface TaskCardProps {
  task: TaskItem
  employees: EmployeeOption[]
  onTaskClick: (task: TaskItem) => void
  onEditClick: (task: TaskItem) => void
  onDeleteClick: (task: TaskItem) => void
}

// Platform renk ve stil eşlemesi
const PLATFORM_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  instagram: {
    label: 'Instagram',
    badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-900/40',
    dot: 'bg-fuchsia-500',
  },
  tiktok: {
    label: 'TikTok',
    badge: 'bg-slate-900 text-white border-slate-900 dark:bg-black dark:border-slate-800 dark:text-slate-200',
    dot: 'bg-cyan-400',
  },
  linkedin: {
    label: 'LinkedIn',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40',
    dot: 'bg-blue-600',
  },
  youtube: {
    label: 'YouTube',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40',
    dot: 'bg-rose-600',
  },
  x: {
    label: 'X (Twitter)',
    badge: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-[#1a1d25] dark:text-slate-300 dark:border-[#272b37]',
    dot: 'bg-slate-700',
  },
}

// Format ikon ve etiket eşlemesi
function getFormatIcon(content: string) {
  switch (content) {
    case 'reels':
    case 'shorts':
      return <Video className="h-3 w-3" />
    case 'carousel':
      return <Layers className="h-3 w-3" />
    case 'post':
    case 'story':
      return <FileImage className="h-3 w-3" />
    default:
      return <Sparkles className="h-3 w-3" />
  }
}

export function TaskCard({
  task,
  employees,
  onTaskClick,
  onEditClick,
  onDeleteClick,
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const platformInfo = PLATFORM_CONFIG[task.platform] ?? {
    label: task.platform,
    badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1a1d25] dark:text-slate-300 dark:border-[#272b37]',
    dot: 'bg-slate-500',
  }

  // Tarih ve gecikme hesabı (saat dilimi kayması olmadan kesin hesaplama)
  const { isOverdue, isToday, isCompleted } = getTaskDueStatus(task.dueDate, task.status)

  // Hızlı Durum Değiştirme
  const handleStatusChange = (newStatus: TaskItem['status']) => {
    setIsMenuOpen(false)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', task.id)
      formData.set('status', newStatus)
      await updateTaskStatusAction(null, formData)
    })
  }

  // Hızlı Personel Atama
  const handleAssign = (assigneeId: string) => {
    setIsAssignOpen(false)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('task_id', task.id)
      formData.set('assignee_id', assigneeId)
      await assignTaskAction(null, formData)
    })
  }

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-4 shadow-xs transition-all duration-200 hover:shadow-md dark:bg-[#16181f] dark:border-[#272b37] dark:hover:border-[#383d4e] ${
        isOverdue
          ? 'border-rose-200/90 bg-rose-50/10 dark:border-rose-900/50 dark:bg-rose-950/20'
          : 'border-slate-200/80 hover:border-indigo-200'
      } ${isPending ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {/* 1. Üst Kısım: Platform & İçerik Rozeti ve Aksiyon Menüsü */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Platform Rozeti */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${platformInfo.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${platformInfo.dot}`} />
            {platformInfo.label}
          </span>

          {/* Format Rozeti */}
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 uppercase dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300">
            {getFormatIcon(task.content)}
            {task.content}
          </span>
        </div>

        {/* Aksiyon Menüsü Butonu */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen((v) => !v)
              setIsAssignOpen(false)
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer dark:text-slate-500 dark:hover:bg-[#1a1d25] dark:hover:text-slate-300"
            title="İşlemler"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Dropdown Menü */}
          {isMenuOpen && (
            <div
              className="absolute right-0 top-7 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 dark:border-[#272b37] dark:bg-[#1a1d25]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  onTaskClick(task)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer dark:text-slate-200 dark:hover:bg-[#222632] dark:hover:text-white"
              >
                <span>Detay Gör & Yorum</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsAssignOpen(true)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer dark:text-slate-200 dark:hover:bg-[#222632] dark:hover:text-white"
              >
                <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                <span>Görevliyi Değiştir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  onEditClick(task)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer dark:text-slate-200 dark:hover:bg-[#222632] dark:hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                <span>Görevi Düzenle</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-[#272b37]" />

              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Aşama Değiştir
              </div>
              {task.status !== 'assigned' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('assigned')}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer dark:text-blue-400 dark:hover:bg-blue-950/40"
                >
                  <ArrowRight className="h-3 w-3" /> Üretime Al
                </button>
              )}
              {task.status !== 'pending_approval' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('pending_approval')}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer dark:text-amber-400 dark:hover:bg-amber-950/40"
                >
                  <ArrowRight className="h-3 w-3" /> Onaya Sun
                </button>
              )}
              {task.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('completed')}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                >
                  <CheckCircle2 className="h-3 w-3" /> Tamamlandı
                </button>
              )}

              <div className="my-1 border-t border-slate-100 dark:border-[#272b37]" />

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  onDeleteClick(task)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Görevi Sil</span>
              </button>
            </div>
          )}

          {/* Hızlı Personel Seçim Menüsü */}
          {isAssignOpen && (
            <div
              className="absolute right-0 top-7 z-30 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100 dark:border-[#272b37] dark:bg-[#1a1d25]"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-2 py-1 text-[11px] font-bold text-slate-800 border-b border-slate-100 mb-1 dark:border-[#272b37] dark:text-slate-200">
                Personele Ata
              </p>
              <button
                type="button"
                onClick={() => handleAssign('')}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer dark:text-slate-300 dark:hover:bg-[#222632]"
              >
                <span>📋 İş Havuzuna Gönder (Atanmamış)</span>
              </button>
              {employees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleAssign(emp.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    task.assigneeId === emp.id
                      ? 'bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#222632]'
                  }`}
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{emp.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Tıklanabilir Gövde: Marka Adı & Brief Notu */}
      <div
        onClick={() => onTaskClick(task)}
        className="mt-2.5 cursor-pointer space-y-1.5"
      >
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 dark:text-slate-100 dark:group-hover:text-indigo-400">
          {task.brandName}
        </h4>

        {task.assignmentNote ? (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed dark:text-slate-400">
            {task.assignmentNote}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 dark:text-slate-500">Brief açıklaması girilmemiş</p>
        )}
      </div>

      {/* 3. İçerik Linki / Medya Göstergesi (Varsa) */}
      {task.contentUrl && (
        <a
          href={task.contentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/70 px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors truncate max-w-full dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate">Tasarım / İçerik Linki</span>
        </a>
      )}

      {/* 4. Alt Bilgi: Teslim Tarihi, Görevli Avatarı & Sayaçlar */}
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs dark:border-[#272b37]">
        {/* Teslim Tarihi Rozeti */}
        <div
          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold shrink-0 ${
            isOverdue
              ? 'bg-rose-100 text-rose-700 font-bold dark:bg-rose-950/50 dark:text-rose-300'
              : isToday
              ? 'bg-amber-100 text-amber-800 font-bold dark:bg-amber-950/50 dark:text-amber-300'
              : isCompleted
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          title={`Teslim Tarihi: ${task.dueDate}`}
        >
          {isOverdue ? (
            <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
          ) : (
            <Calendar className="h-3 w-3" />
          )}
          <span>
            {isOverdue ? 'Gecikti' : isToday ? 'Bugün' : task.dueDate}
          </span>
        </div>

        {/* Sağ Taraf: Görevli & Sayaçlar */}
        <div className="flex items-center gap-2">
          {/* Revizyon Sayacı */}
          {task.revisionsCount > 0 && (
            <span
              className="inline-flex items-center gap-0.5 text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded dark:bg-rose-950/40 dark:text-rose-300"
              title={`${task.revisionsCount} kez revizyon istendi`}
            >
              <RotateCcw className="h-2.5 w-2.5" />
              {task.revisionsCount}
            </span>
          )}

          {/* Yorum Sayacı */}
          {task.commentsCount > 0 && (
            <span
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400"
              title={`${task.commentsCount} yorum`}
            >
              <MessageSquare className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              {task.commentsCount}
            </span>
          )}

          {/* Görevli Personel Avatarı */}
          {task.assigneeName ? (
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 shrink-0 dark:border dark:border-indigo-800/40 dark:bg-indigo-950/70 dark:text-indigo-300"
              title={`Görevli: ${task.assigneeName}`}
            >
              {task.assigneeName.slice(0, 2).toUpperCase()}
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsAssignOpen((v) => !v)
                setIsMenuOpen(false)
              }}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer dark:border dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
              title="Personele Ata"
            >
              <User className="h-2.5 w-2.5" />
              <span>Ata</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
