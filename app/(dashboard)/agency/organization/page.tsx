import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import {
  OrganizationClientView,
  type AgencyDetailsDTO,
  type TransactionDTO,
} from './_components/OrganizationClientView'

export const metadata: Metadata = {
  title: 'Ajans Bilgileri & Finans – SMAUP',
  description: 'Ajansınızın kurumsal profilini, iletişim kayıtlarını ve finansal nakit akışını yönetin.',
}

function getSocialString(social: Record<string, unknown>, key: string): string {
  const val = social[key]
  return typeof val === 'string' ? val : ''
}

export default async function AgencyOrganizationPage() {
  const owner = await requireAgencyOwner()
  const agencyId = owner.agencyId

  const [agency, brands, employees, transactionsRaw] = await Promise.all([
    prisma.agencies.findUnique({
      where: { id: agencyId },
    }),
    prisma.brands.findMany({
      where: { agency_id: agencyId },
      select: {
        id: true,
        name: true,
        monthly_fee: true,
        profiles: { where: { role: 'customer' }, select: { is_active: true } },
      },
    }),
    prisma.profiles.findMany({
      where: { agency_id: agencyId, role: 'employee' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        salary: true,
        is_active: true,
      },
    }),
    prisma.transactions.findMany({
      where: { agency_id: agencyId },
      orderBy: [{ transaction_date: 'desc' }, { created_at: 'desc' }],
      take: 50,
    }),
  ])

  const socialObj =
    agency?.social_media &&
    typeof agency.social_media === 'object' &&
    !Array.isArray(agency.social_media)
      ? (agency.social_media as Record<string, unknown>)
      : {}

  const agencyDetails: AgencyDetailsDTO = {
    id: agency?.id ?? agencyId,
    name: agency?.name ?? 'Ajansım',
    status: agency?.status ?? 'pending',
    contactEmail: agency?.contact_email ?? owner.email ?? '',
    contactPhone: agency?.contact_phone ?? '',
    establishedYear: agency?.established_year ?? null,
    employeeCount: agency?.employee_count ?? employees.length,
    workModel: agency?.work_model ?? null,
    address: agency?.address ?? '',
    mapsUrl: agency?.maps_url ?? '',
    createdAt: agency?.created_at?.toISOString() ?? null,
    website: getSocialString(socialObj, 'website'),
    instagram: getSocialString(socialObj, 'instagram'),
    linkedin: getSocialString(socialObj, 'linkedin'),
    sector: getSocialString(socialObj, 'sector'),
    taxOffice: getSocialString(socialObj, 'tax_office'),
    taxId: getSocialString(socialObj, 'tax_id'),
    description: getSocialString(socialObj, 'description'),
  }

  // Sabit aylık sözleşmeli marka geliri ve aktif personel bordro yükü
  const monthlyContractRevenue = brands.reduce((sum, b) => sum + Number(b.monthly_fee ?? 0), 0)
  const monthlyPayrollExpense = employees
    .filter((e) => e.is_active !== false)
    .reduce((sum, e) => sum + Number(e.salary ?? 0), 0)

  const transactions: TransactionDTO[] = transactionsRaw.map((tr) => ({
    id: tr.id,
    type: tr.type,
    category: tr.category,
    amount: Number(tr.amount),
    description: tr.description,
    transactionDate: tr.transaction_date.toISOString().slice(0, 10),
    createdAt: tr.created_at?.toISOString() ?? '',
  }))

  const extraIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const extraExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalRevenue = monthlyContractRevenue + extraIncome
  const totalExpenses = monthlyPayrollExpense + extraExpense
  const netProfit = totalRevenue - totalExpenses
  const profitMarginPct = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <OrganizationClientView
        agency={agencyDetails}
        transactions={transactions}
        financialSummary={{
          monthlyContractRevenue,
          monthlyPayrollExpense,
          extraIncome,
          extraExpense,
          totalRevenue,
          totalExpenses,
          netProfit,
          profitMarginPct,
          activeBrandsCount: brands.length,
          activeEmployeesCount: employees.filter((e) => e.is_active !== false).length,
        }}
      />
    </div>
  )
}
