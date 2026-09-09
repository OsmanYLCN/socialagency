import { TrendingUp, PieChart, CheckCircle } from 'lucide-react'

interface MonthlyPoint {
  month: string
  count: number
}

interface ContentDistribution {
  reels: number
  post: number
  story: number
  carousel: number
}

interface ChartsRowProps {
  monthlyGrowth?: MonthlyPoint[]
  completionRate?: number
  completedTasksCount?: number
  totalTasksCount?: number
  contentDistribution?: ContentDistribution
}

// 2. Satır: 3 Analitik Görsel Panel (Gerçek Veritabanı Verileriyle)
export function AgencyChartsRow({
  monthlyGrowth = [
    { month: 'Haz', count: 0 },
    { month: 'Tem', count: 0 },
    { month: 'Ağu', count: 0 },
    { month: 'Eyl', count: 0 },
    { month: 'Eki', count: 0 },
    { month: 'Kas', count: 0 },
  ],
  completionRate = 0,
  completedTasksCount = 0,
  totalTasksCount = 0,
  contentDistribution = { reels: 0, post: 0, story: 0, carousel: 0 },
}: ChartsRowProps) {
  // 1. Görev Tamamlama Oranı Halka Hesaplaması
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (completionRate / 100) * circumference

  // 2. İçerik Dağılımı Yüzdeleri
  const totalContent =
    contentDistribution.reels +
    contentDistribution.post +
    contentDistribution.story +
    contentDistribution.carousel

  const reelsPct = totalContent > 0 ? Math.round((contentDistribution.reels / totalContent) * 100) : 0
  const postPct = totalContent > 0 ? Math.round((contentDistribution.post / totalContent) * 100) : 0
  const storyPct = totalContent > 0 ? Math.round((contentDistribution.story / totalContent) * 100) : 0
  const carouselPct = totalContent > 0 ? Math.max(0, 100 - (reelsPct + postPct + storyPct)) : 0

  // 3. Aylık Müşteri Artışı SVG Koordinatları
  const maxVal = Math.max(...monthlyGrowth.map((d) => d.count), 5)
  const points = monthlyGrowth.map((item, idx) => {
    const x = 20 + idx * 56
    const y = 120 - (item.count / maxVal) * 90
    return { x, y, count: item.count, month: item.month }
  })

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`
    const prev = points[idx - 1]
    const midX = (prev.x + pt.x) / 2
    return `${acc} C ${midX} ${prev.y}, ${midX} ${pt.y}, ${pt.x} ${pt.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x} 125 L ${points[0].x} 125 Z`

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Aylık Müşteri Artışı (Gerçek Veri) */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Aylık Müşteri Artışı</h3>
            <p className="text-xs text-slate-400">Son 6 aylık marka büyüme ivmesi</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        {/* SVG Alan & Çizgi Grafiği */}
        <div className="relative mt-4 h-44 w-full">
          <svg viewBox="0 0 320 140" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="clientGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Yatay Kılavuz Çizgileri */}
            <line x1="10" y1="30" x2="310" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="10" y1="70" x2="310" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="10" y1="120" x2="310" y2="120" stroke="#f1f5f9" />

            {/* Degrade Alan */}
            <path d={areaD} fill="url(#clientGrowthGrad)" />

            {/* Ana Eğri */}
            <path
              d={pathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Veri Noktaları */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-white stroke-indigo-600 stroke-2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-semibold"
                >
                  {pt.count}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* X Ekseni Ayları */}
        <div className="mt-2 flex justify-between px-2 text-[11px] font-medium text-slate-400">
          {monthlyGrowth.map((m) => (
            <span key={m.month}>{m.month}</span>
          ))}
        </div>
      </div>

      {/* 2. Görev Tamamlama Oranı (Gerçek Veri) */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Görev Tamamlama Oranı</h3>
            <p className="text-xs text-slate-400">Bu ayki hedeflenen işlerin durumu</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>

        {/* Halka Grafik */}
        <div className="relative my-4 flex items-center justify-center">
          <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="9"
              fill="transparent"
            />
            {totalTasksCount > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#10b981"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            )}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900">%{completionRate}</span>
            <span className="text-[10px] font-semibold text-emerald-600">
              {totalTasksCount === 0
                ? 'Görev Yok'
                : completionRate >= 80
                  ? 'Yüksek Başarı'
                  : completionRate >= 50
                    ? 'İyi Durumda'
                    : 'İlerlemede'}
            </span>
          </div>
        </div>

        {/* Alt Metrikler */}
        <div className="flex justify-around border-t border-slate-100 pt-3 text-center">
          <div>
            <p className="text-xs text-slate-400">Tamamlanan</p>
            <p className="text-sm font-bold text-slate-800">{completedTasksCount}</p>
          </div>
          <div className="h-7 w-px bg-slate-100" />
          <div>
            <p className="text-xs text-slate-400">Toplam Görev</p>
            <p className="text-sm font-bold text-slate-800">{totalTasksCount}</p>
          </div>
        </div>
      </div>

      {/* 3. İçerik Dağılımı (Gerçek Veri) */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">İçerik Dağılımı</h3>
            <p className="text-xs text-slate-400">Format bazlı üretim adetleri</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <PieChart className="h-4 w-4" />
          </div>
        </div>

        {/* Dairesel Dağılım Çarkı */}
        <div className="my-3 flex items-center justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            {totalContent === 0 ? (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-slate-200 text-center">
                <span className="text-[11px] font-medium text-slate-400">Kayıt Yok</span>
              </div>
            ) : (
              <>
                <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="5"
                  />
                  {reelsPct > 0 && (
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#6366f1"
                      strokeWidth="5"
                      strokeDasharray={`${reelsPct} ${100 - reelsPct}`}
                      strokeDashoffset="25"
                    />
                  )}
                  {postPct > 0 && (
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#38bdf8"
                      strokeWidth="5"
                      strokeDasharray={`${postPct} ${100 - postPct}`}
                      strokeDashoffset={`${25 - reelsPct}`}
                    />
                  )}
                  {storyPct > 0 && (
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="5"
                      strokeDasharray={`${storyPct} ${100 - storyPct}`}
                      strokeDashoffset={`${25 - reelsPct - postPct}`}
                    />
                  )}
                  {carouselPct > 0 && (
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="5"
                      strokeDasharray={`${carouselPct} ${100 - carouselPct}`}
                      strokeDashoffset={`${25 - reelsPct - postPct - storyPct}`}
                    />
                  )}
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-bold text-slate-600">{totalContent}</span>
                  <span className="block text-[9px] text-slate-400">Toplam</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dağılım Lejantı */}
        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600 font-medium">Reels</span>
            <span className="ml-auto font-bold text-slate-900">{contentDistribution.reels}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            <span className="text-slate-600 font-medium">Post</span>
            <span className="ml-auto font-bold text-slate-900">{contentDistribution.post}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Story</span>
            <span className="ml-auto font-bold text-slate-900">{contentDistribution.story}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">Carousel</span>
            <span className="ml-auto font-bold text-slate-900">{contentDistribution.carousel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
