import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { AgencyMetricsRow } from './_components/AgencyMetricsRow'
import { AgencyChartsRow } from './_components/AgencyChartsRow'
import { AgencyActionButtons } from './_components/AgencyActionButtons'
import { AgencyRecentActivities, RecentActivityItem } from './_components/AgencyRecentActivities'
import { AgencyTaskPipeline, PipelineTaskItem } from './_components/AgencyTaskPipeline'
import { AgencyContentCalendar } from './_components/AgencyContentCalendar'
import { AgencyActiveBrands, BrandOverviewItem } from './_components/AgencyActiveBrands'
import { notification_type } from '@prisma/client'

function getActivityType(type: notification_type | null): RecentActivityItem['type'] {
  return type === notification_type.approval ? 'approval' : 'task'
}

// Bugünün Türkçe tarihini biçimlendirir
function getFormattedDate(): string {
  const now = new Date()
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${days[now.getDay()]}`
}

// Son altı ayın bilgilerini hesaplar
function getLast6Months() {
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
  const result: { month: string; year: number; monthIndex: number }[] = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({
      month: monthNames[d.getMonth()],
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
    })
  }
  return result
}

// Geçen süreyi kısa metne dönüştürür
function formatTimeAgo(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 60) return 'Az önce'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} dk önce`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} sa önce`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay} gün önce`
}

