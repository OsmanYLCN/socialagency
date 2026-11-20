'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { notification_type } from '@prisma/client'

export interface NotificationItemDTO {
  id: string
  message: string
  type: notification_type
  is_read: boolean
  created_at: string
  task_id: string | null
  brand_name: string | null
}

// Kullanıcının bildirimlerini ve okunmamış bildirim sayısını getirir
export async function getNotificationsAction(): Promise<{
  notifications: NotificationItemDTO[]
  unreadCount: number
}> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { notifications: [], unreadCount: 0 }
  }

  const [rawNotifications, unreadCount] = await Promise.all([
    prisma.notifications.findMany({
      where: { profile_id: user.id },
      include: {
        tasks: {
          select: {
            id: true,
            brands: { select: { name: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 20,
    }),
    prisma.notifications.count({
      where: {
        profile_id: user.id,
        is_read: false,
      },
    }),
  ])

  const notifications: NotificationItemDTO[] = rawNotifications.map((n) => ({
    id: n.id,
    message: n.message,
    type: n.type,
    is_read: Boolean(n.is_read),
    created_at: n.created_at?.toISOString() ?? new Date().toISOString(),
    task_id: n.task_id,
    brand_name: n.tasks?.brands?.name ?? null,
  }))

  return { notifications, unreadCount }
}

// Tek bir bildirimi okundu olarak işaretler
export async function markNotificationAsReadAction(notificationId: string) {
  const user = await getAuthenticatedUser()
  if (!user || !notificationId) return { success: false }

  try {
    await prisma.notifications.updateMany({
      where: {
        id: notificationId,
        profile_id: user.id,
      },
      data: { is_read: true },
    })

    revalidatePath('/agency')
    revalidatePath('/employee')
    return { success: true }
  } catch {
    return { success: false }
  }
}

// Kullanıcının tüm bildirimlerini tek tıkla okundu yapar
export async function markAllNotificationsAsReadAction() {
  const user = await getAuthenticatedUser()
  if (!user) return { success: false }

  try {
    await prisma.notifications.updateMany({
      where: {
        profile_id: user.id,
        is_read: false,
      },
      data: { is_read: true },
    })

    revalidatePath('/agency')
    revalidatePath('/employee')
    return { success: true }
  } catch {
    return { success: false }
  }
}
