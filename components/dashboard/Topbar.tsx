'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, LogOut, Search, Settings, User, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'
import { getProfileDetailsAction } from '@/app/actions/profile'
import { UserProfileModal } from './UserProfileModal'

const ROLE_BADGE: Record<string, { label: string; colors: string }> = {
  super_admin: {
    label: 'Süper Admin',
    colors: 'bg-rose-50 text-rose-600 border border-rose-200/60',
  },
  agency_owner: {
    label: 'Ajans Sahibi',
    colors: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
  },
  employee: {
    label: 'Çalışan',
    colors: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
  },
  customer: {
    label: 'Müşteri',
    colors: 'bg-amber-50 text-amber-600 border border-amber-200/60',
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
  initialEmail?: string
  initialPhone?: string
}

// Dashboard üst bilgi çubuğu, arama alanı ve zenginleştirilmiş kullanıcı mini menüsü
export function Topbar({
  userName,
  role,
  initialEmail = '',
  initialPhone = '',
}: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'info' | 'password'>('info')

  const [currentName, setCurrentName] = useState(userName || 'Ajans Yöneticisi')
  const [currentEmail, setCurrentEmail] = useState(initialEmail)
  const [currentPhone, setCurrentPhone] = useState(initialPhone)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userName) setCurrentName(userName)
  }, [userName])

  useEffect(() => {
    if (initialEmail) {
      setCurrentEmail(initialEmail)
    } else {
      getProfileDetailsAction().then((p) => {
        if (p?.email) setCurrentEmail(p.email)
        if (p?.phone) setCurrentPhone(p.phone)
        if (p?.fullName && (!userName || userName === 'Kullanıcı' || userName === 'Ajans Yöneticisi')) {
          setCurrentName(p.fullName)
        }
      })
    }
  }, [initialEmail, userName])

  useEffect(() => {
    if (initialPhone) setCurrentPhone(initialPhone)
  }, [initialPhone])

  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.agency_owner
  const initials = getInitials(currentName)

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

  const handleOpenInfoModal = () => {
    setIsOpen(false)
    setModalTab('info')
    setIsModalOpen(true)
  }

  const handleOpenPasswordModal = () => {
    setIsOpen(false)
    setModalTab('password')
    setIsModalOpen(true)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-6">
        {/* Sol Arama Çubuğu */}
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

          {/* Kullanıcı Menü Butonu & Zengin Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              id="topbar-user-menu"
              aria-label="Kullanıcı menüsü"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 transition-all hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-[11px] font-bold text-white shadow-xs">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-none text-slate-900">{currentName}</p>
                <p className={`mt-0.5 inline-block rounded-sm px-1 py-0.5 text-[9px] font-semibold leading-none ${badge.colors}`}>
                  {badge.label}
                </p>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Global Standartlarda Mini Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* 1. Kullanıcı Bilgi Kartı */}
                <div className="flex items-start gap-3 p-3 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xs font-black text-white shadow-xs">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    {currentEmail && (
                      <p className="text-[11px] text-slate-400 truncate">{currentEmail}</p>
                    )}
                    <span className={`mt-1.5 inline-block rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${badge.colors}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* 2. Menü Maddeleri */}
                <div className="space-y-0.5">
                  {/* Kişisel Bilgiler */}
                  <button
                    type="button"
                    onClick={handleOpenInfoModal}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                    <span>Kişisel Bilgiler</span>
                  </button>

                  {/* Şifre Değiştir */}
                  <button
                    type="button"
                    onClick={handleOpenPasswordModal}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    <KeyRound className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                    <span>Şifreyi Değiştir</span>
                  </button>
                </div>

                {/* 3. Ayırıcı Çizgi */}
                <div className="my-1 border-t border-slate-100" />

                {/* 4. Çıkış Yap */}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    id="topbar-logout-button"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Çıkış Yap</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Kişisel Bilgiler ve Şifre Yönetim Modalı */}
      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
        initialData={{
          fullName: currentName,
          email: currentEmail,
          phone: currentPhone,
          role: role,
        }}
        onProfileUpdated={(newName, newEmail, newPhone) => {
          setCurrentName(newName)
          if (newEmail) setCurrentEmail(newEmail)
          if (newPhone) setCurrentPhone(newPhone)
        }}
      />
    </>
  )
}
