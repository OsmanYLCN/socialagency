'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// ─── Role → path mapping ──────────────────────────────────────────────────────
const ROLE_REDIRECT: Record<string, string> = {
  super_admin: '/admin',
  agency_owner: '/agency',
  employee: '/employee',
  customer: '/customer',
}

// ─── Supabase Client Helpers ──────────────────────────────────────────────────
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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
 * Supabase Auth ile giris yapar, profiles tablosundan role okur, ilgili panele yonlendirir.
 */
export async function loginAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-posta ve sifre zorunludur.' }
  }

  const supabase = getAnonClient()
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user || !authData.session) {
    return {
      error:
        authError?.message === 'Invalid login credentials'
          ? 'E-posta veya sifre hatali.'
          : (authError?.message ?? 'Giris basarisiz. Lutfen tekrar deneyin.'),
    }
  }

  // Profile'dan rol ve isim bilgisini al (service client ile RLS bypass)
  const serviceClient = getServiceClient()
  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role, agency_id, first_name, last_name')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (profileError || !profile) {
    return { error: 'Profil bilgisi bulunamadi. Lutfen yoneticinizle iletisime gecin.' }
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
 * Register Server Action — Sadece Ajans Sahipleri icin
 * 1) Supabase Auth kullanicisi olusturur (admin API ile, e-posta onaysiz)
 * 2) agencies tablosuna ajansi kaydeder
 * 3) profiles tablosuna agency_owner rolunde profile olusturur
 * 4) Oturum acar ve /agency'e yonlendirir
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
    return { error: 'Tum alanlar zorunludur.' }
  }

  if (password.length < 6) {
    return { error: 'Sifre en az 6 karakter olmalidir.' }
  }

  const nameParts = fullName.split(' ')
  const firstName = nameParts[0] ?? fullName
  const lastName = nameParts.slice(1).join(' ') || ''

  const serviceClient = getServiceClient()

  // 1) Auth kullanicisi olustur (e-posta onaysiz, direkt aktif)
  const { data: newUser, error: signUpError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, first_name: firstName, last_name: lastName },
  })

  if (signUpError || !newUser.user) {
    const msg = signUpError?.message ?? 'Kullanici olusturulamadi.'
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return { error: 'Bu e-posta adresi zaten kayitli.' }
    }
    return { error: msg }
  }

  // 2) agencies tablosuna ajansi kaydet
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
    return { error: `Ajanss kaydedilemedi: ${agencyError?.message ?? 'Bilinmeyen hata'}` }
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
    return { error: `Profil olusturulamadi: ${profileError.message}` }
  }

  // 4) Oturum ac (signInWithPassword ile session al)
  const anonClient = getAnonClient()
  const { data: session, error: sessionError } = await anonClient.auth.signInWithPassword({
    email,
    password,
  })

  if (sessionError || !session.session) {
    // Kayit basarili ama oturum acilamadi, login'e yonlendir
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
