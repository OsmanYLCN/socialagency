import type { Metadata } from 'next'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { requireAuthenticatedUser } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { RouteProgressBar } from '@/components/dashboard/RouteProgressBar'

export const metadata: Metadata = {
  title: 'Panel – SMAUP',
  description: 'B2B Sosyal Medya Ajans Yönetim Paneli',
}

// Ortak dashboard düzenini oluşturur
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser()
  const cookieStore = await cookies()
  const userRole = user.role
  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    cookieStore.get('user-name')?.value ||
    ''
  const userEmail = cookieStore.get('user-email')?.value || user.email || ''
  const userPhone = cookieStore.get('user-phone')?.value || user.phone || ''
  const userAvatar = cookieStore.get('user-avatar')?.value ?? ''

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <Sidebar role={userRole} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          userName={userName}
          role={userRole}
          initialEmail={userEmail}
          initialPhone={userPhone}
          initialAvatar={userAvatar}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
