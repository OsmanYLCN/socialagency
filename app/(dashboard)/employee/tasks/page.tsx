import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireEmployee } from '@/lib/auth'
import type { EmployeeTaskItem, BrandFilterOption } from '../types'
import { EmployeeTasksClientView } from './_components/EmployeeTasksClientView'

export const metadata: Metadata = {
  title: 'Görevlerim & İş Havuzu – SMAUP',
  description: 'Atanan görevlerinizi teslim edin, revizyonları tamamlayın veya iş havuzundan yeni görevler üstlenin.',
}

export default async function EmployeeTasksPage(props: {
  searchParams: Promise<{ tab?: string; taskId?: string; status?: string }>
}) {
  const searchParams = await props.searchParams
  const initialTab = searchParams?.tab === 'pool' ? 'pool' : 'my_tasks'
  const initialTaskId = searchParams?.taskId
  const initialStatus = searchParams?.status

  const employee = await requireEmployee()
  const agencyId = employee.agencyId
  const employeeName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Çalışan'

  const [brandsData, myTasksRaw, poolTasksRaw] = await Promise.all([
    prisma.brands.findMany({
      where: { agency_id: agencyId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
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
  ])

  const brands: BrandFilterOption[] = brandsData.map((b) => ({
    id: b.id,
    name: b.name,
  }))

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

  return (
    <EmployeeTasksClientView
      myTasks={myTasks}
      poolTasks={poolTasks}
      brands={brands}
      initialTab={initialTab}
      initialTaskId={initialTaskId}
      initialStatus={initialStatus}
    />
  )
}
