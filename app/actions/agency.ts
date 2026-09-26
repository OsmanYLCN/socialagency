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
  const authorizedName = getFormString(formData, 'authorized_name')
  const phone = getFormString(formData, 'phone')
  const sector = getFormString(formData, 'sector')
  const website = getFormString(formData, 'website')
  const instagram = getFormString(formData, 'instagram')
  const city = getFormString(formData, 'city')
  const billingTitle = getFormString(formData, 'billing_title')
  const taxId = getFormString(formData, 'tax_id')
  const taxOffice = getFormString(formData, 'tax_office')
  const notes = getFormString(formData, 'notes')

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

  const nameParts = authorizedName.trim().split(/\s+/).filter(Boolean)
  const firstName = nameParts[0] || brandName
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : authorizedName ? '' : '(Müşteri)'

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
    user_metadata: {
      brand_name: brandName,
      role: 'customer',
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      sector: sector || null,
      website: website || null,
      instagram: instagram || null,
      city: city || null,
      billing_title: billingTitle || null,
      tax_id: taxId || null,
      tax_office: taxOffice || null,
      notes: notes || null,
    },
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
    first_name: firstName,
    last_name: lastName,
    is_active: true,
  })

  if (profileError) {
    await serviceClient.auth.admin.deleteUser(authUser.user.id)
    await serviceClient.from('brands').delete().eq('id', brand.id)
    return { error: `Müşteri profili oluşturulamadı: ${profileError.message}` }
  }

  revalidatePath('/agency/customers')
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
  const phone = getFormString(formData, 'phone')
  const department = getFormString(formData, 'department')
  const title = getFormString(formData, 'title')
  const workType = getFormString(formData, 'work_type')
  const startDate = getFormString(formData, 'start_date')
  const city = getFormString(formData, 'city')
  const iban = getFormString(formData, 'iban')
  const emergencyContact = getFormString(formData, 'emergency_contact')
  const notes = getFormString(formData, 'notes')

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
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      role: 'employee',
      phone: phone || null,
      department: department || null,
      title: title || null,
      work_type: workType || null,
      start_date: startDate || null,
      city: city || null,
      iban: iban || null,
      emergency_contact: emergencyContact || null,
      notes: notes || null,
    },
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

  revalidatePath('/agency/employees')
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

