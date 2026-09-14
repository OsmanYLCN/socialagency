'use server'

import { revalidatePath } from 'next/cache'
import { getServiceClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getAgencyOwner } from '@/lib/auth'
import {
  getFormString,
  parseNonNegativeNumber,
  validateDate,
  validateEmail,
  validatePassword,
} from '@/lib/validation'
import { content_type, platform_type } from '@prisma/client'

function isPlatform(value: string): value is platform_type {
  return Object.values(platform_type).includes(value as platform_type)
}

function isContentType(value: string): value is content_type {
  return Object.values(content_type).includes(value as content_type)
}

// Marka ve müşteri kullanıcısı oluşturur
export async function createCustomerAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const brandName = getFormString(formData, 'brand_name')
  const contactEmail = getFormString(formData, 'contact_email')
  const password = getFormString(formData, 'password')
  const monthlyFeeStr = getFormString(formData, 'monthly_fee')

  if (!brandName) return { error: 'Marka adı zorunludur.' }
  if (brandName.length > 255) return { error: 'Marka adı çok uzun.' }
  const emailError = validateEmail(contactEmail)
  if (emailError) return { error: emailError }
  const passwordError = validatePassword(password)
  if (passwordError) return { error: passwordError }

  const agencyOwner = await getAgencyOwner()

  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const monthlyFee = parseNonNegativeNumber(monthlyFeeStr, 'Aylık ücret')
  if (typeof monthlyFee === 'string') return { error: monthlyFee }

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
      agency_id: agencyOwner.agencyId,
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
    agency_id: agencyOwner.agencyId,
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
  const firstName = getFormString(formData, 'first_name')
  const lastName = getFormString(formData, 'last_name')
  const email = getFormString(formData, 'email')
  const password = getFormString(formData, 'password')
  const salaryStr = getFormString(formData, 'salary')

  if (!firstName || !lastName) return { error: 'Ad ve soyad zorunludur.' }
  const emailError = validateEmail(email)
  if (emailError) return { error: emailError }
  const passwordError = validatePassword(password)
  if (passwordError) return { error: passwordError }

  const agencyOwner = await getAgencyOwner()

  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const salary = parseNonNegativeNumber(salaryStr, 'Maaş')
  if (typeof salary === 'string') return { error: salary }

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
    agency_id: agencyOwner.agencyId,
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
  const brandId = getFormString(formData, 'brand_id')
  const assigneeId = getFormString(formData, 'assignee_id') || null
  const platform = getFormString(formData, 'platform')
  const content = getFormString(formData, 'content')
  const dueDateStr = getFormString(formData, 'due_date')
  const note = getFormString(formData, 'note')

  if (!brandId || !platform || !content || !dueDateStr) {
    return { error: 'Marka, platform, içerik türü ve teslim tarihi zorunludur.' }
  }

  if (!isPlatform(platform) || !isContentType(content)) {
    return { error: 'Geçersiz platform veya içerik türü seçildi.' }
  }
  const dateError = validateDate(dueDateStr)
  if (dateError) return { error: dateError }

  const agencyOwner = await getAgencyOwner()

  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const dueDate = new Date(`${dueDateStr}T00:00:00.000Z`)

  const brand = await prisma.brands.findFirst({
    where: { id: brandId, agency_id: agencyOwner.agencyId },
    select: { id: true },
  })

  if (!brand) {
    return { error: 'Seçilen marka bu ajansa ait değil.' }
  }

  if (assigneeId) {
    const assignee = await prisma.profiles.findFirst({
      where: {
        id: assigneeId,
        agency_id: agencyOwner.agencyId,
        role: 'employee',
        is_active: true,
      },
      select: { id: true },
    })

    if (!assignee) {
      return { error: 'Seçilen çalışan bu ajansa ait aktif bir çalışan değil.' }
    }
  }

  try {
    await prisma.tasks.create({
      data: {
        agency_id: agencyOwner.agencyId,
        brand_id: brandId,
        assignee_id: assigneeId,
        platform,
        content,
        due_date: dueDate,
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
