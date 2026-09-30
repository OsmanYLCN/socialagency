'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  FileImage,
  Layers,
  Sparkles,
  FileText,
  Building2,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CalendarDays,
} from 'lucide-react'
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  XTwitterIcon,
  LinkedinIcon,
} from '@/components/icons/PlatformIcons'
import type { CalendarTaskItem } from './ContentPlanClientView'

interface InteractiveContentCalendarProps {
  tasks: CalendarTaskItem[]
  selectedBrandId: string
}

const MONTH_NAMES = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

const WEEK_DAYS = [
  { name: 'Pazartesi', short: 'Pzt' },
  { name: 'Salı', short: 'Sal' },
  { name: 'Çarşamba', short: 'Çar' },
  { name: 'Perşembe', short: 'Per' },
  { name: 'Cuma', short: 'Cum' },
  { name: 'Cumartesi', short: 'Cmt' },
  { name: 'Pazar', short: 'Paz' },
]

function renderPlatformIcon(platform: string, className = 'h-3 w-3') {
  const p = platform.toLowerCase()
  switch (p) {
    case 'instagram':
      return <InstagramIcon className={`${className} text-rose-600`} />
    case 'tiktok':
      return <TikTokIcon className={`${className} text-slate-900 dark:text-slate-100`} />
    case 'youtube':
      return <YoutubeIcon className={`${className} text-red-600`} />
    case 'x':
      return <XTwitterIcon className={`${className} text-slate-800 dark:text-slate-200`} />
    case 'linkedin':
      return <LinkedinIcon className={`${className} text-sky-600`} />
    default:
      return <CalendarIcon className={`${className} text-slate-600 dark:text-slate-400`} />
  }
}

function renderFormatIcon(content: string, className = 'h-3 w-3') {
  const c = content.toLowerCase()
  switch (c) {
    case 'reels':
    case 'shorts':
      return <Video className={className} />
    case 'post':
      return <FileImage className={className} />
    case 'carousel':
      return <Layers className={className} />
    case 'story':
      return <Sparkles className={className} />
    case 'tweet':
      return <FileText className={className} />
    default:
      return <FileText className={className} />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return {
        label: 'Tamamlandı',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50',
        dotClass: 'bg-emerald-500',
      }
    case 'pending_approval':
      return {
        label: 'Onay Bekliyor',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50',
        dotClass: 'bg-amber-500',
      }
    case 'revision_requested':
      return {
        label: 'Revizyonda',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50',
        dotClass: 'bg-rose-500',
      }
    case 'assigned':
      return {
        label: 'Üretimde',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50',
        dotClass: 'bg-blue-500',
      }
    case 'unassigned':
    default:
      return {
        label: 'İş Havuzunda',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#222632] dark:text-slate-300 dark:border-[#272b37]',
        dotClass: 'bg-slate-400',
      }
  }
}

function toDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function InteractiveContentCalendar({
  tasks,
  selectedBrandId,
}: InteractiveContentCalendarProps) {
  const now = new Date()
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [selectedDateStr, setSelectedDateStr] = useState<string>(toDateString(now))

  // Marka filtresine gore gorevler
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedBrandId === 'all') return true
      return t.brand_id === selectedBrandId
    })
  }, [tasks, selectedBrandId])

  // Ay degistirme aksiyonlari
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    setSelectedDateStr(toDateString(today))
  }

  // Takvim hucrelerini olustur (Pazartesi ilk gun)
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const dayOfWeek = firstDayOfMonth.getDay() // 0 = Pazar, 1 = Pzt, ..., 6 = Cmt
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const cells: {
      date: Date
      dateStr: string
      dayNumber: number
      isCurrentMonth: boolean
      isToday: boolean
      tasks: CalendarTaskItem[]
    }[] = []

    const todayStr = toDateString(new Date())

    // Onceki ayin gunleri (trailing days)
    for (let i = mondayOffset - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i
      const date = new Date(currentYear, currentMonth - 1, dayNum)
      const dateStr = toDateString(date)
      cells.push({
        date,
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasks: filteredTasks.filter((t) => t.due_date === dateStr),
      })
    }

    // Bu ayin gunleri
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const date = new Date(currentYear, currentMonth, dayNum)
      const dateStr = toDateString(date)
      cells.push({
        date,
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        tasks: filteredTasks.filter((t) => t.due_date === dateStr),
      })
    }

    // Gelecek ayin gunleri (leading days - 35 veya 42 hucreye tamamla)
    const remainingCells = (7 - (cells.length % 7)) % 7
    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const date = new Date(currentYear, currentMonth + 1, dayNum)
      const dateStr = toDateString(date)
      cells.push({
        date,
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasks: filteredTasks.filter((t) => t.due_date === dateStr),
      })
    }

    return cells
  }, [currentYear, currentMonth, filteredTasks])

  // Secili gunun gorevleri
  const selectedDayTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.due_date === selectedDateStr)
  }, [filteredTasks, selectedDateStr])

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateStr) return ''
    const [y, m, d] = selectedDateStr.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    return dt.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    })
  }, [selectedDateStr])

  return (
    <div className="space-y-6">
      {/* Takvim Ust Bar: Ay Secici & Hizli Butonlar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-[#272b37] dark:bg-[#16181f]">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bu ay için toplam {filteredTasks.length} planlı/üretilen görev bulunuyor
            </p>
          </div>
        </div>

        {/* Navigasyon Ok Butonlari */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300 dark:hover:bg-[#222632]"
          >
            Bugün
          </button>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-[#272b37] dark:bg-[#1a1d25]">
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Önceki Ay"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#222632] dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              title="Sonraki Ay"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#222632] dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ana Grid & Secili Gun Yan Paneli */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sol / Ana Alan: 7 Sutunlu Aylik Takvim Izgarasi (3 Kolon Genisliginde) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
          {/* Hafta Gunleri Basliklari */}
          <div className="grid grid-cols-7 border-b border-slate-200 pb-2 text-center text-xs font-bold text-slate-500 dark:border-[#272b37] dark:text-slate-400">
            {WEEK_DAYS.map((d) => (
              <div key={d.name} className="py-1">
                <span className="hidden sm:inline">{d.name}</span>
                <span className="sm:hidden">{d.short}</span>
              </div>
            ))}
          </div>

          {/* Gun Hucreleri */}
          <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-[#272b37] mt-2 rounded-xl overflow-hidden border border-slate-200/60 dark:border-[#272b37]">
            {calendarCells.map((cell) => {
              const isSelected = cell.dateStr === selectedDateStr
              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[90px] sm:min-h-[110px] p-1.5 transition-all cursor-pointer flex flex-col justify-between ${
                    cell.isCurrentMonth
                      ? 'bg-white hover:bg-indigo-50/20 dark:bg-[#16181f] dark:hover:bg-indigo-950/10'
                      : 'bg-slate-50/60 text-slate-400 dark:bg-[#14161d] dark:text-slate-600'
                  } ${isSelected ? 'ring-2 ring-indigo-600 ring-inset z-10' : ''}`}
                >
                  {/* Gun Numarasi & Rozet */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        cell.isToday
                          ? 'bg-indigo-600 text-white'
                          : cell.isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {cell.tasks.length > 0 && (
                      <span className="rounded-md bg-slate-100 px-1 py-0.2 text-[10px] font-bold text-slate-600 dark:bg-[#222632] dark:text-slate-300">
                        {cell.tasks.length}
                      </span>
                    )}
                  </div>

                  {/* Gunun Icerik Rozetleri (Maksimum 2 adet, fazlasi icin +X) */}
                  <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                    {cell.tasks.slice(0, 2).map((task) => {
                      const st = getStatusBadge(task.status)
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-1 rounded-md border border-slate-200/80 bg-white p-1 text-[10px] shadow-2xs truncate hover:border-slate-300 dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-200 dark:hover:border-slate-600"
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.dotClass}`} />
                          <span className="shrink-0">{renderPlatformIcon(task.platform, 'h-2.5 w-2.5')}</span>
                          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {task.brand_name}
                          </span>
                        </div>
                      )
                    })}
                    {cell.tasks.length > 2 && (
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 pl-0.5">
                        +{cell.tasks.length - 2} içerik daha
                      </span>
                    )}
                  </div>

                  <div />
                </div>
              )
            })}
          </div>
        </div>

        {/* Sag Alan: Secili Gun Detay Paneli (1 Kolon Genisliginde) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4 dark:border-[#272b37] dark:bg-[#16181f]">
          {/* Panel Basligi */}
          <div className="border-b border-slate-100 dark:border-[#272b37] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Seçili Gün Detayı
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {selectedDateFormatted}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedDayTasks.length} içerik teslimatı planlandı
            </p>
          </div>

          {/* Secili Gune Ait Gorev Listesi */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {selectedDayTasks.map((task) => {
              const status = getStatusBadge(task.status)
              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-2.5 transition-all hover:border-slate-300 hover:bg-white hover:shadow-xs dark:border-[#272b37] dark:bg-[#1a1d25]/60 dark:hover:border-slate-600 dark:hover:bg-[#1a1d25]"
                >
                  {/* Marka & Durum */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white truncate">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{task.brand_name}</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold shrink-0 ${status.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                      {status.label}
                    </span>
                  </div>

                  {/* Platform & Format */}
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:bg-[#222632] dark:border-[#272b37] dark:text-slate-200">
                      {renderPlatformIcon(task.platform, 'h-3 w-3')}
                      <span className="capitalize">{task.platform}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-[#222632] dark:border-[#272b37] dark:text-slate-300">
                      {renderFormatIcon(task.content, 'h-3 w-3')}
                      <span className="capitalize">{task.content}</span>
                    </span>
                  </div>

                  {/* Varsa Brief/Not */}
                  {task.assignment_note && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic bg-white/70 dark:bg-[#14161d] p-2 rounded-lg border border-slate-100 dark:border-[#272b37]">
                      &quot;{task.assignment_note}&quot;
                    </p>
                  )}

                  {/* Aksiyon Linki */}
                  <div className="border-t border-slate-200/60 dark:border-[#272b37] pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500">Görev Detayı</span>
                    <Link
                      href="/agency/tasks"
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      <span>Yönetimde Aç</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )
            })}

            {/* Secili Gunde Gorev Yoksa */}
            {selectedDayTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-slate-400 dark:border-[#272b37] dark:bg-[#1a1d25]/30 dark:text-slate-500">
                <CalendarIcon className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Bu tarihte henüz bir içerik görevi bulunmuyor
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Şablon Matrisi üzerinden rutin ekleyebilir veya toplu görev üretebilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
