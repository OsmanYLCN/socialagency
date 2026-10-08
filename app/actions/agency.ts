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
import { content_type, platform_type, task_status, notification_type } from '@prisma/client'

function isPlatform(value: string): value is platform_type {
  return Object.values(platform_type).includes(value as platform_type)
}

function isContentType(value: string): value is content_type {
  return Object.values(content_type).includes(value as content_type)
}

function isTaskStatus(value: string): value is task_status {
  return Object.values(task_status).includes(value as task_status)
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

  try {
    await prisma.$transaction(async (tx) => {
      const brand = await tx.brands.create({
        data: {
          agency_id: agencyOwner.agencyId!,
          name: brandName,
          monthly_fee: monthlyFee,
        }
      })

      await tx.profiles.create({
        data: {
          id: authUser.user.id,
          agency_id: agencyOwner.agencyId!,
          brand_id: brand.id,
          role: 'customer',
          first_name: firstName,
          last_name: lastName,
          is_active: true,
        }
      })
    })

    revalidatePath('/agency/customers')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    await serviceClient.auth.admin.deleteUser(authUser.user.id)
    const msg = err instanceof Error ? err.message : 'Kayıt işlemi tamamlanamadı'
    return { error: `Müşteri ve marka oluşturulamadı: ${msg}` }
  }
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
  const contentUrl = getFormString(formData, 'content_url')

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
    select: { id: true, name: true },
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
    const task = await prisma.tasks.create({
      data: {
        agency_id: agencyOwner.agencyId,
        brand_id: brandId,
        assignee_id: assigneeId,
        platform,
        content,
        due_date: dueDate,
        status: assigneeId ? 'assigned' : 'unassigned',
        assignment_note: note || null,
        content_url: contentUrl || null,
      },
    })

    if (assigneeId) {
      try {
        await prisma.notifications.create({
          data: {
            profile_id: assigneeId,
            task_id: task.id,
            type: notification_type.assignment,
            message: `${brand.name} markası için yeni bir ${content.toUpperCase()} (${platform}) görevi size atandı.`,
          },
        })
      } catch {
        // Bildirim hatası görev kaydını engellemez
      }
    }

    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Görev oluşturulurken hata oluştu.'
    return { error: msg }
  }
}

// Mevcut görevi günceller
export async function updateTaskAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const brandId = getFormString(formData, 'brand_id')
  const assigneeId = getFormString(formData, 'assignee_id') || null
  const platform = getFormString(formData, 'platform')
  const content = getFormString(formData, 'content')
  const dueDateStr = getFormString(formData, 'due_date')
  const note = getFormString(formData, 'note')
  const contentUrl = getFormString(formData, 'content_url')

  if (!taskId || !brandId || !platform || !content || !dueDateStr) {
    return { error: 'Görev kimliği, marka, platform, içerik türü ve teslim tarihi zorunludur.' }
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

  const existingTask = await prisma.tasks.findFirst({
    where: { id: taskId, agency_id: agencyOwner.agencyId },
    select: { id: true, brand_id: true, assignee_id: true, status: true },
  })

  if (!existingTask) {
    return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }
  }

  const brand = await prisma.brands.findFirst({
    where: { id: brandId, agency_id: agencyOwner.agencyId },
    select: { id: true, name: true },
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

  const dueDate = new Date(`${dueDateStr}T00:00:00.000Z`)

  let newStatus = existingTask.status
  if (!assigneeId && existingTask.status === 'assigned') {
    newStatus = 'unassigned'
  } else if (assigneeId && existingTask.status === 'unassigned') {
    newStatus = 'assigned'
  }

  try {
    await prisma.tasks.update({
      where: { id: taskId },
      data: {
        brand_id: brandId,
        assignee_id: assigneeId,
        platform,
        content,
        due_date: dueDate,
        status: newStatus,
        assignment_note: note || null,
        content_url: contentUrl || null,
        ...(brandId !== existingTask.brand_id ? { template_id: null } : {}),
      },
    })

    if (assigneeId && assigneeId !== existingTask.assignee_id) {
      try {
        await prisma.notifications.create({
          data: {
            profile_id: assigneeId,
            task_id: taskId,
            type: notification_type.assignment,
            message: `${brand.name} markası için görev size devredildi / atandı.`,
          },
        })
      } catch {
      }
    }

    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Görev güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// Görevin çalışan atamasını hızlıca değiştirir veya iş havuzuna iade eder
export async function assignTaskAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const assigneeId = getFormString(formData, 'assignee_id') || null

  if (!taskId) return { error: 'Görev kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: { id: taskId, agency_id: agencyOwner.agencyId },
    include: { brands: { select: { name: true } } },
  })

  if (!task) return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }

  if (assigneeId) {
    const assignee = await prisma.profiles.findFirst({
      where: {
        id: assigneeId,
        agency_id: agencyOwner.agencyId,
        role: 'employee',
        is_active: true,
      },
      select: { id: true, first_name: true, last_name: true },
    })

    if (!assignee) {
      return { error: 'Seçilen çalışan bu ajansa ait aktif bir çalışan değil.' }
    }

    const newStatus = task.status === 'unassigned' ? 'assigned' : task.status

    try {
      await prisma.tasks.update({
        where: { id: taskId },
        data: { assignee_id: assigneeId, status: newStatus },
      })

      if (assigneeId !== task.assignee_id) {
        try {
          await prisma.notifications.create({
            data: {
              profile_id: assigneeId,
              task_id: taskId,
              type: notification_type.assignment,
              message: `${task.brands.name} markası için görev size atandı.`,
            },
          })
        } catch {
        }
      }

      revalidatePath('/agency/tasks')
      revalidatePath('/agency')
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Atama yapılırken hata oluştu.'
      return { error: msg }
    }
  } else {
    // İş havuzuna iade et
    try {
      await prisma.tasks.update({
        where: { id: taskId },
        data: {
          assignee_id: null,
          status: task.status === 'assigned' ? 'unassigned' : task.status,
        },
      })

      revalidatePath('/agency/tasks')
      revalidatePath('/agency')
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Görev havuza alınırken hata oluştu.'
      return { error: msg }
    }
  }
}

