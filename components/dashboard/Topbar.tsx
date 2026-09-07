'use client'

import { Bell, ChevronDown } from 'lucide-react'

// ─── Role badge renkleri ──────────────────────────────────────────────────────
const ROLE_BADGE: Record<string, { label: string; colors: string }> = {
  super_admin: {
    label: 'Süper Admin',
    colors: 'bg-red-50 text-red-600',
  },
  agency_owner: {
    label: 'Ajans Sahibi',
    colors: 'bg-indigo-50 text-indigo-600',
  },
  employee: {
    label: 'Çalışan',
    colors: 'bg-emerald-50 text-emerald-600',
  },
  customer: {
    label: 'Müşteri',
    colors: 'bg-amber-50 text-amber-600',
  },
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return 'KL'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface TopbarProps {
  userName: string
  role: string
}

export function Topbar({ userName, role }: TopbarProps) {
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.agency_owner
  const initials = getInitials(userName)
  const displayName = userName || 'Kullanıcı'

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-100 bg-white px-6">
      {/* Sayfa başlığı alanı — sol */}
      <div className="flex-1" />

      {/* Sağ aksiyonlar */}
      <div className="flex items-center gap-2">
        {/* Bildirimler */}
        <button
          id="topbar-notifications"
          aria-label="Bildirimler"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Ayırıcı */}
        <div className="mx-1 h-5 w-px bg-slate-200" />

        {/* Kullanıcı */}
        <button
          id="topbar-user-menu"
          aria-label="Kullanıcı menüsü"
          className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all hover:bg-slate-100"
        >
          {/* Avatar */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold leading-none text-slate-800">{displayName}</p>
            <p className={`mt-0.5 rounded-sm px-1 py-0.5 text-[9px] font-semibold leading-none ${badge.colors}`}>
              {badge.label}
            </p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>
    </header>
  )
}
