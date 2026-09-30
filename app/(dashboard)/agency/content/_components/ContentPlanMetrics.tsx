import { Calendar, Sparkles, TrendingUp, Share2 } from 'lucide-react'
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  XTwitterIcon,
  LinkedinIcon,
} from '@/components/icons/PlatformIcons'

export interface ContentPlanMetricsProps {
  weeklyTargetCount: number
  activeTemplatesCount: number
  totalTemplatesCount: number
  monthlyCompletionRate: number
  totalMonthlyTasks: number
  completedMonthlyTasks: number
  topPlatform: { platform: string; count: number } | null
}

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase()
  switch (p) {
    case 'instagram':
      return <InstagramIcon className="h-5 w-5 text-rose-600" />
    case 'tiktok':
      return <TikTokIcon className="h-5 w-5 text-slate-800 dark:text-slate-100" />
    case 'youtube':
      return <YoutubeIcon className="h-5 w-5 text-red-600" />
    case 'x':
      return <XTwitterIcon className="h-4.5 w-4.5 text-slate-700 dark:text-slate-200" />
    case 'linkedin':
      return <LinkedinIcon className="h-5 w-5 text-sky-600" />
    default:
      return <Share2 className="h-5 w-5 text-amber-600" />
  }
}

export function ContentPlanMetrics({
  weeklyTargetCount,
  activeTemplatesCount,
  totalTemplatesCount,
  monthlyCompletionRate,
  totalMonthlyTasks,
  completedMonthlyTasks,
  topPlatform,
}: ContentPlanMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Haftalik Icerik Hedefi */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-slate-700">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Haftalık İçerik Hedefi
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white shrink-0">
              {weeklyTargetCount}
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 whitespace-nowrap">
              İçerik / Hafta
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            Aktif şablonların toplam haftalık hacmi
          </p>
        </div>
      </div>

      {/* 2. Aktif Rutin Sablon */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-slate-700">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Aktif Rutin Şablon
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white shrink-0">
              {activeTemplatesCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 whitespace-nowrap">
              / {totalTemplatesCount} Şablon
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {activeTemplatesCount > 0 ? 'Haftalık döngüde çalışan kurallar' : 'Henüz aktif kural yok'}
          </p>
        </div>
      </div>

      {/* 3. Aylik Uretim Ilerlemesi */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-slate-700">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Bu Ayki Üretim
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white shrink-0">
              %{monthlyCompletionRate}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0 whitespace-nowrap">
              Tamamlandı
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {totalMonthlyTasks > 0
              ? `${completedMonthlyTasks} / ${totalMonthlyTasks} içerik teslim edildi`
              : 'Bu ay için henüz görev bulunmuyor'}
          </p>
        </div>
      </div>

      {/* 4. Lider Platform */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-[#272b37] dark:bg-[#16181f] dark:hover:border-slate-700">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          {topPlatform ? getPlatformIcon(topPlatform.platform) : <Share2 className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Lider Platform
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white shrink-0 uppercase">
              {topPlatform ? topPlatform.platform : 'Yok'}
            </span>
            {topPlatform && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 whitespace-nowrap">
                {topPlatform.count} Şablon
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {topPlatform ? 'En yüksek içerik payına sahip mecra' : 'Şablon eklendiğinde belirlenir'}
          </p>
        </div>
      </div>
    </div>
  )
}
