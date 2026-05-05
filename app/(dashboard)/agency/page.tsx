// Server Component — gerçek veritabanı verileri çekilir
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import {
  Users,
  UserCheck,
  CheckSquare,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { AgencyQuickActions } from './_components/AgencyQuickActions'

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  sub,
}: {
  title: string
  value: number | string
  icon: React.ElementType
  color: string
  bgColor: string
  sub?: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${bgColor}`}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
          {sub && (
            <p className="mt-1 text-xs font-medium text-gray-400">{sub}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

// ─── DB helpers ──────────────────────────────────────────────────────────────
async function getDashboardStats(agencyId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const today = new Date().toISOString().split('T')[0]

  // Paralel sorgular
  const [customersRes, employeesRes, todayTasksRes, pendingRes] = await Promise.all([
    // Aktif müşteri sayısı (role='customer', is_active=true, aynı ajans)
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('agency_id', agencyId)
      .eq('role', 'customer')
      .eq('is_active', true),

    // Çalışan sayısı
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('agency_id', agencyId)
      .eq('role', 'employee')
      .eq('is_active', true),

    // Bugünkü görev sayısı
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('agency_id', agencyId)
      .eq('due_date', today)
      .eq('is_active', true),

    // Onay bekleyen görevler (status = 'pending_approval')
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('agency_id', agencyId)
      .eq('status', 'pending_approval')
      .eq('is_active', true),
  ])

  return {
    customers: customersRes.count ?? 0,
    employees: employeesRes.count ?? 0,
    todayTasks: todayTasksRes.count ?? 0,
    pending: pendingRes.count ?? 0,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AgencyPage() {
  const cookieStore = await cookies()
  const agencyId = cookieStore.get('agency-id')?.value

  // Eğer agency-id yoksa istatistikleri 0 göster
  const stats = agencyId
    ? await getDashboardStats(agencyId)
    : { customers: 0, employees: 0, todayTasks: 0, pending: 0 }

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Hoş Geldiniz 👋</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ajans paneline genel bakış — {today}
          </p>
        </div>
        {stats.pending > 0 && (
          <div className="hidden items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2 sm:flex">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-600">
              {stats.pending} onay bekliyor
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Aktif Müşteri"
          value={stats.customers}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-100"
          sub={stats.customers === 0 ? 'Henüz müşteri yok' : `${stats.customers} aktif marka`}
        />
        <StatCard
          title="Çalışan Sayısı"
          value={stats.employees}
          icon={UserCheck}
          color="text-purple-600"
          bgColor="bg-purple-100"
          sub={stats.employees === 0 ? 'Henüz çalışan yok' : `${stats.employees} aktif çalışan`}
        />
        <StatCard
          title="Bugünkü Görevler"
          value={stats.todayTasks}
          icon={CheckSquare}
          color="text-green-600"
          bgColor="bg-green-100"
          sub={stats.todayTasks === 0 ? 'Bugün görev yok' : `${stats.todayTasks} görev planlandı`}
        />
        <StatCard
          title="Onay Bekleyen"
          value={stats.pending}
          icon={Clock}
          color="text-orange-600"
          bgColor="bg-orange-100"
          sub={stats.pending === 0 ? 'Onay bekleyen yok' : `${stats.pending} görev onay bekliyor`}
        />
      </div>

      {/* Quick Actions — Client Component (modaller burada) */}
      <AgencyQuickActions />

      {/* Boş durum mesajı */}
      {stats.customers === 0 && stats.employees === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-700">Panele hoş geldiniz!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Başlamak için yukarıdan müşteri veya çalışan ekleyin.
          </p>
        </div>
      )}
    </div>
  )
}
