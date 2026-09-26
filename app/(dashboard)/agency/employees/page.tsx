import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import { EmployeesClientView } from './_components/EmployeesClientView'

export const metadata: Metadata = {
  title: 'Ekip & Çalışanlar – SMAUP',
  description: 'Ajansınıza bağlı çalışan hesaplarını ve ekip bilgilerini yönetin.',
}

// Ajans calisanlar ve ekip yonetim sayfasi
export default async function EmployeesPage() {
  const user = await requireAgencyOwner()
  const agencyId = user.agencyId

  const agency = await prisma.agencies.findUnique({
    where: { id: agencyId },
    select: { name: true },
  })
  const agencyName = agency?.name ?? 'Ajansım'

  const employees = await prisma.profiles.findMany({
    where: { agency_id: agencyId, role: 'employee' },
    include: {
      users: { select: { email: true } },
      tasks: { select: { id: true, status: true } },
    },
    orderBy: { created_at: 'desc' },
  })

  // Aktif gorev durumlari
  const activeStatuses = ['unassigned', 'assigned', 'pending_approval', 'revision_requested']

  // Metrik hesaplama
  const totalEmployees = employees.length
  const activeEmployees = employees.filter((e) => e.is_active).length
  const totalMonthlySalary = employees.reduce((sum, e) => sum + Number(e.salary ?? 0), 0)
  const assignedTasksCount = employees.reduce(
    (sum, e) => sum + e.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length,
    0
  )

  // Istemci bilesenine aktarilacak sekilde serialize et
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
    </div>
  )
}
