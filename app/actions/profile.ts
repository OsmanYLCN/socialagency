'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getServiceClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/auth'
import {
  getFormString,
  normalizeTurkishPhone,
  validateEmail,
  validatePassword,
  validateTurkishPhone,
} from '@/lib/validation'

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
  const user = await requireAuthenticatedUser()
  const cookieStore = await cookies()
  const userId = user.id
  const serviceClient = getServiceClient()
  const firstName = getFormString(formData, 'first_name')
  const lastName = getFormString(formData, 'last_name')
  const phone = normalizeTurkishPhone(getFormString(formData, 'phone'))
  const email = getFormString(formData, 'email')
  const removeAvatar = formData.get('removeAvatar') === 'true'
  const avatarFile = formData.get('avatar') as File | null

  if (!firstName) return { error: 'Ad alanı zorunludur.' }
  if (firstName.length > 100 || lastName.length > 100) return { error: 'Ad veya soyad çok uzun.' }
  const emailError = validateEmail(email)
  if (emailError) return { error: emailError }
  const phoneError = validateTurkishPhone(phone)
  if (phoneError) return { error: phoneError }

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

    const { error: profileError } = await serviceClient
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', userId)

    if (profileError) {
      return { error: `Profil güncellenemedi: ${profileError.message}` }
    }

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
  const user = await requireAuthenticatedUser()
  const userId = user.id
  const serviceClient = getServiceClient()
  const newPassword = getFormString(formData, 'new_password')
  const confirmPassword = getFormString(formData, 'confirm_password')
  const passwordError = validatePassword(newPassword, 'Yeni şifre')
  if (passwordError) return { error: passwordError }

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