// Ajans sahibinin ana yönetim panelini gösterir
export default async function AgencyPage() {
  const cookieStore = await cookies()
  const agencyId = cookieStore.get('agency-id')?.value
  const userName = cookieStore.get('user-name')?.value ?? 'Ajans Yöneticisi'

  let agencyName = 'Ajansım'
  let activeBrandsCount = 0
  let employeeCount = 0
  let todayTasksCount = 0
  let pendingApprovalCount = 0

  let brandsList: { id: string; name: string }[] = []
  let employeesList: { id: string; name: string }[] = []
  let brandOverviewItems: BrandOverviewItem[] = []

  let monthlyGrowth = getLast6Months().map((m) => ({ month: m.month, count: 0 }))
  let completionRate = 0
  let completedTasksCount = 0
  let totalTasksCount = 0
  let contentDistribution = { reels: 0, post: 0, story: 0, carousel: 0 }

  let pipeline: {
    planned: PipelineTaskItem[]
    inProgress: PipelineTaskItem[]
    shared: PipelineTaskItem[]
    pendingApproval: PipelineTaskItem[]
  } = {
    planned: [],
    inProgress: [],
    shared: [],
    pendingApproval: [],
  }

  const weekSchedule: Record<number, string[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  }

  let recentActivities: RecentActivityItem[] = []

  if (agencyId) {
    try {
      const [agency, brands, employees, tasks, templates, notifications] = await Promise.all([
        prisma.agencies.findUnique({
          where: { id: agencyId },
          select: { name: true },
        }),
        prisma.brands.findMany({
          where: { agency_id: agencyId },
          include: {
            profiles: {
              where: { role: 'customer' },
              select: { first_name: true, last_name: true },
            },
            tasks: {
              select: { id: true, status: true },
            },
          },
          orderBy: { created_at: 'desc' },
        }),
        prisma.profiles.findMany({
          where: { agency_id: agencyId, role: 'employee' },
          select: { id: true, first_name: true, last_name: true, salary: true },
        }),
        prisma.tasks.findMany({
          where: { agency_id: agencyId },
          include: {
            brands: { select: { name: true } },
            profiles: { select: { first_name: true, last_name: true } },
          },
          orderBy: { created_at: 'desc' },
        }),
        prisma.content_templates.findMany({
          where: { brands: { agency_id: agencyId }, is_active: true },
          select: { day_of_week: true, platform: true },
        }),
        prisma.notifications.findMany({
          where: { profiles: { agency_id: agencyId } },
          take: 6,
          orderBy: { created_at: 'desc' },
        }),
      ])

      if (agency?.name) {
        agencyName = agency.name
      }

      activeBrandsCount = brands.length
      employeeCount = employees.length

      const todayStr = new Date().toISOString().split('T')[0]
      todayTasksCount = tasks.filter((t) => {
        const dStr = t.due_date ? new Date(t.due_date).toISOString().split('T')[0] : ''
        return dStr === todayStr
      }).length

      pendingApprovalCount = tasks.filter((t) => t.status === 'pending_approval').length

      brandsList = brands.map((b) => ({ id: b.id, name: b.name }))
      employeesList = employees.map((e) => ({
        id: e.id,
        name: [e.first_name, e.last_name].filter(Boolean).join(' ') || 'İsimsiz Çalışan',
      }))

      totalTasksCount = tasks.length
      completedTasksCount = tasks.filter((t) => t.status === 'completed').length
      completionRate =
        totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0

      contentDistribution = {
        reels: tasks.filter((t) => t.content === 'reels').length,
        post: tasks.filter((t) => t.content === 'post').length,
        story: tasks.filter((t) => t.content === 'story').length,
        carousel: tasks.filter((t) => t.content === 'carousel').length,
      }

      const last6 = getLast6Months()
      monthlyGrowth = last6.map((m) => {
        const countInMonth = brands.filter((b) => {
          if (!b.created_at) return false
          const d = new Date(b.created_at)
          return d.getFullYear() === m.year && d.getMonth() === m.monthIndex
        }).length
        return { month: m.month, count: countInMonth }
      })



      brandOverviewItems = brands.map((b) => {
        const customerProfile = b.profiles?.[0]
        const manager = customerProfile
          ? [customerProfile.first_name, customerProfile.last_name].filter(Boolean).join(' ')
          : 'Atanmadı'
        const activeTasks = b.tasks.filter((t) => t.status !== 'completed').length
        return {
          id: b.id,
          name: b.name,
          managerName: manager,
          activeTasksCount: activeTasks,
        }
      })

      const mapTaskItem = (t: (typeof tasks)[number]): PipelineTaskItem => ({
        id: t.id,
        platform: t.platform,
        content: t.content,
        title: `${t.brands?.name || 'Marka'} – ${t.content}`,
      })

      pipeline = {
        planned: tasks.filter((t) => t.status === 'unassigned').map(mapTaskItem),
        inProgress: tasks.filter((t) => t.status === 'assigned').map(mapTaskItem),
        shared: tasks.filter((t) => t.status === 'completed').map(mapTaskItem),
        pendingApproval: tasks.filter((t) => t.status === 'pending_approval').map(mapTaskItem),
      }

      tasks.forEach((t) => {
        if (!t.due_date) return
        const d = new Date(t.due_date)
        const jsDay = d.getDay()
        const dayKey = jsDay === 0 ? 7 : jsDay
        if (weekSchedule[dayKey] && !weekSchedule[dayKey].includes(t.platform)) {
          weekSchedule[dayKey].push(t.platform)
        }
      })
      templates.forEach((tmpl) => {
        const dayKey = tmpl.day_of_week
        if (weekSchedule[dayKey] && !weekSchedule[dayKey].includes(tmpl.platform)) {
          weekSchedule[dayKey].push(tmpl.platform)
        }
      })

      if (notifications && notifications.length > 0) {
        recentActivities = notifications.map((n) => ({
          id: n.id,
          title: n.message,
          subtitle: n.type,
          timeAgo: n.created_at ? formatTimeAgo(new Date(n.created_at)) : 'Yakın zamanda',
          type: getActivityType(n.type),
        }))
      } else {
        const activityList: RecentActivityItem[] = []
        tasks.slice(0, 3).forEach((t) => {
          activityList.push({
            id: t.id,
            title: `Yeni görev: ${t.brands?.name || 'Marka'}`,
            subtitle: `${t.platform} için ${t.content} oluşturuldu`,
            timeAgo: t.created_at ? formatTimeAgo(new Date(t.created_at)) : 'Yeni',
            type: 'task',
          })
        })
        brands.slice(0, 2).forEach((b) => {
          activityList.push({
            id: b.id,
            title: `Müşteri eklendi: ${b.name}`,
            subtitle: 'Ajans portföyüne katıldı',
            timeAgo: b.created_at ? formatTimeAgo(new Date(b.created_at)) : 'Yeni',
            type: 'brand',
          })
        })
        recentActivities = activityList
      }
    } catch {
    }
  }

  const currentDateStr = getFormattedDate()

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {agencyName} Genel Bakış
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Hoş geldiniz, <span className="font-semibold text-slate-700">{userName}</span>. Günlük ajans operasyonlarınızın anlık durumu:
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs">
            {currentDateStr}
          </span>
        </div>
      </div>

      <AgencyMetricsRow
        activeBrandsCount={activeBrandsCount}
        employeeCount={employeeCount}
        todayTasksCount={todayTasksCount}
        pendingApprovalCount={pendingApprovalCount}
      />

      <AgencyChartsRow
        monthlyGrowth={monthlyGrowth}
        completionRate={completionRate}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        contentDistribution={contentDistribution}
      />

      <AgencyActionButtons brands={brandsList} employees={employeesList} />

      <AgencyRecentActivities activities={recentActivities} />

      <AgencyTaskPipeline pipeline={pipeline} />

      <AgencyContentCalendar weekSchedule={weekSchedule} />

      <AgencyActiveBrands brands={brandOverviewItems} />
    </div>
  )
}
