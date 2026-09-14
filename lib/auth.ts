import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServiceClient } from '@/lib/supabase/server'

export interface AuthenticatedUser {
  id: string
  role: string
  agencyId: string | null
  brandId: string | null
  firstName: string | null
  lastName: string | null
}

export type AgencyOwner = AuthenticatedUser & {
  role: 'agency_owner'
  agencyId: string
}

const ROLE_REDIRECT: Record<string, string> = {
  super_admin: '/admin',
  agency_owner: '/agency',
  employee: '/employee',
  customer: '/customer',
}

// Access token ve profil kaydını birlikte doğrular.
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (!accessToken) {
    return null
  }

  const serviceClient = getServiceClient()
  const { data: authData, error: authError } = await serviceClient.auth.getUser(accessToken)

  if (authError || !authData.user) {
    return null
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: authData.user.id },
    select: {
      id: true,
      role: true,
      agency_id: true,
      brand_id: true,
      first_name: true,
      last_name: true,
      is_active: true,
    },
  })

  if (!profile || profile.is_active === false) {
    return null
  }

  return {
    id: profile.id,
    role: profile.role,
    agencyId: profile.agency_id,
    brandId: profile.brand_id,
    firstName: profile.first_name,
    lastName: profile.last_name,
  }
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()

  if (!user) {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('sb-refresh-token')?.value
    if (refreshToken) {
      const role = cookieStore.get('user-role')?.value
      const destination = ROLE_REDIRECT[role ?? ''] ?? '/agency'
      redirect(`/auth/refresh?next=${encodeURIComponent(destination)}`)
    }
    redirect('/login')
  }

  return user
}

export async function requireRole(role: string): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser()

  if (user.role !== role) {
    redirect(ROLE_REDIRECT[user.role] ?? '/login')
  }

  return user
}

export async function getAgencyOwner(): Promise<AgencyOwner | null> {
  const user = await getAuthenticatedUser()

  if (!user || user.role !== 'agency_owner' || !user.agencyId) {
    if (!user && (await cookies()).get('sb-refresh-token')?.value) {
      redirect('/auth/refresh?next=/agency')
    }
    return null
  }

  return { ...user, role: 'agency_owner', agencyId: user.agencyId }
}

export async function requireAgencyOwner(): Promise<AgencyOwner> {
  const user = await requireRole('agency_owner')

  if (!user.agencyId) {
    redirect('/login')
  }

  return { ...user, role: 'agency_owner', agencyId: user.agencyId }
}
