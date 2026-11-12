import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireEmployee } from '@/lib/auth'
import { getLocalDateString } from '@/lib/utils'
import type { EmployeeTaskItem } from './types'
import { EmployeeDashboardHeader } from './_components/EmployeeDashboardHeader'
import { EmployeeMetricsRow } from './_components/EmployeeMetricsRow'
import { EmployeeUrgentAlert } from './_components/EmployeeUrgentAlert'
import { EmployeeActiveTasksList } from './_components/EmployeeActiveTasksList'
import { EmployeeTaskPoolSection } from './_components/EmployeeTaskPoolSection'
import { EmployeeWeeklySchedule } from './_components/EmployeeWeeklySchedule'
import { EmployeeRecentNotifications } from './_components/EmployeeRecentNotifications'

export const metadata: Metadata = {
  title: 'Çalışan Paneli – SMAUP',
  description: 'Üzerinizdeki aktif görevleri, revizyon taleplerini ve ajans iş havuzunu yönetin.',
}

function getFormattedDate(): string {
  const now = new Date()
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${days[now.getDay()]}`
}

export default async function EmployeePage() {
  const employee = await requireEmployee()
  const agencyId = employee.agencyId
  const employeeName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Çalışan'

  const [agency, myTasksRaw, poolTasksRaw, totalPoolCount, notificationsRaw] = await Promise.all([
    prisma.agencies.findUnique({
      where: { id: agencyId },
      select: { name: true },
    }),
    prisma.tasks.findMany({
      where: {
        agency_id: agencyId,
        assignee_id: employee.id,
        is_active: true,
      },
      include: {
        brands: { select: { id: true, name: true } },
        task_comments: {
          include: {
            profiles: { select: { first_name: true, last_name: true, role: true } },
          },
          orderBy: { created_at: 'asc' },
        },
        task_revisions: {
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: { due_date: 'asc' },
    }),
    prisma.tasks.findMany({
      where: {
        agency_id: agencyId,
        assignee_id: null,
        is_active: true,
        status: 'unassigned',
      },
      include: {
        brands: { select: { id: true, name: true } },
      },
      orderBy: { due_date: 'asc' },
      take: 4,
    }),
    prisma.tasks.count({
      where: {
        agency_id: agencyId,
        assignee_id: null,
        is_active: true,
        status: 'unassigned',
      },
    }),
    prisma.notifications.findMany({
      where: { profile_id: employee.id },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
  ])

  const agencyName = agency?.name ?? 'Ajansım'
  const todayStr = getLocalDateString()

  const myTasks: EmployeeTaskItem[] = myTasksRaw.map((t) => ({
    id: t.id,
    agency_id: t.agency_id,
    brand_id: t.brand_id,
    brand_name: t.brands?.name ?? 'Bilinmeyen Marka',
    assignee_id: t.assignee_id,
    assignee_name: employeeName,
    template_id: t.template_id,
    platform: t.platform,
    content: t.content,
    due_date: t.due_date.toISOString(),
    status: t.status ?? 'assigned',
    content_url: t.content_url,
    assignment_note: t.assignment_note,
    is_active: t.is_active ?? true,
    created_at: t.created_at?.toISOString() ?? new Date().toISOString(),
    comments_count: t.task_comments.length,
    revisions_count: t.task_revisions.length,
    comments: t.task_comments.map((c) => ({
      id: c.id,
      comment_text: c.comment_text,
      created_at: c.created_at?.toISOString() ?? '',
      author_name: [c.profiles?.first_name, c.profiles?.last_name].filter(Boolean).join(' ') || 'Yetkili',
      author_role: c.profiles?.role ?? 'employee',
    })),
    revisions: t.task_revisions.map((r) => ({
      id: r.id,
      previous_url: r.previous_url,
      customer_note: r.customer_note,
      created_at: r.created_at?.toISOString() ?? '',
    })),
  }))

  const poolTasks: EmployeeTaskItem[] = poolTasksRaw.map((t) => ({
    id: t.id,
    agency_id: t.agency_id,
    brand_id: t.brand_id,
    brand_name: t.brands?.name ?? 'Bilinmeyen Marka',
    assignee_id: null,
    assignee_name: null,
    template_id: t.template_id,
    platform: t.platform,
    content: t.content,
    due_date: t.due_date.toISOString(),
    status: 'unassigned',
    content_url: t.content_url,
    assignment_note: t.assignment_note,
    is_active: t.is_active ?? true,
    created_at: t.created_at?.toISOString() ?? new Date().toISOString(),
    comments_count: 0,
    revisions_count: 0,
    comments: [],
    revisions: [],
  }))

  // Metrik hesaplamaları
  const inProgressCount = myTasks.filter((t) => t.status === 'assigned').length
  const revisionsCount = myTasks.filter((t) => t.status === 'revision_requested').length
  const pendingApprovalCount = myTasks.filter((t) => t.status === 'pending_approval').length
  const completedCount = myTasks.filter((t) => t.status === 'completed').length
  const activeTasksCount = myTasks.filter((t) => t.status !== 'completed').length

  const overdueCount = myTasks.filter((t) => {
    return t.status !== 'completed' && t.due_date.slice(0, 10) < todayStr
  }).length

  const totalTasks = myTasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Üst Karşılama ve Hızlı Başlık Alanı */}
      <EmployeeDashboardHeader
        employeeName={employeeName}
        agencyName={agencyName}
        poolCount={totalPoolCount}
        activeTasksCount={activeTasksCount}
        formattedDate={getFormattedDate()}
      />

      {/* Kritik Uyarı Bannerı (Varsa) */}
      <EmployeeUrgentAlert
        revisionsCount={revisionsCount}
        overdueCount={overdueCount}
      />

      {/* 4'lü Özet Metrik Kartları */}
      <EmployeeMetricsRow
        inProgressCount={inProgressCount}
        revisionsCount={revisionsCount}
        pendingApprovalCount={pendingApprovalCount}
        completedCount={completedCount}
        completionPercentage={completionPercentage}
      />

      {/* Ana 2 Kolonlu Gövde */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sol / Geniş Bölüm (2 Kolon) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Aktif Görevlerim Listesi */}
          <EmployeeActiveTasksList tasks={myTasks} />

          {/* Ajans İş Havuzu */}
          <EmployeeTaskPoolSection
            poolTasks={poolTasks}
            totalPoolCount={totalPoolCount}
          />
        </div>

        {/* Sağ Bölüm (1 Kolon) */}
        <div className="space-y-6">
          {/* Haftalık Teslim Takvimi */}
          <EmployeeWeeklySchedule tasks={myTasks} />

          {/* Son Bildirimler ve Geri Bildirimler */}
          <EmployeeRecentNotifications notifications={notificationsRaw} />
        </div>
      </div>
    </div>
  )
}
