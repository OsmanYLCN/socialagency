'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getEmployee } from '@/lib/auth'
import { getFormString } from '@/lib/validation'
import { task_status, notification_type } from '@prisma/client'

// Görevi açık iş havuzundan çalışanın üzerine alır
export async function claimTaskAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')

  if (!taskId) {
    return { error: 'Görev kimliği zorunludur.' }
  }

  const employee = await getEmployee()
  if (!employee?.agencyId) {
    return { error: 'Bu işlem için yetkili çalışan oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: {
      id: taskId,
      agency_id: employee.agencyId,
      is_active: true,
    },
    include: {
      brands: { select: { name: true } },
    },
  })

  if (!task) {
    return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }
  }

  if (task.assignee_id && task.assignee_id !== employee.id) {
    return { error: 'Bu görev zaten başka bir çalışana atanmış.' }
  }

  try {
    await prisma.tasks.update({
      where: { id: taskId },
      data: {
        assignee_id: employee.id,
        status: task_status.assigned,
      },
    })

    // Ajans sahibine bildirim gönder
    const agencyOwner = await prisma.profiles.findFirst({
      where: {
        agency_id: employee.agencyId,
        role: 'agency_owner',
        is_active: true,
      },
      select: { id: true },
    })

    if (agencyOwner) {
      const employeeName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Bir çalışan'
      try {
        await prisma.notifications.create({
          data: {
            profile_id: agencyOwner.id,
            task_id: taskId,
            type: notification_type.assignment,
            message: `${employeeName}, ${task.brands.name} markasına ait görevi iş havuzundan üzerine aldı.`,
          },
        })
      } catch {
        // Bildirim hatası ana işlemi engellemez
      }
    }

    revalidatePath('/employee')
    revalidatePath('/employee/tasks')
    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Görev üstlenilirken hata oluştu.'
    return { error: msg }
  }
}

// Görevi iş havuzuna geri iade eder
export async function releaseTaskAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')

  if (!taskId) {
    return { error: 'Görev kimliği zorunludur.' }
  }

  const employee = await getEmployee()
  if (!employee?.agencyId) {
    return { error: 'Bu işlem için yetkili çalışan oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: {
      id: taskId,
      assignee_id: employee.id,
      agency_id: employee.agencyId,
      is_active: true,
    },
    include: {
      brands: { select: { name: true } },
    },
  })

  if (!task) {
    return { error: 'Görev bulunamadı veya size ait değil.' }
  }

  try {
    await prisma.tasks.update({
      where: { id: taskId },
      data: {
        assignee_id: null,
        status: task_status.unassigned,
      },
    })

    // Ajans sahibine bildirim gönder
    const agencyOwner = await prisma.profiles.findFirst({
      where: {
        agency_id: employee.agencyId,
        role: 'agency_owner',
        is_active: true,
      },
      select: { id: true },
    })

    if (agencyOwner) {
      const employeeName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Bir çalışan'
      try {
        await prisma.notifications.create({
          data: {
            profile_id: agencyOwner.id,
            task_id: taskId,
            type: notification_type.system,
            message: `${employeeName}, ${task.brands.name} markasına ait görevi iş havuzuna geri bıraktı.`,
          },
        })
      } catch {
        // Bildirim hatası ana işlemi engellemez
      }
    }

    revalidatePath('/employee')
    revalidatePath('/employee/tasks')
    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Görev havuza bırakılırken hata oluştu.'
    return { error: msg }
  }
}

