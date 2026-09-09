'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getServiceClient } from '@/lib/supabase/server'

export interface ProfileDetails {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  role: string
}

// Giriş yapmış kullanıcının profil detaylarını döndürür
export async function getProfileDetailsAction(): Promise<ProfileDetails | null> {
  const cookieStore = await cookies()
  let userId = cookieStore.get('user-id')?.value
  const token = cookieStore.get('sb-access-token')?.value
  const userRole = cookieStore.get('user-role')?.value ?? 'agency_owner'

  const agencyId = cookieStore.get('agency-id')?.value

  const serviceClient = getServiceClient()

  if (!userId && token) {
    try {
      const { data } = await serviceClient.auth.getUser(token)
      if (data?.user) {
        userId = data.user.id
      }
    } catch {
      // ignore
    }
  }

  if (!userId && agencyId) {
    try {
      const p = await prisma.profiles.findFirst({
        where: { agency_id: agencyId },
        select: { id: true },
      })
      if (p?.id) userId = p.id
    } catch {
      // ignore
    }
  }

  if (!userId) {
    return null
  }

  let email = cookieStore.get('user-email')?.value ?? ''
  let phone = cookieStore.get('user-phone')?.value ?? ''

  try {
    const { data: userData } = await serviceClient.auth.admin.getUserById(userId)
    if (userData?.user) {
      email = userData.user.email ?? email
      phone = userData.user.phone || (userData.user.user_metadata?.phone as string) || phone
    }
  } catch {
    // fallback
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: {
      first_name: true,
      last_name: true,
      role: true,
      users: { select: { email: true, phone: true } },
      agencies: { select: { contact_email: true } },
    },
  })

  if (!email) {
    email = profile?.users?.email || profile?.agencies?.contact_email || ''
  }
  if (!phone) {
    phone = profile?.users?.phone || ''
  }

  if (phone) {
    phone = phone.replace(/\D/g, '')
    if (phone.startsWith('90') && phone.length > 10) {
      phone = phone.slice(2)
    }
    while (phone.startsWith('0')) {
      phone = phone.slice(1)
    }
    phone = phone.slice(0, 10)
  }

  const firstName = profile?.first_name ?? ''
  const lastName = profile?.last_name ?? ''
  const fullName =
    [firstName, lastName].filter(Boolean).join(' ') ||
    cookieStore.get('user-name')?.value ||
    'Kullanıcı'

  return {
    id: userId,
    firstName,
    lastName,
    fullName,
    email,
    phone,
    role: profile?.role ?? userRole,
  }
}

// Kişisel bilgileri (Ad, Soyad, Telefon, E-posta) günceller
export async function updateProfileDetailsAction(
  prevState: { success?: boolean; error?: string; message?: string; fullName?: string } | null,
  formData: FormData
) {
  const cookieStore = await cookies()
  let userId = cookieStore.get('user-id')?.value
  const token = cookieStore.get('sb-access-token')?.value
  const agencyId = cookieStore.get('agency-id')?.value

  const serviceClient = getServiceClient()

  if (!userId && token) {
    try {
      const { data } = await serviceClient.auth.getUser(token)
      if (data?.user) {
        userId = data.user.id
      }
    } catch {
      // ignore
    }
  }

  if (!userId && agencyId) {
    try {
      const p = await prisma.profiles.findFirst({
        where: { agency_id: agencyId },
        select: { id: true },
      })
      if (p?.id) userId = p.id
    } catch {
      // ignore
    }
  }

  if (!userId) {
    return { error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' }
  }

  const firstName = (formData.get('first_name') as string)?.trim() ?? ''
  const lastName = (formData.get('last_name') as string)?.trim() ?? ''
  let phone = (formData.get('phone') as string)?.trim() ?? ''
  const email = (formData.get('email') as string)?.trim() ?? ''

  if (phone) {
    phone = phone.replace(/\D/g, '')
    if (phone.startsWith('90') && phone.length > 10) {
      phone = phone.slice(2)
    }
    while (phone.startsWith('0')) {
      phone = phone.slice(1)
    }
    phone = phone.slice(0, 10)

    if (phone.length !== 10) {
      return { error: 'Telefon numarası başında 0 olmadan 10 haneli olmalıdır.' }
    }
    if (!phone.startsWith('5')) {
      return { error: 'Telefon numarası 5 ile başlamalıdır.' }
    }
  }

  if (!firstName) {
    return { error: 'Ad alanı zorunludur.' }
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  try {
    // 1. Prisma profiles tablosunu güncelle
    await prisma.profiles.update({
      where: { id: userId },
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    })

    // 2. Supabase Auth kullanıcısını güncelle
    const userMetadata = {
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      phone: phone,
    }

    const authUpdates: {
      email?: string
      email_confirm?: boolean
      phone?: string
      user_metadata: typeof userMetadata
    } = {
      user_metadata: userMetadata,
    }

    if (email) {
      authUpdates.email = email
      authUpdates.email_confirm = true
    }

    if (phone) {
      try {
        await serviceClient.auth.admin.updateUserById(userId, {
          ...authUpdates,
          phone: `+90${phone}`,
        })
      } catch {
        // E.164 veya format aksaması durumunda metadata'da sakla
        await serviceClient.auth.admin.updateUserById(userId, authUpdates)
      }
    } else {
      await serviceClient.auth.admin.updateUserById(userId, authUpdates)
    }

    // 3. İstemci çerezlerini tazele
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }

    cookieStore.set('user-name', fullName, cookieOptions)

    if (email) {
      cookieStore.set('user-email', email, cookieOptions)
    }

    if (phone) {
      cookieStore.set('user-phone', phone, cookieOptions)
    }

    return {
      success: true,
      message: 'Kişisel bilgileriniz başarıyla güncellendi.',
      fullName,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Güncelleme sırasında hata oluştu.'
    return { error: msg }
  }
}

// Şifre değiştirme eylemi
export async function changePasswordAction(
  prevState: { success?: boolean; error?: string; message?: string } | null,
  formData: FormData
) {
  const cookieStore = await cookies()
  let userId = cookieStore.get('user-id')?.value
  const token = cookieStore.get('sb-access-token')?.value
  const agencyId = cookieStore.get('agency-id')?.value

  const serviceClient = getServiceClient()

  if (!userId && token) {
    try {
      const { data } = await serviceClient.auth.getUser(token)
      if (data?.user) {
        userId = data.user.id
      }
    } catch {
      // ignore
    }
  }

  if (!userId && agencyId) {
    try {
      const p = await prisma.profiles.findFirst({
        where: { agency_id: agencyId },
        select: { id: true },
      })
      if (p?.id) userId = p.id
    } catch {
      // ignore
    }
  }

  if (!userId) {
    return { error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' }
  }

  const newPassword = (formData.get('new_password') as string) ?? ''
  const confirmPassword = (formData.get('confirm_password') as string) ?? ''

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Yeni şifre en az 6 karakter olmalıdır.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Girdiğiniz yeni şifreler eşleşmiyor.' }
  }

  try {
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
      password: newPassword,
    })

    if (updateError) {
      return { error: `Şifre güncellenemedi: ${updateError.message}` }
    }

    return {
      success: true,
      message: 'Şifreniz güvenli bir şekilde güncellendi.',
    }
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : 'Şifre güncellenirken beklenmedik bir hata oluştu.'
    return { error: msg }
  }
}