// Görevin durumunu günceller (Kanban sütun geçişleri için)
export async function updateTaskStatusAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const status = getFormString(formData, 'status')

  if (!taskId || !status) return { error: 'Görev kimliği ve durum zorunludur.' }
  if (!isTaskStatus(status)) return { error: 'Geçersiz görev durumu.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: { id: taskId, agency_id: agencyOwner.agencyId },
    select: { id: true, assignee_id: true, status: true },
  })

  if (!task) return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }

  try {
    const updateData: { status: task_status; assignee_id?: string | null } = {
      status,
    }

    if (status === 'unassigned') {
      updateData.assignee_id = null
    }

    await prisma.tasks.update({
      where: { id: taskId },
      data: updateData,
    })

    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Durum güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// Görevin içerik/medya bağlantısını günceller
export async function updateTaskContentUrlAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const contentUrl = getFormString(formData, 'content_url')
  const sendToApproval = getFormString(formData, 'send_to_approval') === 'true'

  if (!taskId) return { error: 'Görev kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: { id: taskId, agency_id: agencyOwner.agencyId },
    select: { id: true, status: true },
  })

  if (!task) return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }

  try {
    await prisma.tasks.update({
      where: { id: taskId },
      data: {
        content_url: contentUrl || null,
        status: sendToApproval ? 'pending_approval' : task.status,
      },
    })

    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'İçerik linki güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// Göreve revizyon talebi ekler
export async function requestTaskRevisionAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const note = getFormString(formData, 'note')

  if (!taskId || !note) {
    return { error: 'Görev kimliği ve revizyon notu zorunludur.' }
  }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: { id: taskId, agency_id: agencyOwner.agencyId },
    include: { brands: { select: { name: true } } },
  })

  if (!task) return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }

  try {
    await prisma.task_revisions.create({
      data: {
        task_id: taskId,
        previous_url: task.content_url || '',
        customer_note: note,
      },
    })

    await prisma.tasks.update({
      where: { id: taskId },
      data: { status: 'revision_requested' },
    })

    if (task.assignee_id) {
      try {
        await prisma.notifications.create({
          data: {
            profile_id: task.assignee_id,
            task_id: taskId,
            type: notification_type.revision,
            message: `${task.brands.name} görevi için revizyon talep edildi: "${note.slice(0, 80)}"`,
          },
        })
      } catch {
      }
    }

    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Revizyon talebi eklenirken hata oluştu.'
    return { error: msg }
  }
}