// Çalışanın görev içeriğini/linkini güncellemesi ve onaya göndermesi
export async function updateEmployeeTaskContentUrlAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const contentUrl = getFormString(formData, 'content_url')
  const sendToApproval = getFormString(formData, 'send_to_approval') === 'true'

  if (!taskId) return { error: 'Görev kimliği gereklidir.' }

  const employee = await getEmployee()
  if (!employee?.agencyId) {
    return { error: 'Bu işlem için yetkili çalışan oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: {
      id: taskId,
      assignee_id: employee.id,
      agency_id: employee.agencyId,
      is_active: true,
    },
    include: {
      brands: { select: { name: true } },
    },
  })

  if (!task) return { error: 'Görev bulunamadı veya üzerinize atanmış değil.' }

  if (contentUrl) {
    if (contentUrl.length > 2048) {
      return { error: 'İçerik bağlantısı çok uzun (maksimum 2048 karakter).' }
    }
    try {
      const parsedUrl = new URL(contentUrl)
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return { error: 'İçerik bağlantısı geçerli bir HTTP veya HTTPS adresi olmalıdır.' }
      }
    } catch {
      return { error: 'Geçersiz URL formatı.' }
    }
  }

  if (sendToApproval && !contentUrl) {
    return { error: 'Görevi onaya göndermeden önce geçerli bir içerik linki (Drive, Figma vb.) eklemelisiniz.' }
  }

  try {
    const newStatus = sendToApproval ? task_status.pending_approval : task.status

    await prisma.tasks.update({
      where: { id: taskId },
      data: {
        content_url: contentUrl || null,
        status: newStatus,
      },
    })

    if (sendToApproval) {
      const agencyOwner = await prisma.profiles.findFirst({
        where: {
          agency_id: employee.agencyId,
          role: 'agency_owner',
          is_active: true,
        },
        select: { id: true },
      })

      if (agencyOwner) {
        const employeeName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Ekip üyesi'
        try {
          await prisma.notifications.create({
            data: {
              profile_id: agencyOwner.id,
              task_id: taskId,
              type: notification_type.approval,
              message: `${employeeName}, ${task.brands.name} markasına ait görevi incelemeniz için onaya gönderdi.`,
            },
          })
        } catch {
          // Bildirim hatası ana işlemi engellemez
        }
      }
    }

    revalidatePath('/employee')
    revalidatePath('/employee/tasks')
    revalidatePath('/agency/tasks')
    revalidatePath('/agency')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'İçerik linki kaydedilirken hata oluştu.'
    return { error: msg }
  }
}

// Göreve çalışan tarafından yorum eklenmesi
export async function addEmployeeTaskCommentAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const taskId = getFormString(formData, 'task_id')
  const commentText = getFormString(formData, 'comment_text')

  if (!taskId || !commentText.trim()) {
    return { error: 'Yorum metni boş bırakılamaz.' }
  }

  const employee = await getEmployee()
  if (!employee?.agencyId) {
    return { error: 'Bu işlem için yetkili çalışan oturumu gereklidir.' }
  }

  const task = await prisma.tasks.findFirst({
    where: {
      id: taskId,
      agency_id: employee.agencyId,
      is_active: true,
    },
    include: {
      brands: { select: { name: true } },
    },
  })

  if (!task) return { error: 'Görev bulunamadı veya bu ajansa ait değil.' }

  try {
    await prisma.task_comments.create({
      data: {
        task_id: taskId,
        profile_id: employee.id,
        comment_text: commentText.trim(),
      },
    })

    // Ajans sahibine bildirim gönder
    const agencyOwner = await prisma.profiles.findFirst({
      where: {
        agency_id: employee.agencyId,
        role: 'agency_owner',
        is_active: true,
      },
      select: { id: true },
    })

    if (agencyOwner) {
      const employeeName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Ekip üyesi'
      try {
        await prisma.notifications.create({
          data: {
            profile_id: agencyOwner.id,
            task_id: taskId,
            type: notification_type.comment,
            message: `${employeeName}, ${task.brands.name} görevine yeni bir yorum yazdı: "${commentText.trim().slice(0, 60)}"`,
          },
        })
      } catch {
        // Bildirim hatası ana işlemi engellemez
      }
    }

    revalidatePath('/employee/tasks')
    revalidatePath('/agency/tasks')
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Yorum eklenirken hata oluştu.'
    return { error: msg }
  }
}
