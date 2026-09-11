'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, LogOut, Search, Settings, User, KeyRound } from 'lucide-react'
import Image, { type ImageLoaderProps } from 'next/image'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'
import { getProfileDetailsAction } from '@/app/actions/profile'
import { UserProfileModal } from './UserProfileModal'

const ROLE_BADGE: Record<string, { label: string; textColor: string; colors: string }> = {
  super_admin: {
    label: 'Süper Admin',
    textColor: 'text-rose-600',
    colors: 'bg-rose-50 text-rose-600 border border-rose-200/60',
  },
  agency_owner: {
    label: 'Ajans Sahibi',
    textColor: 'text-indigo-600',
    colors: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
  },
  employee: {
    label: 'Çalışan',
    textColor: 'text-emerald-600',
    colors: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
  },
  customer: {
    label: 'Müşteri',
    textColor: 'text-amber-600',
    colors: 'bg-amber-50 text-amber-600 border border-amber-200/60',
  },
}

// İsimden baş harfleri oluşturur
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
  initialAvatar?: string
}

function avatarLoader({ src }: ImageLoaderProps): string {
  return src
}

// Dashboard üst çubuğunu ve kullanıcı menüsünü gösterir
export function Topbar({
  userName,
  role,
  initialEmail = '',
  initialPhone = '',
  initialAvatar = '',
}: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'info' | 'password'>('info')

  const [nameOverride, setNameOverride] = useState<string | null>(null)
  const [emailOverride, setEmailOverride] = useState<string | null>(null)
  const [phoneOverride, setPhoneOverride] = useState<string | null>(null)
  const [avatarOverride, setAvatarOverride] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  const currentName = nameOverride ?? (userName || 'Ajans Yöneticisi')
  const currentEmail = emailOverride ?? initialEmail
  const currentPhone = phoneOverride ?? initialPhone
  const currentAvatar = avatarOverride ?? initialAvatar

  useEffect(() => {
    if (!initialEmail) {
      getProfileDetailsAction().then((p) => {
        if (p?.email) setEmailOverride(p.email)
        if (p?.phone) setPhoneOverride(p.phone)
        if (p?.avatarUrl !== undefined) setAvatarOverride(p.avatarUrl || '')
        if (p?.fullName && (!userName || userName === 'Kullanıcı' || userName === 'Ajans Yöneticisi')) {
          setNameOverride(p.fullName)
        }
      })
    }
  }, [initialEmail, userName])

  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.agency_owner
  const initials = getInitials(currentName)

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
        <div className="relative w-72 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Ara... (Müşteri, çalışan, görev)"
            className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="topbar-notifications"
            aria-label="Bildirimler"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

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
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 transition-all hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-600 text-[11px] font-bold text-white shadow-xs">
                {currentAvatar ? (
                  <Image
                    loader={avatarLoader}
                    src={currentAvatar}
                    alt={currentName}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-none text-slate-900">{currentName}</p>
                <p className={`mt-1 text-[11px] font-semibold leading-none ${badge.textColor}`}>
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
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-start gap-3 p-3 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-600 text-xs font-bold text-white shadow-xs">
                    {currentAvatar ? (
                      <Image
                        loader={avatarLoader}
                        src={currentAvatar}
                        alt={currentName}
                        width={36}
                        height={36}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentName}</p>
                    {currentEmail && (
                      <p className="text-[11px] text-slate-400 truncate">{currentEmail}</p>
                    )}
                    <span className={`mt-1.5 inline-block rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${badge.colors}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={handleOpenInfoModal}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Kişisel Bilgiler</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenPasswordModal}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <KeyRound className="h-4 w-4 text-slate-400" />
                    <span>Şifreyi Değiştir</span>
                  </button>
                </div>

                <div className="my-1 border-t border-slate-100" />

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

      <UserProfileModal
        key={`${isModalOpen}-${modalTab}-${currentName}-${currentEmail}-${currentPhone}-${currentAvatar}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
        initialData={{
          fullName: currentName,
          email: currentEmail,
          phone: currentPhone,
          role: role,
          avatarUrl: currentAvatar,
        }}
        onProfileUpdated={(newName, newEmail, newPhone, newAvatar) => {
          if (newName) setNameOverride(newName)
          if (newEmail) setEmailOverride(newEmail)
          if (newPhone) setPhoneOverride(newPhone)
          if (newAvatar !== undefined) setAvatarOverride(newAvatar)
        }}
      />
    </>
  )
}
