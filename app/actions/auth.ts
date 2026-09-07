'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getServiceClient, getAnonClient } from '@/lib/supabase/server'

// ─── Role → path mapping ──────────────────────────────────────────────────────
const ROLE_REDIRECT: Record<string, string> = {
  super_admin: '/admin',
  agency_owner: '/agency',
  employee: '/employee',
  customer: '/customer',
}

// ─── Cookie Helper ────────────────────────────────────────────────────────────
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

/**
 * Login Server Action
 * Supabase Auth ile giriş yapar, profiles tablosundan role okur, ilgili panele yönlendirir.
 */
export async function loginAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-posta ve şifre zorunludur.' }
  }

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

  // Profile'dan rol ve isim bilgisini al (service client ile RLS bypass)
  let profile
  try {
    const serviceClient = getServiceClient()
    const { data, error: profileError } = await serviceClient
      .from('profiles')
      .select('role, agency_id, first_name, last_name')
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

  // Session + meta cookie'lerini yaz
  const cookieStore = await cookies()

  cookieStore.set('sb-access-token', authData.session.access_token, getCookieOptions(7))
  cookieStore.set('sb-refresh-token', authData.session.refresh_token, getCookieOptions(30))
  cookieStore.set('user-role', profile.role, getCookieOptions(7))

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
  if (fullName) {
    cookieStore.set('user-name', fullName, getCookieOptions(7))
  }

  if (profile.agency_id) {
    cookieStore.set('agency-id', profile.agency_id, getCookieOptions(7))
  }

  const destination = ROLE_REDIRECT[profile.role] ?? '/agency'
  redirect(destination)
}

/**
 * Register Server Action — Sadece Ajans Sahipleri için
 * 1) Supabase Auth kullanıcısı oluşturur (admin API ile, e-posta onaysız)
 * 2) agencies tablosuna ajansı kaydeder
 * 3) profiles tablosuna agency_owner rolünde profile oluşturur
 * 4) Oturum açar ve /agency'e yönlendirir
 */
export async function registerAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const agencyName = (formData.get('agency_name') as string)?.trim()
  const fullName = (formData.get('full_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!agencyName || !fullName || !email || !password) {
    return { error: 'Tüm alanlar zorunludur.' }
  }

  if (password.length < 6) {
    return { error: 'Şifre en az 6 karakter olmalıdır.' }
  }

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

  // 1) Auth kullanıcısı oluştur (e-posta onaysız, direkt aktif)
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

  // 2) agencies tablosuna ajansı kaydet
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

  // 3) profiles tablosuna agency_owner olarak kaydet
  const { error: profileError } = await serviceClient.from('profiles').insert({
    id: newUser.user.id,
    agency_id: agency.id,
    role: 'agency_owner',
    first_name: firstName,
    last_name: lastName,
    is_active: true,
  })

  if (profileError) {
    // Rollback
    await serviceClient.auth.admin.deleteUser(newUser.user.id)
    await serviceClient.from('agencies').delete().eq('id', agency.id)
    return { error: `Profil oluşturulamadı: ${profileError.message}` }
  }

  // 4) Oturum aç (signInWithPassword ile session al)
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
    // Kayıt başarılı ama oturum açılamadı, login'e yönlendir
    redirect('/login')
  }

  // 5) Cookie'leri yaz
  const cookieStore = await cookies()
  cookieStore.set('sb-access-token', session.session.access_token, getCookieOptions(7))
  cookieStore.set('sb-refresh-token', session.session.refresh_token, getCookieOptions(30))
  cookieStore.set('user-role', 'agency_owner', getCookieOptions(7))
  cookieStore.set('user-name', fullName, getCookieOptions(7))
  cookieStore.set('agency-id', agency.id, getCookieOptions(7))

  redirect('/agency')
}

/**
 * Logout Server Action
 * Çerezleri temizler, Supabase oturumunu sonlandırır ve /login sayfasına yönlendirir.
 */
export async function logoutAction() {
  try {
    const anonClient = getAnonClient()
    await anonClient.auth.signOut()
  } catch {
    // Oturum zaten geçersizse veya ağ hatası olsa bile çerezleri temizleyip yönlendirmeye devam et
  }

  const cookieStore = await cookies()
  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')
  cookieStore.delete('user-role')
  cookieStore.delete('user-name')
  cookieStore.delete('agency-id')

  redirect('/login')
}
