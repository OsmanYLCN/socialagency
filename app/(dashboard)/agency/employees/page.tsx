import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import { EmployeesClientView, type EmployeeItem } from './_components/EmployeesClientView'
import { Pagination } from '@/components/ui/Pagination'

export const metadata: Metadata = {
  title: 'Ekip & Çalışanlar – SMAUP',
  description: 'Ajansınıza bağlı çalışan hesaplarını ve ekip bilgilerini yönetin.',
}

function getMetaString(meta: Record<string, unknown>, key: string): string | null {
  const val = meta[key]
  return typeof val === 'string' && val.trim() ? val.trim() : null
}

// Ajans çalışanlar ve ekip yönetim sayfası
export default async function EmployeesPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const page = parseInt(searchParams?.page || '1', 10)
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const user = await requireAgencyOwner()
  const agencyId = user.agencyId

  const agency = await prisma.agencies.findUnique({
    where: { id: agencyId },
    select: { name: true },
  })
  const agencyName = agency?.name ?? 'Ajansım'

  const totalEmployees = await prisma.profiles.count({
    where: { agency_id: agencyId, role: 'employee' },
  })

  const employees = await prisma.profiles.findMany({
    where: { agency_id: agencyId, role: 'employee' },
    include: {
      users: {
        select: {
          email: true,
          raw_user_meta_data: true,
        },
      },
      tasks: {
        where: { is_active: true },
        select: {
          id: true,
          platform: true,
          content: true,
          status: true,
          due_date: true,
          assignment_note: true,
          brands: { select: { name: true } },
        },
        orderBy: { due_date: 'asc' },
      },
    },
    orderBy: { created_at: 'desc' },
    skip,
    take: pageSize,
  })

  const activeStatuses = ['unassigned', 'assigned', 'pending_approval', 'revision_requested']

  const metricsData = await prisma.profiles.findMany({
    where: { agency_id: agencyId, role: 'employee' },
    select: {
      is_active: true,
      salary: true,
      tasks: { where: { is_active: true }, select: { status: true } },
    },
  })

  const activeEmployees = metricsData.filter((e) => e.is_active).length
  const totalMonthlySalary = metricsData.reduce((sum, e) => sum + Number(e.salary ?? 0), 0)
  const assignedTasksCount = metricsData.reduce(
    (sum, e) => sum + e.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length,
    0
  )

  const employeeItems: EmployeeItem[] = employees.map((e) => {
    const rawMeta =
      e.users?.raw_user_meta_data &&
      typeof e.users.raw_user_meta_data === 'object' &&
      !Array.isArray(e.users.raw_user_meta_data)
        ? (e.users.raw_user_meta_data as Record<string, unknown>)
        : {}

    const activeTaskCount = e.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length
    const completedTaskCount = e.tasks.filter((t) => t.status === 'completed').length

    return {
      id: e.id,
      firstName: e.first_name,
      lastName: e.last_name,
      email: e.users?.email ?? '',
      salary: Number(e.salary ?? 0),
      isActive: e.is_active ?? true,
      createdAt: e.created_at?.toISOString() ?? null,
      metadata: {
        phone: getMetaString(rawMeta, 'phone'),
        department: getMetaString(rawMeta, 'department'),
        title: getMetaString(rawMeta, 'title'),
        workType: getMetaString(rawMeta, 'work_type'),
        startDate: getMetaString(rawMeta, 'start_date'),
        city: getMetaString(rawMeta, 'city'),
        iban: getMetaString(rawMeta, 'iban'),
        emergencyContact: getMetaString(rawMeta, 'emergency_contact'),
        notes: getMetaString(rawMeta, 'notes'),
      },
      activeTaskCount,
      completedTaskCount,
      recentTasks: e.tasks.slice(0, 6).map((t) => ({
        id: t.id,
        brandName: t.brands?.name ?? 'Marka',
        platform: t.platform,
        content: t.content,
        status: t.status ?? 'assigned',
        dueDate: t.due_date ? t.due_date.toISOString().slice(0, 10) : '',
        assignmentNote: t.assignment_note,
      })),
    }
  })

  const totalPages = Math.ceil(totalEmployees / pageSize)

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <EmployeesClientView
        agencyName={agencyName}
        employees={employeeItems}
        metrics={{
          totalEmployees,
          activeEmployees,
          totalMonthlySalary,
          assignedTasksCount,
        }}
      />
      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  )
}
