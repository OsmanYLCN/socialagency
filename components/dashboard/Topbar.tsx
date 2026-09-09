'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, LogOut, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'

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

// İsimden baş harfleri türetir
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

// Dashboard üst bilgi çubuğu, arama alanı ve profil menüsü bileşeni
export function Topbar({ userName, role }: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.agency_owner
  const initials = getInitials(userName)
  const displayName = userName || 'Kullanıcı'

  // Dışarı tıklandığında menüyü kapatır
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-6">
      {/* Sol Arama Çubuğu (Referans Taslak) */}
      <div className="relative w-72 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Ara... (Müşteri, çalışan, görev)"
          className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Sağ İşlem ve Profil Alanı */}
      <div className="flex items-center gap-2.5">
        {/* Bildirim Butonu */}
        <button
          id="topbar-notifications"
          aria-label="Bildirimler"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Ayarlar Kısayol Butonu */}
        <Link
          href="/agency/settings"
          aria-label="Ayarlar"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800"
        >
          <Settings className="h-4 w-4" />
        </Link>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        <div className="relative" ref={menuRef}>
          <button
            id="topbar-user-menu"
            aria-label="Kullanıcı menüsü"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all hover:bg-slate-100 cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-none text-slate-800">{displayName}</p>
              <p className={`mt-0.5 rounded-sm px-1 py-0.5 text-[9px] font-semibold leading-none ${badge.colors}`}>
                {badge.label}
              </p>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg shadow-slate-200/50 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 capitalize">{badge.label}</p>
              </div>
              <form action={logoutAction} className="mt-1">
                <button
                  type="submit"
                  id="topbar-logout-button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Çıkış Yap
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
