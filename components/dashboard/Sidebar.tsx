'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CheckSquare,
  Calendar,
  Megaphone,
  MessageSquare,
  Video,
  Bell,
  Settings,
  Building2,
  FileImage,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  super_admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Ajanslar', href: '/admin/agencies', icon: Building2 },
    { label: 'Kullanıcılar', href: '/admin/users', icon: Users },
    { label: 'Ayarlar', href: '/admin/settings', icon: Settings },
  ],
  agency_owner: [
    { label: 'Dashboard', href: '/agency', icon: LayoutDashboard },
    { label: 'Müşteriler', href: '/agency/customers', icon: Users },
    { label: 'Çalışanlar', href: '/agency/employees', icon: UserCheck },
    { label: 'Görev Yönetimi', href: '/agency/tasks', icon: CheckSquare },
    { label: 'İçerik Planı', href: '/agency/content', icon: Calendar },
    { label: 'İlanlar', href: '/agency/announcements', icon: Megaphone },
    { label: 'Mesajlar', href: '/agency/messages', icon: MessageSquare },
    { label: 'Toplantılar', href: '/agency/meetings', icon: Video },
    { label: 'Bildirimler', href: '/agency/notifications', icon: Bell },
    { label: 'Ayarlar', href: '/agency/settings', icon: Settings },
  ],
  employee: [
    { label: 'Dashboard', href: '/employee', icon: LayoutDashboard },
    { label: 'Görevlerim', href: '/employee/tasks', icon: CheckSquare },
    { label: 'Ayarlar', href: '/employee/settings', icon: Settings },
  ],
  customer: [
    { label: 'Dashboard', href: '/customer', icon: LayoutDashboard },
    { label: 'İçeriklerim', href: '/customer/content', icon: FileImage },
    { label: 'Ayarlar', href: '/customer/settings', icon: Settings },
  ],
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Süper Admin',
  agency_owner: 'Ajans Paneli',
  employee: 'Çalışan Paneli',
  customer: 'Müşteri Paneli',
}

interface SidebarProps {
  role: string
}

// Açılıp kapanabilen sol menü bileşeni
export function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.agency_owner
  const roleLabel = ROLE_LABELS[role] ?? role

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Menü Daraltma/Genişletme Butonu */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-label={isCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
        title={isCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
        className="absolute -right-3 top-6 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 focus:outline-none cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Ajans & Logo Başlığı */}
      <div
        className={`flex h-16 items-center border-b border-slate-100 transition-all duration-200 ${
          isCollapsed ? 'justify-center px-2' : 'gap-2.5 px-5'
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200">
          <Zap className="h-4 w-4 text-white" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="block truncate text-sm font-extrabold tracking-wide text-slate-900">
              SMAUP
            </span>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {roleLabel}
            </p>
          </div>
        )}
      </div>

      {/* Navigasyon Bağlantıları */}
      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
        aria-label="Ana navigasyon"
      >
        {!isCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Menü
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/agency' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-150 ${
                isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
              } ${
                isActive
                  ? 'bg-indigo-50/80 font-semibold text-indigo-700 shadow-sm shadow-indigo-100/50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 transition-colors duration-150 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {isActive && !isCollapsed && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Alt Platform Marka Alanı */}
      <div className="border-t border-slate-100 p-3">
        <div
          title="SMAUP Platform"
          className={`flex items-center rounded-xl bg-slate-50/80 px-3 py-2.5 transition-all ${
            isCollapsed ? 'justify-center px-2' : 'gap-2.5'
          }`}
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-black text-[10px] text-white shadow-xs">
            S
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="block truncate text-xs font-black tracking-wider text-slate-800">
                SMAUP
              </span>
              <p className="truncate text-[9px] font-medium text-slate-400">
                Agency Platform
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
