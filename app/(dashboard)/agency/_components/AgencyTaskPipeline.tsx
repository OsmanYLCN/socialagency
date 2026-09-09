import { CheckSquare } from 'lucide-react'
import {
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  XTwitterIcon,
  LinkedinIcon,
} from '@/components/icons/PlatformIcons'

export interface PipelineTaskItem {
  id: string
  platform: string
  content: string
  title: string
}

interface TaskPipelineProps {
  pipeline?: {
    planned: PipelineTaskItem[]
    inProgress: PipelineTaskItem[]
    shared: PipelineTaskItem[]
    pendingApproval: PipelineTaskItem[]
  }
}

function renderPlatformIcon(platform: string, className = 'h-3.5 w-3.5') {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <InstagramIcon className={className} />
    case 'tiktok':
      return <TikTokIcon className={className} />
    case 'youtube':
      return <YoutubeIcon className={className} />
    case 'x':
      return <XTwitterIcon className={className} />
    case 'linkedin':
      return <LinkedinIcon className={className} />
    default:
      return <InstagramIcon className={className} />
  }
}

// Tam Genişlik 2: Görev Durumu (Mini Pipeline) Paneli
export function AgencyTaskPipeline({
  pipeline = {
    planned: [],
    inProgress: [],
    shared: [],
    pendingApproval: [],
  },
}: TaskPipelineProps) {
  const totalInPipeline =
    pipeline.planned.length +
    pipeline.inProgress.length +
    pipeline.shared.length +
    pipeline.pendingApproval.length

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Görev Durumu</h3>
          <p className="text-xs text-slate-400">İçerik üretim, atama, paylaşım ve onay aşamaları</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Toplam: {totalInPipeline} Görev
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <CheckSquare className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Kolon 1: Planlandı */}
        <div className="flex flex-col gap-2.5 rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <span className="text-xs font-bold text-slate-700">Planlandı</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
              {pipeline.planned.length}
            </span>
          </div>
          {pipeline.planned.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">Görev yok</div>
          ) : (
            pipeline.planned.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs transition-all hover:border-slate-300"
              >
                <div className="flex items-center gap-1.5 text-slate-700">
                  {renderPlatformIcon(task.platform)}
                  <span className="text-[11px] font-bold capitalize">{task.platform}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-800">{task.title}</p>
              </div>
            ))
          )}
        </div>

        {/* Kolon 2: Hazırlanıyor */}
        <div className="flex flex-col gap-2.5 rounded-2xl bg-indigo-50/40 p-3.5 border border-indigo-100/60">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
            <span className="text-xs font-bold text-indigo-900">Hazırlanıyor</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
              {pipeline.inProgress.length}
            </span>
          </div>
          {pipeline.inProgress.length === 0 ? (
            <div className="py-8 text-center text-xs text-indigo-300">İşlem yok</div>
          ) : (
            pipeline.inProgress.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-indigo-100 bg-white p-3 shadow-2xs transition-all hover:border-indigo-200"
              >
                <div className="flex items-center gap-1.5 text-indigo-600">
                  {renderPlatformIcon(task.platform)}
                  <span className="text-[11px] font-bold capitalize">{task.platform}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-800">{task.title}</p>
              </div>
            ))
          )}
        </div>

        {/* Kolon 3: Paylaşıldı */}
        <div className="flex flex-col gap-2.5 rounded-2xl bg-emerald-50/40 p-3.5 border border-emerald-100/60">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="text-xs font-bold text-emerald-900">Paylaşıldı</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
              {pipeline.shared.length}
            </span>
          </div>
          {pipeline.shared.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-400/80">Tamamlanan yok</div>
          ) : (
            pipeline.shared.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-emerald-100 bg-white p-3 shadow-2xs transition-all hover:border-emerald-200"
              >
                <div className="flex items-center gap-1.5 text-emerald-600">
                  {renderPlatformIcon(task.platform)}
                  <span className="text-[11px] font-bold capitalize">{task.platform}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-800">{task.title}</p>
              </div>
            ))
          )}
        </div>

        {/* Kolon 4: Onay Bekliyor */}
        <div className="flex flex-col gap-2.5 rounded-2xl bg-amber-50/40 p-3.5 border border-amber-100/60">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <span className="text-xs font-bold text-amber-900">Onay Bekliyor</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
              {pipeline.pendingApproval.length}
            </span>
          </div>
          {pipeline.pendingApproval.length === 0 ? (
            <div className="py-8 text-center text-xs text-amber-400/80">Bekleyen yok</div>
          ) : (
            pipeline.pendingApproval.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-amber-100 bg-white p-3 shadow-2xs transition-all hover:border-amber-200"
              >
                <div className="flex items-center gap-1.5 text-amber-600">
                  {renderPlatformIcon(task.platform)}
                  <span className="text-[11px] font-bold capitalize">{task.platform}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-800">{task.title}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
