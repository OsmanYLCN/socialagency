import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { requireAuthenticatedUser } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'

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
  let userEmail = cookieStore.get('user-email')?.value ?? ''
  let userPhone = cookieStore.get('user-phone')?.value ?? ''
  const userAvatar = cookieStore.get('user-avatar')?.value ?? ''
  const userId = user.id

  if (!userEmail) {
    try {
      const profile = await prisma.profiles.findUnique({
        where: { id: userId },
        include: {
          users: { select: { email: true, phone: true } },
          agencies: { select: { contact_email: true } },
        },
      })

      if (profile) {
        userEmail = profile.users?.email || profile.agencies?.contact_email || ''
        userPhone = profile.users?.phone || userPhone
      }
    } catch {
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar role={userRole} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          userName={userName}
          role={userRole}
          initialEmail={userEmail}
          initialPhone={userPhone}
          initialAvatar={userAvatar}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