// Müşteri markasının adını ve aylık ücretini günceller
export async function updateCustomerAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const brandId = getFormString(formData, 'brand_id')
  const brandName = getFormString(formData, 'brand_name')
  const monthlyFeeStr = getFormString(formData, 'monthly_fee')
  const authorizedName = getFormString(formData, 'authorized_name')

  if (!brandId) return { error: 'Marka kimliği gereklidir.' }
  if (!brandName) return { error: 'Marka adı zorunludur.' }
  if (brandName.length > 255) return { error: 'Marka adı çok uzun.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const monthlyFee = parseNonNegativeNumber(monthlyFeeStr, 'Aylık ücret')
  if (typeof monthlyFee === 'string') return { error: monthlyFee }

  const existing = await prisma.brands.findFirst({
    where: { id: brandId, agency_id: agencyOwner.agencyId },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Marka bulunamadı veya bu ajansa ait değil.' }
  }

  try {
    await prisma.brands.update({
      where: { id: brandId },
      data: { name: brandName, monthly_fee: monthlyFee },
    })

    if (authorizedName !== undefined) {
      const nameParts = authorizedName.trim().split(/\s+/).filter(Boolean)
      const firstName = nameParts[0] || (authorizedName.trim() ? authorizedName.trim() : brandName)
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (authorizedName.trim() ? '' : '(Müşteri)')

      await prisma.profiles.updateMany({
        where: { brand_id: brandId, role: 'customer' },
        data: { first_name: firstName, last_name: lastName },
      })

      try {
        const serviceClient = getServiceClient()
        const customerProfile = await prisma.profiles.findFirst({
          where: { brand_id: brandId, role: 'customer' },
          select: { id: true },
        })
        if (customerProfile) {
          await serviceClient.auth.admin.updateUserById(customerProfile.id, {
            user_metadata: { first_name: firstName, last_name: lastName, brand_name: brandName },
          })
        }
      } catch {
        // Supabase kullanıcı güncellemesi başarısız olsa bile Prisma güncellemesi yeterlidir
      }
    }

    revalidatePath('/agency/customers')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Marka güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// Müşteri hesabını ve markasını kalıcı olarak siler
export async function deleteCustomerAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const brandId = getFormString(formData, 'brand_id')
  const authUserId = getFormString(formData, 'auth_user_id')

  if (!brandId) return { error: 'Marka kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const existing = await prisma.brands.findFirst({
    where: { id: brandId, agency_id: agencyOwner.agencyId },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Marka bulunamadı veya bu ajansa ait değil.' }
  }

  let serviceClient
  try {
    serviceClient = getServiceClient()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: msg }
  }

  try {
    if (authUserId) {
      await serviceClient.auth.admin.deleteUser(authUserId)
      await prisma.profiles.deleteMany({ where: { id: authUserId } })
    }

    // İlişkili profillerin brand_id bağlantısını çöz (foreign key kısıt ihlalini önler)
    await prisma.profiles.updateMany({
      where: { brand_id: brandId },
      data: { brand_id: null },
    })

    await prisma.brands.delete({ where: { id: brandId } })

    revalidatePath('/agency/customers')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Müşteri silinirken hata oluştu.'
    return { error: msg }
  }
}

// Müşteri profilinin aktiflik durumunu değiştirir
export async function toggleCustomerStatusAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const profileId = getFormString(formData, 'profile_id')
  const isActive = getFormString(formData, 'is_active') === 'true'

  if (!profileId) return { error: 'Profil kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const profile = await prisma.profiles.findFirst({
    where: { id: profileId, agency_id: agencyOwner.agencyId, role: 'customer' },
    select: { id: true },
  })

  if (!profile) {
    return { error: 'Müşteri profili bulunamadı veya bu ajansa ait değil.' }
  }

  try {
    await prisma.profiles.update({
      where: { id: profileId },
      data: { is_active: isActive },
    })

    revalidatePath('/agency/customers')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Durum güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// Çalışanın ad, soyad ve maaş bilgilerini günceller
export async function updateEmployeeAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const employeeId = getFormString(formData, 'employee_id')
  const firstName = getFormString(formData, 'first_name')
  const lastName = getFormString(formData, 'last_name')
  const salaryStr = getFormString(formData, 'salary')

  if (!employeeId) return { error: 'Çalışan kimliği gereklidir.' }
  if (!firstName || !lastName) return { error: 'Ad ve soyad zorunludur.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const salary = parseNonNegativeNumber(salaryStr, 'Maaş')
  if (typeof salary === 'string') return { error: salary }

  const existing = await prisma.profiles.findFirst({
    where: { id: employeeId, agency_id: agencyOwner.agencyId, role: 'employee' },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Çalışan bulunamadı veya bu ajansa ait değil.' }
  }

  try {
    await prisma.profiles.update({
      where: { id: employeeId },
      data: { first_name: firstName, last_name: lastName, salary },
    })

    try {
      const serviceClient = getServiceClient()
      await serviceClient.auth.admin.updateUserById(employeeId, {
        user_metadata: { first_name: firstName, last_name: lastName },
      })
    } catch {
      // Supabase metadata güncelleme başarısız olsa bile Prisma güncellemesi yeterlidir
    }

    revalidatePath('/agency/employees')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Çalışan güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// Çalışanın aktiflik durumunu değiştirir
export async function toggleEmployeeStatusAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const employeeId = getFormString(formData, 'employee_id')
  const isActive = getFormString(formData, 'is_active') === 'true'

  if (!employeeId) return { error: 'Çalışan kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const existing = await prisma.profiles.findFirst({
    where: { id: employeeId, agency_id: agencyOwner.agencyId, role: 'employee' },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Çalışan bulunamadı veya bu ajansa ait değil.' }
  }

  try {
    await prisma.profiles.update({
      where: { id: employeeId },
      data: { is_active: isActive },
    })

    revalidatePath('/agency/employees')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Durum güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// Çalışanın şifresini ajans sahibi tarafından sıfırlar
export async function resetEmployeePasswordAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const employeeId = getFormString(formData, 'employee_id')
  const newPassword = getFormString(formData, 'new_password')

  if (!employeeId) return { error: 'Çalışan kimliği gereklidir.' }
  const passwordError = validatePassword(newPassword, 'Yeni şifre')
  if (passwordError) return { error: passwordError }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const existing = await prisma.profiles.findFirst({
    where: { id: employeeId, agency_id: agencyOwner.agencyId, role: 'employee' },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Çalışan bulunamadı veya bu ajansa ait değil.' }
  }

  let serviceClient
  try {
    serviceClient = getServiceClient()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: msg }
  }

  try {
    const { error: resetError } = await serviceClient.auth.admin.updateUserById(employeeId, {
      password: newPassword,
    })

    if (resetError) {
      return { error: `Şifre sıfırlanamadı: ${resetError.message}` }
    }

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Şifre sıfırlanırken hata oluştu.'
    return { error: msg }
  }
}

// Çalışanı ve hesabını siler; üzerindeki görevleri güvenli şekilde iş havuzuna iade eder
export async function deleteEmployeeAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const employeeId = getFormString(formData, 'employee_id')

  if (!employeeId) return { error: 'Çalışan kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const existing = await prisma.profiles.findFirst({
    where: { id: employeeId, agency_id: agencyOwner.agencyId, role: 'employee' },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Çalışan bulunamadı veya bu ajansa ait değil.' }
  }

  let serviceClient
  try {
    serviceClient = getServiceClient()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Supabase bağlantı hatası.'
    return { error: msg }
  }

  try {
    // 1. Çalışana atanmış tüm görevleri iş havuzuna iade et (veri kaybını önler)
    await prisma.tasks.updateMany({
      where: { assignee_id: employeeId },
      data: { assignee_id: null, status: 'unassigned' },
    })

    // 2. Supabase Auth kullanıcı hesabını sil
    await serviceClient.auth.admin.deleteUser(employeeId)

    // 3. Profil kaydını sil (tasks.updateMany sonrası foreign key uyumludur; cascade yapılmışsa hata vermez)
    await prisma.profiles.deleteMany({ where: { id: employeeId } })

    revalidatePath('/agency/employees')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Çalışan silinirken hata oluştu.'
    return { error: msg }
  }
}
