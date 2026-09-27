import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import {
  TasksClientView,
  TaskItem,
  BrandOption,
  EmployeeOption,
  TasksMetrics,
} from './_components/TasksClientView'

export const metadata: Metadata = {
  title: 'Görev Yönetimi – SMAUP',
  description: 'Ajansınızın tüm içerik üretim, onay ve revizyon süreçlerini yönetin.',
}

export default async function AgencyTasksPage() {
  const agencyOwner = await requireAgencyOwner()
  const agencyId = agencyOwner.agencyId

  const [agency, brandsData, employeesData, tasksData] = await Promise.all([
    prisma.agencies.findUnique({
      where: { id: agencyId },
      select: { name: true },
    }),
    prisma.brands.findMany({
      where: { agency_id: agencyId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.profiles.findMany({
      where: { agency_id: agencyId, role: 'employee', is_active: true },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        users: { select: { email: true } },
      },
      orderBy: { first_name: 'asc' },
    }),
    prisma.tasks.findMany({
      where: { agency_id: agencyId },
      include: {
        brands: { select: { id: true, name: true } },
        profiles: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            users: { select: { email: true } },
          },
        },
        task_comments: {
          include: {
            profiles: {
              select: { first_name: true, last_name: true, role: true },
            },
          },
          orderBy: { created_at: 'asc' },
        },
        task_revisions: {
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: { due_date: 'asc' },
    }),
  ])

  const agencyName = agency?.name ?? 'Ajansım'

  // Markalar listesi
  const brands: BrandOption[] = brandsData.map((b) => ({
    id: b.id,
    name: b.name,
  }))

  // Çalışanlar listesi
  const employees: EmployeeOption[] = employeesData.map((e) => {
    const fullName = [e.first_name, e.last_name].filter(Boolean).join(' ') || 'İsimsiz Çalışan'
    return {
      id: e.id,
      name: fullName,
      email: e.users?.email ?? '',
    }
  })

  // Bugün başlangıcı (gecikme hesabı için)
  const now = new Date()
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  // Metrik hesaplamaları
  let inProgressTasks = 0
  let revisionAndPendingTasks = 0
  let overdueTasks = 0
  let unassignedTasks = 0
  let completedTasks = 0

  const taskItems: TaskItem[] = tasksData.map((t) => {
    const status = t.status ?? 'unassigned'
    const assignee = t.profiles
    const assigneeName = assignee
      ? [assignee.first_name, assignee.last_name].filter(Boolean).join(' ') || 'İsimsiz Çalışan'
      : null
    const assigneeEmail = assignee?.users?.email ?? null

    const dueDateTime = t.due_date ? new Date(t.due_date).getTime() : 0
    const isOverdue = status !== 'completed' && dueDateTime > 0 && dueDateTime < todayMidnight

    if (isOverdue) overdueTasks++
    if (status === 'unassigned') unassignedTasks++
    else if (status === 'assigned') inProgressTasks++
    else if (status === 'pending_approval' || status === 'revision_requested') revisionAndPendingTasks++
    else if (status === 'completed') completedTasks++

    const comments = t.task_comments.map((c) => {
      const authorName = c.profiles
        ? [c.profiles.first_name, c.profiles.last_name].filter(Boolean).join(' ') || 'Ekip Üyesi'
        : 'Ekip Üyesi'
      return {
        id: c.id,
        profileId: c.profile_id,
        authorName,
        authorRole: c.profiles?.role ?? 'employee',
        commentText: c.comment_text,
        createdAt: c.created_at?.toISOString() ?? new Date().toISOString(),
      }
    })

    const revisions = t.task_revisions.map((r) => ({
      id: r.id,
      previousUrl: r.previous_url,
      customerNote: r.customer_note,
      createdAt: r.created_at?.toISOString() ?? new Date().toISOString(),
    }))

    const dueDateFormatted = t.due_date
      ? new Date(t.due_date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)

    return {
      id: t.id,
      brandId: t.brand_id,
      brandName: t.brands?.name ?? 'Bilinmeyen Marka',
      assigneeId: t.assignee_id,
      assigneeName,
      assigneeEmail,
      platform: t.platform,
      content: t.content,
      dueDate: dueDateFormatted,
      status,
      contentUrl: t.content_url,
      assignmentNote: t.assignment_note,
      createdAt: t.created_at?.toISOString() ?? null,
      commentsCount: comments.length,
      revisionsCount: revisions.length,
      comments,
      revisions,
    }
  })

  const metrics: TasksMetrics = {
    totalTasks: tasksData.length,
    inProgressTasks,
    revisionAndPendingTasks,
    overdueTasks,
    unassignedTasks,
    completedTasks,
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <TasksClientView
        agencyName={agencyName}
        tasks={taskItems}
        brands={brands}
        employees={employees}
        metrics={metrics}
      />
    </div>
  )
}
