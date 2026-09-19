'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getServiceClient, getAnonClient } from '@/lib/supabase/server'
import { getFormString, validateEmail, validatePassword } from '@/lib/validation'
import { ROLE_REDIRECT } from '@/lib/constants'

// Oturum çerezi seçeneklerini hazırlar
function getCookieOptions(maxAgeDays: number) {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * maxAgeDays,
  }
}

// Kullanıcıyı doğrular ve rolüne yönlendirir
export async function loginAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const email = getFormString(formData, 'email')
  const password = getFormString(formData, 'password')

  const emailError = validateEmail(email)
  if (emailError) return { error: emailError }
  const passwordError = validatePassword(password)
  if (passwordError) return { error: passwordError }

  let supabase
  try {
    supabase = getAnonClient()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: message }
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user || !authData.session) {
    return {
      error:
        authError?.message === 'Invalid login credentials'
          ? 'E-posta veya şifre hatalı.'
          : (authError?.message ?? 'Giriş başarısız. Lütfen tekrar deneyin.'),
    }
  }

  let profile
  try {
    const serviceClient = getServiceClient()
    const { data, error: profileError } = await serviceClient
      .from('profiles')
      .select('role, agency_id, first_name, last_name, avatar_url')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (profileError || !data) {
      return { error: 'Profil bilgisi bulunamadı. Lütfen yöneticinizle iletişime geçin.' }
    }
    profile = data
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Profil sorgulama hatası.'
    return { error: message }
  }

  const cookieStore = await cookies()

  cookieStore.set('sb-access-token', authData.session.access_token, getCookieOptions(7))
  cookieStore.set('sb-refresh-token', authData.session.refresh_token, getCookieOptions(30))
  cookieStore.set('user-role', profile.role, getCookieOptions(7))

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
  if (fullName) {
    cookieStore.set('user-name', fullName, getCookieOptions(7))
  }

  if (profile.avatar_url) {
    cookieStore.set('user-avatar', profile.avatar_url, getCookieOptions(7))
  } else {
    cookieStore.delete('user-avatar')
  }

  cookieStore.set('user-id', authData.user.id, getCookieOptions(7))
  if (authData.user.email) {
    cookieStore.set('user-email', authData.user.email, getCookieOptions(7))
  }
  const userPhone = authData.user.phone || (authData.user.user_metadata?.phone as string) || ''
  if (userPhone) {
    cookieStore.set('user-phone', userPhone, getCookieOptions(7))
  }

  if (profile.agency_id) {
    cookieStore.set('agency-id', profile.agency_id, getCookieOptions(7))
  }

  const destination = ROLE_REDIRECT[profile.role] ?? '/agency'
  redirect(destination)
}

// Ajans sahibi hesabı ve profilini oluşturur
export async function registerAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const agencyName = getFormString(formData, 'agency_name')
  const fullName = getFormString(formData, 'full_name')
  const email = getFormString(formData, 'email')
  const password = getFormString(formData, 'password')

  if (!agencyName || !fullName) return { error: 'Ajans adı ve ad soyad zorunludur.' }
  if (agencyName.length > 255 || fullName.length > 200) {
    return { error: 'Ajans adı veya ad soyad çok uzun.' }
  }

  const emailError = validateEmail(email)
  if (emailError) return { error: emailError }
  const passwordError = validatePassword(password)
  if (passwordError) return { error: passwordError }

  const nameParts = fullName.split(' ')
  const firstName = nameParts[0] ?? fullName
  const lastName = nameParts.slice(1).join(' ') || ''

  let serviceClient
  try {
    serviceClient = getServiceClient()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: message }
  }

  const { data: newUser, error: signUpError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, first_name: firstName, last_name: lastName },
  })

  if (signUpError || !newUser.user) {
    const msg = signUpError?.message ?? 'Kullanıcı oluşturulamadı.'
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return { error: 'Bu e-posta adresi zaten kayıtlı.' }
    }
    return { error: msg }
  }

  const { data: agency, error: agencyError } = await serviceClient
    .from('agencies')
    .insert({
      name: agencyName,
      contact_email: email,
      status: 'pending',
    })
    .select('id')
    .single()

  if (agencyError || !agency) {
    await serviceClient.auth.admin.deleteUser(newUser.user.id)
    return { error: `Ajans kaydedilemedi: ${agencyError?.message ?? 'Bilinmeyen hata'}` }
  }

  const { error: profileError } = await serviceClient.from('profiles').insert({
    id: newUser.user.id,
    agency_id: agency.id,
    role: 'agency_owner',
    first_name: firstName,
    last_name: lastName,
    is_active: true,
  })

  if (profileError) {
    await serviceClient.auth.admin.deleteUser(newUser.user.id)
    await serviceClient.from('agencies').delete().eq('id', agency.id)
    return { error: `Profil oluşturulamadı: ${profileError.message}` }
  }

  let anonClient
  try {
    anonClient = getAnonClient()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: message }
  }

  const { data: session, error: sessionError } = await anonClient.auth.signInWithPassword({
    email,
    password,
  })

  if (sessionError || !session.session) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  cookieStore.set('sb-access-token', session.session.access_token, getCookieOptions(7))
  cookieStore.set('sb-refresh-token', session.session.refresh_token, getCookieOptions(30))
  cookieStore.set('user-role', 'agency_owner', getCookieOptions(7))
  cookieStore.set('user-name', fullName, getCookieOptions(7))
  cookieStore.set('user-id', newUser.user.id, getCookieOptions(7))
  cookieStore.set('user-email', email, getCookieOptions(7))
  cookieStore.set('agency-id', agency.id, getCookieOptions(7))

  redirect('/agency')
}

// Oturumu kapatır ve girişe yönlendirir
export async function logoutAction() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  const refreshToken = cookieStore.get('sb-refresh-token')?.value

  if (accessToken && refreshToken) {
    try {
      const anonClient = getAnonClient()
      await anonClient.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      await anonClient.auth.signOut()
    } catch {
      // Supabase bağlantısı veya süresi dolmuş token hataları yerel oturum kapatmayı engellememeli
    }
  }

  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')
  cookieStore.delete('user-role')
  cookieStore.delete('user-name')
  cookieStore.delete('user-email')
  cookieStore.delete('user-phone')
  cookieStore.delete('user-id')
  cookieStore.delete('user-avatar')
  cookieStore.delete('agency-id')

  redirect('/login')
}
