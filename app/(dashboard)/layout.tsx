import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'

export const metadata: Metadata = {
  title: 'Panel – SMAUP',
  description: 'B2B Sosyal Medya Ajanss Yonetim Paneli',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user-role')?.value ?? 'agency_owner'
  const userName = cookieStore.get('user-name')?.value ?? ''

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar role={userRole} />

      {/* Ana icerik sutunu */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar userName={userName} role={userRole} />

        {/* Sayfa icerigi */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
