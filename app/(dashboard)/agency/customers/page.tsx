import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import { CustomersClientView } from './_components/CustomersClientView'

// Ajans musteri ve marka yonetim sayfasi
export default async function CustomersPage() {
  const user = await requireAgencyOwner()
  const agencyId = user.agencyId

  const agency = await prisma.agencies.findUnique({
    where: { id: agencyId },
    select: { name: true },
  })
  const agencyName = agency?.name ?? 'Ajansım'

  const brands = await prisma.brands.findMany({
    where: { agency_id: agencyId },
    include: {
      profiles: {
        where: { role: 'customer' },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          is_active: true,
          users: {
            select: { email: true },
          },
        },
      },
      tasks: {
        select: { id: true, status: true },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  // Sayfa proplarini hesapla
  const totalBrands = brands.length
  const activeBrands = brands.filter((b) => b.profiles.some((p) => p.is_active)).length
  const monthlyRevenue = brands.reduce((sum, b) => sum + Number(b.monthly_fee ?? 0), 0)
  const activeStatuses = ['unassigned', 'assigned', 'pending_approval', 'revision_requested']
  const activeTasksCount = brands.reduce(
    (sum, b) => sum + b.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length,
    0
  )

  // Istemci bilesenine aktarilacak sekilde serialize et
  const brandItems = brands.map((b) => {
    const customer = b.profiles[0] ?? null
    const activeTaskCount = b.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length
    const completedTaskCount = b.tasks.filter((t) => t.status === 'completed').length

    return {
      id: b.id,
      name: b.name,
      monthlyFee: Number(b.monthly_fee ?? 0),
      createdAt: b.created_at?.toISOString() ?? null,
      customer: customer
        ? {
            id: customer.id,
            firstName: customer.first_name,
            lastName: customer.last_name,
            email: customer.users?.email ?? null,
            isActive: customer.is_active ?? true,
          }
        : null,
      activeTaskCount,
      completedTaskCount,
    }
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <CustomersClientView
        agencyName={agencyName}
        brands={brandItems}
        metrics={{
          totalBrands,
          activeBrands,
          monthlyRevenue,
          activeTasksCount,
        }}
      />
    </div>
  )
}
