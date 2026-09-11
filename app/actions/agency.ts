'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getServiceClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// Marka ve müşteri kullanıcısı oluşturur
export async function createCustomerAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const brandName = (formData.get('brand_name') as string)?.trim()
  const contactEmail = (formData.get('contact_email') as string)?.trim()
  const password = formData.get('password') as string
  const monthlyFeeStr = (formData.get('monthly_fee') as string)?.trim()

  if (!brandName || !contactEmail || !password) {
    return { error: 'Marka adı, e-posta ve şifre zorunludur.' }
  }

  if (password.length < 6) {
    return { error: 'Şifre en az 6 karakter olmalıdır.' }
  }

  const cookieStore = await cookies()
  const agencyId = cookieStore.get('agency-id')?.value

  if (!agencyId) {
    return { error: 'Ajans oturumu bulunamadı. Lütfen tekrar giriş yapın.' }
  }

  const monthlyFee = monthlyFeeStr ? parseFloat(monthlyFeeStr) : 0

  let serviceClient
  try {
    serviceClient = getServiceClient()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: msg }
  }

  const { data: authUser, error: authError } = await serviceClient.auth.admin.createUser({
    email: contactEmail,
    password,
    email_confirm: true,
    user_metadata: { brand_name: brandName, role: 'customer' },
  })

  if (authError || !authUser.user) {
    const msg = authError?.message ?? 'Kullanıcı hesabı oluşturulamadı.'
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return { error: 'Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var.' }
    }
    return { error: msg }
  }

  const { data: brand, error: brandError } = await serviceClient
    .from('brands')
    .insert({
      agency_id: agencyId,
      name: brandName,
      monthly_fee: monthlyFee,
    })
    .select('id')
    .single()

  if (brandError || !brand) {
    await serviceClient.auth.admin.deleteUser(authUser.user.id)
    return { error: `Marka kaydedilemedi: ${brandError?.message ?? 'Bilinmeyen hata'}` }
  }

  const { error: profileError } = await serviceClient.from('profiles').insert({
    id: authUser.user.id,
    agency_id: agencyId,
    brand_id: brand.id,
    role: 'customer',
    first_name: brandName,
    last_name: '(Müşteri)',
    is_active: true,
  })

  if (profileError) {
    await serviceClient.auth.admin.deleteUser(authUser.user.id)
    await serviceClient.from('brands').delete().eq('id', brand.id)
    return { error: `Müşteri profili oluşturulamadı: ${profileError.message}` }
  }

  revalidatePath('/agency')
  return { success: true }
}

// Yeni ajans çalışanı oluşturur
export async function createEmployeeAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const firstName = (formData.get('first_name') as string)?.trim()
  const lastName = (formData.get('last_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const salaryStr = (formData.get('salary') as string)?.trim()

  if (!firstName || !lastName || !email || !password) {
    return { error: 'Ad, soyad, e-posta ve şifre zorunludur.' }
  }

  if (password.length < 6) {
    return { error: 'Şifre en az 6 karakter olmalıdır.' }
  }

  const cookieStore = await cookies()
  const agencyId = cookieStore.get('agency-id')?.value

  if (!agencyId) {
    return { error: 'Ajans oturumu bulunamadı. Lütfen tekrar giriş yapın.' }
  }

  const salary = salaryStr ? parseFloat(salaryStr) : 0

  let serviceClient
  try {
    serviceClient = getServiceClient()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: msg }
  }

  const { data: authUser, error: authError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName, role: 'employee' },
  })

  if (authError || !authUser.user) {
    const msg = authError?.message ?? 'Çalışan hesabı oluşturulamadı.'
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return { error: 'Bu e-posta adresi zaten kullanımda.' }
    }
    return { error: msg }
  }

  const { error: profileError } = await serviceClient.from('profiles').insert({
    id: authUser.user.id,
    agency_id: agencyId,
    role: 'employee',
    first_name: firstName,
    last_name: lastName,
    salary,
    is_active: true,
  })

  if (profileError) {
    await serviceClient.auth.admin.deleteUser(authUser.user.id)
    return { error: `Çalışan profili oluşturulamadı: ${profileError.message}` }
  }

  revalidatePath('/agency')
  return { success: true }
}

// Ajans için yeni görev oluşturur
export async function createTaskAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const brandId = (formData.get('brand_id') as string)?.trim()
  const assigneeId = (formData.get('assignee_id') as string)?.trim() || null
  const platform = (formData.get('platform') as string)?.trim() as any
  const content = (formData.get('content') as string)?.trim() as any
  const dueDateStr = (formData.get('due_date') as string)?.trim()
  const note = (formData.get('note') as string)?.trim()

  if (!brandId || !platform || !content || !dueDateStr) {
    return { error: 'Marka, platform, içerik türü ve teslim tarihi zorunludur.' }
  }

  const cookieStore = await cookies()
  const agencyId = cookieStore.get('agency-id')?.value

  if (!agencyId) {
    return { error: 'Ajans oturumu bulunamadı.' }
  }

  try {
    await prisma.tasks.create({
      data: {
        agency_id: agencyId,
        brand_id: brandId,
        assignee_id: assigneeId,
        platform,
        content,
        due_date: new Date(dueDateStr),
        status: assigneeId ? 'assigned' : 'unassigned',
        assignment_note: note || null,
      },
    })

    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Görev oluşturulurken hata oluştu.'
    return { error: msg }
  }
}