// Göreve ajans içi yorum ekler
export async function addTaskCommentAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const commentText = getFormString(formData, 'comment_text')

  if (!taskId || !commentText.trim()) {
    return { error: 'Yorum metni boş bırakılamaz.' }
  }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: { id: taskId, agency_id: agencyOwner.agencyId },
    select: { id: true, assignee_id: true },
  })

  if (!task) return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }

  try {
    await prisma.task_comments.create({
      data: {
        task_id: taskId,
        profile_id: agencyOwner.id,
        comment_text: commentText.trim(),
      },
    })

    if (task.assignee_id && task.assignee_id !== agencyOwner.id) {
      try {
        await prisma.notifications.create({
          data: {
            profile_id: task.assignee_id,
            task_id: taskId,
            type: notification_type.comment,
            message: `Görevinize yeni bir ajans içi yorum eklendi.`,
          },
        })
      } catch {
      }
    }

    revalidatePath('/agency/tasks')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Yorum eklenirken hata oluştu.'
    return { error: msg }
  }
}

// Görevi ve bağlı kayıtları güvenle siler
export async function deleteTaskAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')

  if (!taskId) return { error: 'Görev kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: { id: taskId, agency_id: agencyOwner.agencyId },
    select: { id: true },
  })

  if (!task) return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }

  try {
    await prisma.tasks.delete({ where: { id: taskId } })

    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Görev silinirken hata oluştu.'
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

  // Bu markaya ve bu ajansa ait müşteri profilini doğrula (IDOR koruması)
  const targetCustomerProfile = await prisma.profiles.findFirst({
    where: {
      brand_id: brandId,
      agency_id: agencyOwner.agencyId,
      role: 'customer',
      ...(authUserId ? { id: authUserId } : {}),
    },
    select: { id: true },
  })

  try {
    await prisma.$transaction(async (tx) => {
      if (targetCustomerProfile?.id) {
        await tx.profiles.deleteMany({ where: { id: targetCustomerProfile.id } })
      }

      await tx.tasks.updateMany({
        where: { brand_id: brandId },
        data: { template_id: null },
      })
      await tx.tasks.deleteMany({
        where: { brand_id: brandId },
      })

      await tx.profiles.updateMany({
        where: { brand_id: brandId },
        data: { brand_id: null },
      })

      await tx.brands.delete({ where: { id: brandId } })
    })

    if (targetCustomerProfile?.id) {
      await serviceClient.auth.admin.deleteUser(targetCustomerProfile.id)
    }

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
    await prisma.$transaction(async (tx) => {
      await tx.tasks.updateMany({
        where: { assignee_id: employeeId },
        data: { assignee_id: null, status: 'unassigned' },
      })
      await tx.profiles.deleteMany({ where: { id: employeeId } })
    })

    await serviceClient.auth.admin.deleteUser(employeeId)

    revalidatePath('/agency/employees')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Çalışan silinirken hata oluştu.'
    return { error: msg }
  }
}

// Yeni içerik şablonu oluşturur
export async function createContentTemplateAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const brandId = getFormString(formData, 'brand_id')
  const dayOfWeekStr = getFormString(formData, 'day_of_week')
  const platform = getFormString(formData, 'platform')
  const content = getFormString(formData, 'content')
  const quantityStr = getFormString(formData, 'quantity')
  const defaultDescription = getFormString(formData, 'default_description')

  if (!brandId) return { error: 'Lütfen bir marka seçin.' }

  const dayOfWeek = parseInt(dayOfWeekStr, 10)
  if (isNaN(dayOfWeek) || dayOfWeek < 1 || dayOfWeek > 7) {
    return { error: 'Geçerli bir gün seçilmelidir (Pazartesi - Pazar).' }
  }

  if (!isPlatform(platform)) {
    return { error: 'Geçersiz sosyal medya platformu.' }
  }

  if (!isContentType(content)) {
    return { error: 'Geçersiz içerik formatı.' }
  }

  const quantity = quantityStr ? parseInt(quantityStr, 10) : 1
  if (isNaN(quantity) || quantity < 1 || quantity > 20) {
    return { error: 'İçerik adedi 1 ile 20 arasında olmalıdır.' }
  }

  if (defaultDescription.length > 500) {
    return { error: 'Varsayılan açıklama en fazla 500 karakter olabilir.' }
  }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const brand = await prisma.brands.findFirst({
    where: { id: brandId, agency_id: agencyOwner.agencyId },
    select: { id: true },
  })

  if (!brand) {
    return { error: 'Seçilen marka bu ajansa ait değil veya bulunamadı.' }
  }

  try {
    await prisma.content_templates.create({
      data: {
        brand_id: brandId,
        day_of_week: dayOfWeek,
        platform,
        content,
        quantity,
        default_description: defaultDescription || null,
        is_active: true,
      },
    })

    revalidatePath('/agency/content')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'İçerik şablonu oluşturulurken hata oluştu.'
    return { error: msg }
  }
}

