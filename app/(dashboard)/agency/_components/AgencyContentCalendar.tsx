import { Calendar as CalendarIcon } from 'lucide-react'
import {
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  XTwitterIcon,
  LinkedinIcon,
} from '@/components/icons/PlatformIcons'

interface ContentCalendarProps {
  weekSchedule?: Record<number, string[]>
}

function renderPlatformBadge(platform: string) {
  const p = platform.toLowerCase()
  switch (p) {
    case 'instagram':
      return (
        <span className="flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50/70 px-2 py-1 text-[10px] font-semibold text-rose-700">
          <InstagramIcon className="h-3 w-3" />
          <span>Instagram</span>
        </span>
      )
    case 'tiktok':
      return (
        <span className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-semibold text-slate-800">
          <TikTokIcon className="h-3 w-3" />
          <span>TikTok</span>
        </span>
      )
    case 'youtube':
      return (
        <span className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50/70 px-2 py-1 text-[10px] font-semibold text-red-700">
          <YoutubeIcon className="h-3 w-3" />
          <span>YouTube</span>
        </span>
      )
    case 'x':
      return (
        <span className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-700">
          <XTwitterIcon className="h-3 w-3" />
          <span>X</span>
        </span>
      )
    case 'linkedin':
      return (
        <span className="flex items-center gap-1 rounded-lg border border-sky-100 bg-sky-50/70 px-2 py-1 text-[10px] font-semibold text-sky-700">
          <LinkedinIcon className="h-3 w-3" />
          <span>LinkedIn</span>
        </span>
      )
    default:
      return null
  }
}

// Haftalık içerik takvimini gösterir
export function AgencyContentCalendar({ weekSchedule = {} }: ContentCalendarProps) {
  const days = [
    { num: 1, name: 'Pazartesi', short: 'Pzt' },
    { num: 2, name: 'Salı', short: 'Sal' },
    { num: 3, name: 'Çarşamba', short: 'Çar' },
    { num: 4, name: 'Perşembe', short: 'Per' },
    { num: 5, name: 'Cuma', short: 'Cum' },
    { num: 6, name: 'Cumartesi', short: 'Cmt' },
    { num: 7, name: 'Pazar', short: 'Paz' },
  ]

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Haftalık İçerik Takvimi</h3>
          <p className="text-xs text-slate-400">Pazartesi&apos;den Pazar&apos;a haftalık planlanan yayın akışı ve şablonlar</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <CalendarIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const scheduled = weekSchedule[day.num] ?? []

          return (
            <div
              key={day.num}
              className="flex min-h-[140px] flex-col rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5 transition-all hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-bold text-slate-800">{day.name}</span>
                <span className="text-[10px] font-semibold text-slate-400">{day.short}</span>
              </div>

              <div className="mt-3 flex flex-1 flex-col gap-1.5">
                {scheduled.length === 0 ? (
                  <div className="my-auto text-center text-xs text-slate-300">-</div>
                ) : (
                  scheduled.map((platform, idx) => (
                    <div key={idx}>{renderPlatformBadge(platform)}</div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
