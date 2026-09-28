import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAgencyOwner } from '@/lib/auth'
import {
  ContentPlanClientView,
  ContentTemplateItem,
  BrandOption,
  CalendarTaskItem,
} from './_components/ContentPlanClientView'

export const metadata: Metadata = {
  title: 'İçerik Planı – SMAUP',
  description: 'Markalarınızın haftalık içerik stratejilerini planlayın, rutin şablonlar oluşturun ve tek tıkla görevlere dönüştürün.',
}

export default async function AgencyContentPage() {
  const agencyOwner = await requireAgencyOwner()
  const agencyId = agencyOwner.agencyId

  const [agency, brandsData, templatesData, tasksData] = await Promise.all([
    prisma.agencies.findUnique({
      where: { id: agencyId },
      select: { name: true },
    }),
    prisma.brands.findMany({
      where: { agency_id: agencyId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.content_templates.findMany({
      where: { brands: { agency_id: agencyId } },
      include: {
        brands: { select: { id: true, name: true } },
      },
      orderBy: [{ day_of_week: 'asc' }, { created_at: 'desc' }],
    }),
    prisma.tasks.findMany({
      where: { agency_id: agencyId, is_active: true },
      select: {
        id: true,
        brand_id: true,
        template_id: true,
        platform: true,
        content: true,
        due_date: true,
        status: true,
        assignment_note: true,
        brands: { select: { name: true } },
      },
      orderBy: { due_date: 'asc' },
    }),
  ])

  const agencyName = agency?.name ?? 'Ajansım'

  const brands: BrandOption[] = brandsData.map((b) => ({
    id: b.id,
    name: b.name,
  }))

  const templates: ContentTemplateItem[] = templatesData.map((t) => ({
    id: t.id,
    brand_id: t.brand_id,
    brand_name: t.brands?.name ?? 'Bilinmeyen Marka',
    day_of_week: t.day_of_week,
    platform: t.platform,
    content: t.content,
    quantity: t.quantity ?? 1,
    default_description: t.default_description,
    is_active: t.is_active ?? true,
    last_generated_at: t.last_generated_at ? t.last_generated_at.toISOString() : null,
    created_at: t.created_at ? t.created_at.toISOString() : '',
  }))

  const calendarTasks: CalendarTaskItem[] = tasksData.map((t) => ({
    id: t.id,
    brand_id: t.brand_id,
    brand_name: t.brands?.name ?? 'Bilinmeyen Marka',
    template_id: t.template_id,
    platform: t.platform,
    content: t.content,
    due_date: t.due_date ? new Date(t.due_date).toISOString().slice(0, 10) : '',
    status: t.status ?? 'unassigned',
    assignment_note: t.assignment_note,
  }))

  // KPI Metrik Hesaplamalari
  const activeTemplates = templates.filter((t) => t.is_active)
  const totalTemplatesCount = templates.length
  const activeTemplatesCount = activeTemplates.length

  const weeklyTargetCount = activeTemplates.reduce(
    (acc, t) => acc + (t.quantity > 0 ? t.quantity : 1),
    0
  )

  // Bu ayki gorevler ve tamamlanma orani
  const now = new Date()
  const currentMonth = now.getUTCMonth()
  const currentYear = now.getUTCFullYear()

  const monthlyTasks = calendarTasks.filter((t) => {
    if (!t.due_date) return false
    const d = new Date(t.due_date)
    return d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear
  })

  const totalMonthlyTasks = monthlyTasks.length
  const completedMonthlyTasks = monthlyTasks.filter((t) => t.status === 'completed').length
  const monthlyCompletionRate =
    totalMonthlyTasks > 0 ? Math.round((completedMonthlyTasks / totalMonthlyTasks) * 100) : 0

  // Platform lideri hesaplama
  const platformCounts: Record<string, number> = {}
  activeTemplates.forEach((t) => {
    const p = t.platform
    platformCounts[p] = (platformCounts[p] || 0) + (t.quantity > 0 ? t.quantity : 1)
  })

  let topPlatform: { platform: string; count: number } | null = null
  let maxCount = 0
  for (const [platform, count] of Object.entries(platformCounts)) {
    if (count > maxCount) {
      maxCount = count
      topPlatform = { platform, count }
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <ContentPlanClientView
        agencyName={agencyName}
        brands={brands}
        templates={templates}
        calendarTasks={calendarTasks}
        weeklyTargetCount={weeklyTargetCount}
        activeTemplatesCount={activeTemplatesCount}
        totalTemplatesCount={totalTemplatesCount}
        monthlyCompletionRate={monthlyCompletionRate}
        totalMonthlyTasks={totalMonthlyTasks}
        completedMonthlyTasks={completedMonthlyTasks}
        topPlatform={topPlatform}
      />
    </div>
  )
}