// İçerik şablonunu günceller
export async function updateContentTemplateAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const templateId = getFormString(formData, 'template_id')
  const brandId = getFormString(formData, 'brand_id')
  const dayOfWeekStr = getFormString(formData, 'day_of_week')
  const platform = getFormString(formData, 'platform')
  const content = getFormString(formData, 'content')
  const quantityStr = getFormString(formData, 'quantity')
  const defaultDescription = getFormString(formData, 'default_description')

  if (!templateId) return { error: 'Şablon kimliği gereklidir.' }
  if (!brandId) return { error: 'Lütfen bir marka seçin.' }

  const dayOfWeek = parseInt(dayOfWeekStr, 10)
  if (isNaN(dayOfWeek) || dayOfWeek < 1 || dayOfWeek > 7) {
    return { error: 'Geçerli bir gün seçilmelidir (Pazartesi - Pazar).' }
  }

  if (!isPlatform(platform)) {
    return { error: 'Geçersiz sosyal medya platformu.' }
  }

  if (!isContentType(content)) {
    return { error: 'Geçersiz içerik formatı.' }
  }

  const quantity = quantityStr ? parseInt(quantityStr, 10) : 1
  if (isNaN(quantity) || quantity < 1 || quantity > 20) {
    return { error: 'İçerik adedi 1 ile 20 arasında olmalıdır.' }
  }

  if (defaultDescription.length > 500) {
    return { error: 'Varsayılan açıklama en fazla 500 karakter olabilir.' }
  }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const existing = await prisma.content_templates.findFirst({
    where: {
      id: templateId,
      brands: { agency_id: agencyOwner.agencyId },
    },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Şablon bulunamadı veya bu ajansa ait değil.' }
  }

  const targetBrand = await prisma.brands.findFirst({
    where: { id: brandId, agency_id: agencyOwner.agencyId },
    select: { id: true },
  })

  if (!targetBrand) {
    return { error: 'Hedef marka bu ajansa ait değil veya bulunamadı.' }
  }

  try {
    await prisma.content_templates.update({
      where: { id: templateId },
      data: {
        brand_id: brandId,
        day_of_week: dayOfWeek,
        platform,
        content,
        quantity,
        default_description: defaultDescription || null,
      },
    })

    revalidatePath('/agency/content')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Şablon güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// İçerik şablonunun aktiflik durumunu değiştirir
export async function toggleContentTemplateStatusAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const templateId = getFormString(formData, 'template_id')
  if (!templateId) return { error: 'Şablon kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const existing = await prisma.content_templates.findFirst({
    where: {
      id: templateId,
      brands: { agency_id: agencyOwner.agencyId },
    },
    select: { id: true, is_active: true },
  })

  if (!existing) {
    return { error: 'Şablon bulunamadı veya bu ajansa ait değil.' }
  }

  try {
    await prisma.content_templates.update({
      where: { id: templateId },
      data: { is_active: !existing.is_active },
    })

    revalidatePath('/agency/content')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Şablon durumu güncellenirken hata oluştu.'
    return { error: msg }
  }
}

// İçerik şablonunu siler; bağlı görevlerin template_id referansını güvenle temizler
export async function deleteContentTemplateAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const templateId = getFormString(formData, 'template_id')
  if (!templateId) return { error: 'Şablon kimliği gereklidir.' }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  const existing = await prisma.content_templates.findFirst({
    where: {
      id: templateId,
      brands: { agency_id: agencyOwner.agencyId },
    },
    select: { id: true },
  })

  if (!existing) {
    return { error: 'Şablon bulunamadı veya bu ajansa ait değil.' }
  }

  try {
    // Bağlı görevlerin template_id ilişkisini null yap, görevleri koru
    await prisma.tasks.updateMany({
      where: { template_id: templateId },
      data: { template_id: null },
    })

    await prisma.content_templates.delete({
      where: { id: templateId },
    })

    revalidatePath('/agency/content')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Şablon silinirken hata oluştu.'
    return { error: msg }
  }
}

