import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import { EmployeesClientView } from './_components/EmployeesClientView'

import { Pagination } from '@/components/ui/Pagination'

export const metadata: Metadata = {
  title: 'Ekip & Çalışanlar – SMAUP',
  description: 'Ajansınıza bağlı çalışan hesaplarını ve ekip bilgilerini yönetin.',
}

// Ajans calisanlar ve ekip yonetim sayfasi
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

  // Toplam kayıt sayısını al
  const totalEmployees = await prisma.profiles.count({
    where: { agency_id: agencyId, role: 'employee' },
  })

  const employees = await prisma.profiles.findMany({
    where: { agency_id: agencyId, role: 'employee' },
    include: {
      users: { select: { email: true } },
      tasks: { select: { id: true, status: true } },
    },
    orderBy: { created_at: 'desc' },
    skip,
    take: pageSize,
  })

  // Aktif gorev durumlari
  const activeStatuses = ['unassigned', 'assigned', 'pending_approval', 'revision_requested']

  // Metrik hesaplama için tüm verileri hafifçe çek
  const metricsData = await prisma.profiles.findMany({
    where: { agency_id: agencyId, role: 'employee' },
    select: {
      is_active: true,
      salary: true,
      tasks: { select: { status: true } }
    }
  })

  const activeEmployees = metricsData.filter((e) => e.is_active).length
  const totalMonthlySalary = metricsData.reduce((sum, e) => sum + Number(e.salary ?? 0), 0)
  const assignedTasksCount = metricsData.reduce(
    (sum, e) => sum + e.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length,
    0
  )

  const employeeItems = employees.map((e) => {
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
      activeTaskCount,
      completedTaskCount,
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
