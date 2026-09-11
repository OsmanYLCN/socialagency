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
  avatarUrl?: string
}

// Kullanıcının profil bilgilerini getirir
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
    }
  }

  if (!userId) {
    return null
  }

  let email = cookieStore.get('user-email')?.value ?? ''
  let phone = cookieStore.get('user-phone')?.value ?? ''
  let avatarUrl = cookieStore.get('user-avatar')?.value ?? ''

  let userDataUser: { email?: string; phone?: string; user_metadata?: Record<string, unknown> } | null = null
  try {
    const { data: userData } = await serviceClient.auth.admin.getUserById(userId)
    if (userData?.user) {
      email = userData.user.email ?? email
      phone = userData.user.phone || (userData.user.user_metadata?.phone as string) || phone
      if (!avatarUrl && userData.user.user_metadata?.avatar_url) {
        avatarUrl = userData.user.user_metadata.avatar_url as string
      }
    }
  } catch {
  }

  try {
    const { data: profData } = await serviceClient
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .maybeSingle()
    if (profData?.avatar_url) {
      avatarUrl = profData.avatar_url
    }
  } catch {
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
    avatarUrl,
  }
}

// Kullanıcının profil bilgilerini günceller
export async function updateProfileDetailsAction(
  prevState: { success?: boolean; error?: string; message?: string; fullName?: string; avatarUrl?: string } | null,
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
    }
  }

  if (!userId) {
    return { error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' }
  }

  const firstName = (formData.get('first_name') as string)?.trim() ?? ''
  const lastName = (formData.get('last_name') as string)?.trim() ?? ''
  let phone = (formData.get('phone') as string)?.trim() ?? ''
  const email = (formData.get('email') as string)?.trim() ?? ''
  const removeAvatar = formData.get('removeAvatar') === 'true'
  const avatarFile = formData.get('avatar') as File | null

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

  let newAvatarUrl: string | undefined = undefined

  if (removeAvatar) {
    newAvatarUrl = ''
  } else if (avatarFile && typeof avatarFile === 'object' && 'size' in avatarFile && avatarFile.size > 0) {
    if (!avatarFile.type.startsWith('image/')) {
      return { error: 'Lütfen geçerli bir görsel dosyası (PNG, JPG, WEBP) seçin.' }
    }
    if (avatarFile.size > 5 * 1024 * 1024) {
      return { error: 'Profil fotoğrafı en fazla 5MB boyutunda olabilir.' }
    }

    try {
      const ext = (avatarFile.name.split('.').pop() || 'jpg').toLowerCase()
      const filename = `${userId}-${Date.now()}.${ext}`
      const buffer = Buffer.from(await avatarFile.arrayBuffer())

      const { error: uploadError } = await serviceClient.storage
        .from('avatars')
        .upload(filename, buffer, {
          contentType: avatarFile.type,
          upsert: true,
        })

      if (uploadError) {
        return { error: `Fotoğraf yüklenemedi: ${uploadError.message}` }
      }

      const { data: publicUrlData } = serviceClient.storage
        .from('avatars')
        .getPublicUrl(filename)

      newAvatarUrl = publicUrlData.publicUrl
    } catch (uploadErr) {
      const msg = uploadErr instanceof Error ? uploadErr.message : 'Görsel yüklenirken hata oluştu.'
      return { error: msg }
    }
  }

  try {
    const profileUpdateData: Record<string, unknown> = {
      first_name: firstName,
      last_name: lastName,
    }
    if (newAvatarUrl !== undefined) {
      profileUpdateData.avatar_url = newAvatarUrl || null
    }

    await serviceClient
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', userId)

    const userMetadata: Record<string, unknown> = {
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      phone: phone,
    }
    if (newAvatarUrl !== undefined) {
      userMetadata.avatar_url = newAvatarUrl || null
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
        await serviceClient.auth.admin.updateUserById(userId, authUpdates)
      }
    } else {
      await serviceClient.auth.admin.updateUserById(userId, authUpdates)
    }

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

    if (newAvatarUrl) {
      cookieStore.set('user-avatar', newAvatarUrl, cookieOptions)
    } else if (removeAvatar) {
      cookieStore.delete('user-avatar')
    }

    return {
      success: true,
      message: 'Kişisel bilgileriniz başarıyla güncellendi.',
      fullName,
      avatarUrl: newAvatarUrl !== undefined ? newAvatarUrl : undefined,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Güncelleme sırasında hata oluştu.'
    return { error: msg }
  }
}

// Kullanıcının şifresini değiştirir
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
