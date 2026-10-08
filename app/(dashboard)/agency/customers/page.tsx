import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import { CustomersClientView } from './_components/CustomersClientView'

import { Pagination } from '@/components/ui/Pagination'

export const metadata: Metadata = {
  title: 'Müşteriler & Markalar – SMAUP',
  description: 'Ajansınıza bağlı marka ve müşteri hesaplarını yönetin.',
}

// Ajans musteri ve marka yonetim sayfasi
export default async function CustomersPage(props: { searchParams: Promise<{ page?: string }> }) {
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
  const totalBrands = await prisma.brands.count({
    where: { agency_id: agencyId },
  })

  // Sadece ilgili sayfadaki markaları çek
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
    skip,
    take: pageSize,
  })

  // Metrikler için özet veri (sadece gerekli alanları çekerek belleği yormadan hesaplama)
  const metricsData = await prisma.brands.findMany({
    where: { agency_id: agencyId },
    select: {
      monthly_fee: true,
      profiles: { where: { role: 'customer' }, select: { is_active: true } },
      tasks: { select: { status: true } }
    }
  })

  const activeBrands = metricsData.filter((b) => b.profiles.some((p) => p.is_active)).length
  const monthlyRevenue = metricsData.reduce((sum, b) => sum + Number(b.monthly_fee ?? 0), 0)
  const activeStatuses = ['unassigned', 'assigned', 'pending_approval', 'revision_requested']
  const activeTasksCount = metricsData.reduce(
    (sum, b) => sum + b.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length,
    0
  )

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

  const totalPages = Math.ceil(totalBrands / pageSize)

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
      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  )
}

