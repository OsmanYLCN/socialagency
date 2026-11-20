import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import { CustomersClientView, type BrandItem } from './_components/CustomersClientView'
import { Pagination } from '@/components/ui/Pagination'

export const metadata: Metadata = {
  title: 'Müşteriler & Markalar – SMAUP',
  description: 'Ajansınıza bağlı marka ve müşteri hesaplarını yönetin.',
}

function getMetaString(meta: Record<string, unknown>, key: string): string | null {
  const val = meta[key]
  return typeof val === 'string' && val.trim() ? val.trim() : null
}

// Ajans müşteri ve marka yönetim sayfası
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

  const totalBrands = await prisma.brands.count({
    where: { agency_id: agencyId },
  })

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
            select: {
              email: true,
              raw_user_meta_data: true,
            },
          },
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
        },
        orderBy: { due_date: 'asc' },
      },
      content_templates: {
        where: { is_active: true },
        select: { id: true, quantity: true },
      },
    },
    orderBy: { created_at: 'desc' },
    skip,
    take: pageSize,
  })

  const metricsData = await prisma.brands.findMany({
    where: { agency_id: agencyId },
    select: {
      monthly_fee: true,
      profiles: { where: { role: 'customer' }, select: { is_active: true } },
      tasks: { where: { is_active: true }, select: { status: true } },
    },
  })

  const activeBrands = metricsData.filter((b) => b.profiles.some((p) => p.is_active)).length
  const monthlyRevenue = metricsData.reduce((sum, b) => sum + Number(b.monthly_fee ?? 0), 0)
  const activeStatuses = ['unassigned', 'assigned', 'pending_approval', 'revision_requested']
  const activeTasksCount = metricsData.reduce(
    (sum, b) => sum + b.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length,
    0
  )

  const brandItems: BrandItem[] = brands.map((b) => {
    const customer = b.profiles[0] ?? null
    const rawMeta =
      customer?.users?.raw_user_meta_data &&
      typeof customer.users.raw_user_meta_data === 'object' &&
      !Array.isArray(customer.users.raw_user_meta_data)
        ? (customer.users.raw_user_meta_data as Record<string, unknown>)
        : {}

    const activeTaskCount = b.tasks.filter((t) => activeStatuses.includes(t.status ?? '')).length
    const completedTaskCount = b.tasks.filter((t) => t.status === 'completed').length
    const weeklyTemplateQuota = b.content_templates.reduce(
      (sum, tmpl) => sum + (tmpl.quantity && tmpl.quantity > 0 ? tmpl.quantity : 1),
      0
    )

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
      metadata: {
        phone: getMetaString(rawMeta, 'phone'),
        sector: getMetaString(rawMeta, 'sector'),
        website: getMetaString(rawMeta, 'website'),
        instagram: getMetaString(rawMeta, 'instagram'),
        city: getMetaString(rawMeta, 'city'),
        billingTitle: getMetaString(rawMeta, 'billing_title'),
        taxId: getMetaString(rawMeta, 'tax_id'),
        taxOffice: getMetaString(rawMeta, 'tax_office'),
        notes: getMetaString(rawMeta, 'notes'),
      },
      activeTaskCount,
      completedTaskCount,
      weeklyTemplateQuota,
      recentTasks: b.tasks.slice(0, 6).map((t) => ({
        id: t.id,
        platform: t.platform,
        content: t.content,
        status: t.status ?? 'unassigned',
        dueDate: t.due_date ? t.due_date.toISOString().slice(0, 10) : '',
        assignmentNote: t.assignment_note,
      })),
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
