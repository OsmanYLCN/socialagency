import { Bell, MessageSquare, RotateCcw, CheckCircle2, Info } from 'lucide-react'

interface NotificationItem {
  id: string
  message: string
  type: string
  created_at: Date | string | null
  is_read?: boolean | null
}

interface EmployeeRecentNotificationsProps {
  notifications: NotificationItem[]
}

function formatTimeAgo(dateInput: Date | string | null): string {
  if (!dateInput) return 'Az önce'
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
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
      return <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
    case 'comment':
      return <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
    case 'approval':
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
    default:
      return <Info className="h-3.5 w-3.5 text-blue-500" />
  }
}

export function EmployeeRecentNotifications({ notifications }: EmployeeRecentNotificationsProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#272b37]">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Son Bildirimler & Geri Bildirimler
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Canlı Akış
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Henüz yeni bir bildiriminiz bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-xl border border-slate-100/80 bg-slate-50/50 p-2.5 transition-colors dark:border-[#272b37] dark:bg-[#1a1d25]/50 hover:bg-slate-100/50 dark:hover:bg-[#202430]"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#222632] shadow-2xs border border-slate-200/60 dark:border-[#2a2f3d]">
                {getNotificationIcon(n.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  {n.message}
                </p>
                <span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">
                  {formatTimeAgo(n.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
