'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Role → path mapping
const ROLE_REDIRECT: Record<string, string> = {
  super_admin: '/admin',
  agency_owner: '/agency',
  employee: '/employee',
  customer: '/client',
}

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

  // signInWithPassword için anon key kullanıyoruz
  const supabase = getAnonClient()

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

  // Profile'dan rol bilgisini al (service client ile RLS bypass)
  const serviceClient = getServiceClient()
  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role, agency_id')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (profileError || !profile) {
    return { error: 'Profil bilgisi bulunamadı. Lütfen yöneticinizle iletişime geçin.' }
  }

  // Session'ı cookie'ye yaz (access + refresh)
  const cookieStore = await cookies()
  const isProd = process.env.NODE_ENV === 'production'

  cookieStore.set('sb-access-token', authData.session.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  cookieStore.set('sb-refresh-token', authData.session.refresh_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  // agency_id'yi de cookie'ye yaz (dashboard'da kullanmak için)
  if (profile.agency_id) {
    cookieStore.set('agency-id', profile.agency_id, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  const destination = ROLE_REDIRECT[profile.role] ?? '/agency'
  redirect(destination)
}

/**
 * Oturumdaki agency_id'yi cookie'den okur
 */
async function getAgencyIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('agency-id')?.value ?? null
}

/**
 * Create Employee Server Action
 */
export async function createEmployeeAction(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const firstName = (formData.get('first_name') as string)?.trim()
  const lastName = (formData.get('last_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const salary = formData.get('salary') as string

  if (!firstName || !lastName || !email || !password || !salary) {
    return { error: 'Tüm alanlar zorunludur.' }
  }

  if (parseFloat(salary) < 0) {
    return { error: 'Maaş 0\'dan küçük olamaz.' }
  }

  const agencyId = await getAgencyIdFromCookie()
  if (!agencyId) {
    return { error: 'Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.' }
  }

  const supabase = getServiceClient()

  // Supabase Admin API ile kullanıcı oluştur
  const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  })

  if (signUpError || !newUser.user) {
    const msg = signUpError?.message ?? 'Kullanıcı oluşturulamadı.'
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return { error: 'Bu e-posta adresi zaten kayıtlı.' }
    }
    return { error: msg }
  }

  // Profile kaydı oluştur
  const { error: profileError } = await supabase.from('profiles').insert({
    id: newUser.user.id,
    agency_id: agencyId,
    role: 'employee',
    first_name: firstName,
    last_name: lastName,
    salary: parseFloat(salary),
    is_active: true,
  })

  if (profileError) {
    // Rollback: auth user'ı sil
    await supabase.auth.admin.deleteUser(newUser.user.id)
    return { error: `Profil oluşturulamadı: ${profileError.message}` }
  }

  return { success: `${firstName} ${lastName} başarıyla çalışan olarak eklendi.` }
}

/**
 * Create Customer Server Action
 */
export async function createCustomerAction(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const brandName = (formData.get('brand_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const monthlyFee = formData.get('monthly_fee') as string

  if (!brandName || !email || !password || !monthlyFee) {
    return { error: 'Tüm alanlar zorunludur.' }
  }

  if (parseFloat(monthlyFee) < 0) {
    return { error: 'Sözleşme ücreti 0\'dan küçük olamaz.' }
  }

  const agencyId = await getAgencyIdFromCookie()
  if (!agencyId) {
    return { error: 'Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.' }
  }

  const supabase = getServiceClient()

  // Auth user oluştur
  const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { brand_name: brandName },
  })

  if (signUpError || !newUser.user) {
    const msg = signUpError?.message ?? 'Kullanıcı oluşturulamadı.'
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return { error: 'Bu e-posta adresi zaten kayıtlı.' }
    }
    return { error: msg }
  }

  // Brand kaydı oluştur
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .insert({
      agency_id: agencyId,
      name: brandName,
      monthly_fee: parseFloat(monthlyFee),
    })
    .select('id')
    .single()

  if (brandError || !brand) {
    await supabase.auth.admin.deleteUser(newUser.user.id)
    return { error: `Marka oluşturulamadı: ${brandError?.message ?? 'Bilinmeyen hata'}` }
  }

  // Profile oluştur
  const { error: profileError } = await supabase.from('profiles').insert({
    id: newUser.user.id,
    agency_id: agencyId,
    brand_id: brand.id,
    role: 'customer',
    first_name: brandName,
    last_name: '',
    is_active: true,
  })

  if (profileError) {
    await supabase.auth.admin.deleteUser(newUser.user.id)
    await supabase.from('brands').delete().eq('id', brand.id)
    return { error: `Profil oluşturulamadı: ${profileError.message}` }
  }

  return { success: `"${brandName}" başarıyla müşteri olarak eklendi.` }
}
