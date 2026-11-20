'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Check,
  CheckCheck,
  RotateCcw,
  MessageSquare,
  CheckCircle2,
  CheckSquare,
  Info,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import {
  getNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  type NotificationItemDTO,
} from '@/app/actions/notifications'

interface NotificationsPopoverProps {
  role: string
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 60) return 'Az önce'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} dk önce`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} sa önce`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay} gün önce`
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'revision':
      return <RotateCcw className="h-4 w-4 text-rose-500" />
    case 'approval':
      return <CheckCircle2 className="h-4 w-4 text-amber-500" />
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-indigo-500" />
    case 'assignment':
      return <CheckSquare className="h-4 w-4 text-blue-500" />
    default:
      return <Info className="h-4 w-4 text-slate-500" />
  }
}

export function NotificationsPopover({ role }: NotificationsPopoverProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItemDTO[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const popoverRef = useRef<HTMLDivElement>(null)

  const loadNotifications = async () => {
    try {
      const data = await getNotificationsAction()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // sessizce geç
    }
  }

  // İlk yüklemede ve 30 saniyede bir bildirimleri çek
  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (next) {
        loadNotifications()
      }
      return next
    })
  }

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsReadAction()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    })
  }

  const handleNotificationClick = (item: NotificationItemDTO) => {
    // Okundu olarak işaretle
    if (!item.is_read) {
      markNotificationAsReadAction(item.id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    setIsOpen(false)

    // Göreve git
    if (item.task_id) {
      if (role === 'employee') {
        router.push(`/employee/tasks?taskId=${item.task_id}`)
      } else {
        router.push(`/agency/tasks?taskId=${item.task_id}`)
      }
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Zil Butonu */}
      <button
        type="button"
        id="topbar-notifications"
        aria-label="Bildirimler"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-[#262a36] dark:bg-[#1e212b] dark:text-slate-400 dark:hover:bg-[#252935] dark:hover:text-slate-200 transition-all cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#14161d] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Açılır Pencere */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 dark:border-[#262a36] dark:bg-[#16181f] dark:shadow-black/60 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          {/* Popover Başlığı */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 p-3.5 dark:border-[#262a36] dark:bg-[#1a1d25]/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Bildirimler
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  {unreadCount} yeni
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isPending}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
                <span>Tümünü Okundu Say</span>
              </button>
            )}
          </div>

          {/* Bildirim Listesi */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-[#262a36]/60">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-[#1a1d25] dark:text-slate-500 mb-2">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Henüz bir bildiriminiz yok
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Görev atamaları ve revizyonlar burada listelenir.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                    !item.is_read
                      ? 'bg-indigo-50/40 hover:bg-indigo-50/70 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-[#1a1d25]/60'
                  }`}
                >
                  {/* İkon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-200/60 dark:bg-[#202430] dark:border-[#2a2f3d]">
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Metin & Zaman */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs leading-snug ${
                      !item.is_read
                        ? 'font-bold text-slate-900 dark:text-slate-100'
                        : 'font-normal text-slate-600 dark:text-slate-300'
                    }`}>
                      {item.message}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                      {item.brand_name && (
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {item.brand_name}
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatTimeAgo(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Okunmadı Noktası */}
                  {!item.is_read && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Alt Çubuk */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-2.5 text-center dark:border-[#262a36] dark:bg-[#1a1d25]/40">
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                Tıklayarak ilgili göreve hızlıca gidebilirsiniz
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