// Aktif içerik şablonlarından seçilen hafta için otomatik görevler üretir
export async function generateTasksFromTemplatesAction(
  prevState: { success?: boolean; error?: string; count?: number; skipped?: number } | null,
  formData: FormData
) {
  const weekStartDate = getFormString(formData, 'week_start_date')
  const brandId = getFormString(formData, 'brand_id')

  const dateError = validateDate(weekStartDate)
  if (dateError) {
    return { error: 'Geçerli bir hafta başlangıç tarihi (YYYY-AA-GG) seçilmelidir.' }
  }

  const agencyOwner = await getAgencyOwner()
  if (!agencyOwner?.agencyId) {
    return { error: 'Bu işlem için yetkili ajans oturumu gereklidir.' }
  }

  // Seçilen tarihi Pazartesi gününe hizala
  const [y, m, d] = weekStartDate.split('-').map(Number)
  const monday = new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
  const dayOfWeekIndex = monday.getUTCDay() // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
  const diffToMonday = dayOfWeekIndex === 0 ? -6 : 1 - dayOfWeekIndex
  monday.setUTCDate(monday.getUTCDate() + diffToMonday)

  // Aktif şablonları çek
  const templates = await prisma.content_templates.findMany({
    where: {
      brands: { agency_id: agencyOwner.agencyId },
      is_active: true,
      ...(brandId && brandId !== 'all' ? { brand_id: brandId } : {}),
    },
    include: {
      brands: { select: { id: true, name: true } },
    },
  })

  if (templates.length === 0) {
    return { error: 'Seçili kriterlere uygun aktif bir içerik şablonu bulunamadı.' }
  }

  let generatedCount = 0
  let skippedCount = 0

  try {
    const sunday = new Date(monday.getTime())
    sunday.setUTCDate(monday.getUTCDate() + 6)

    const templateIds = templates.map((t) => t.id)

    // 1. Haftanın mevcut görevlerini tek seferde çek (N+1 sorgusunu önler)
    const existingTasks = await prisma.tasks.findMany({
      where: {
        agency_id: agencyOwner.agencyId,
        template_id: { in: templateIds },
        due_date: {
          gte: monday,
          lte: sunday,
        },
        is_active: true,
      },
      select: {
        template_id: true,
        due_date: true,
      },
    })

    const existingKeys = new Set(
      existingTasks.map(
        (t) => `${t.template_id}_${t.due_date.toISOString().slice(0, 10)}`
      )
    )

    const allTasksToCreate: {
      agency_id: string
      brand_id: string
      template_id: string
      platform: platform_type
      content: content_type
      due_date: Date
      status: task_status
      assignment_note: string
      is_active: boolean
    }[] = []

    const processedTemplateIds: string[] = []

    for (const template of templates) {
      const offsetDays = template.day_of_week - 1
      const targetDueDate = new Date(monday.getTime())
      targetDueDate.setUTCDate(monday.getUTCDate() + offsetDays)
      const dateKey = `${template.id}_${targetDueDate.toISOString().slice(0, 10)}`

      const qty = template.quantity && template.quantity > 0 ? template.quantity : 1

      if (existingKeys.has(dateKey)) {
        skippedCount += qty
        continue
      }

      for (let i = 0; i < qty; i++) {
        allTasksToCreate.push({
          agency_id: agencyOwner.agencyId,
          brand_id: template.brand_id,
          template_id: template.id,
          platform: template.platform,
          content: template.content,
          due_date: targetDueDate,
          status: task_status.unassigned,
          assignment_note:
            template.default_description ||
            `${template.brands.name} - ${template.platform.toUpperCase()} ${template.content.toUpperCase()} Şablon İşi`,
          is_active: true,
        })
      }

      processedTemplateIds.push(template.id)
      generatedCount += qty
    }

    // 2. Yeni görevleri tek seferde topluca oluştur
    if (allTasksToCreate.length > 0) {
      await prisma.tasks.createMany({
        data: allTasksToCreate,
      })
    }

    // 3. Şablonların son üretilme tarihlerini tek seferde güncelle
    if (processedTemplateIds.length > 0) {
      await prisma.content_templates.updateMany({
        where: { id: { in: processedTemplateIds } },
        data: { last_generated_at: new Date() },
      })
    }

    revalidatePath('/agency/content')
    revalidatePath('/agency/tasks')
    revalidatePath('/agency')

    return {
      success: true,
      count: generatedCount,
      skipped: skippedCount,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Görevler üretilirken hata oluştu.'
    return { error: msg }
  }
}

