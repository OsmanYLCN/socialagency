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
  MessageSquare,
  Video,
  Building2,
  FileImage,
  ChevronLeft,
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
  ],
  agency_owner: [
    { label: 'Dashboard', href: '/agency', icon: LayoutDashboard },
    { label: 'Müşteriler', href: '/agency/customers', icon: Users },
    { label: 'Çalışanlar', href: '/agency/employees', icon: UserCheck },
    { label: 'Görev Yönetimi', href: '/agency/tasks', icon: CheckSquare },
    { label: 'İçerik Planı', href: '/agency/content', icon: Calendar },
    { label: 'Mesajlar', href: '/agency/messages', icon: MessageSquare },
    { label: 'Toplantılar', href: '/agency/meetings', icon: Video },
  ],
  employee: [
    { label: 'Dashboard', href: '/employee', icon: LayoutDashboard },
    { label: 'Görevlerim', href: '/employee/tasks', icon: CheckSquare },
  ],
  customer: [
    { label: 'Dashboard', href: '/customer', icon: LayoutDashboard },
    { label: 'İçeriklerim', href: '/customer/content', icon: FileImage },
  ],
}

interface SidebarProps {
  role: string
}

// Açılır kapanır sol menüyü akıcı animasyonlarla gösterir
export function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.agency_owner
  const homeHref = navItems[0]?.href ?? '/agency'

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-slate-200/80 bg-white dark:border-[#262a36] dark:bg-[#14161d] transition-[width] duration-300 ease-in-out select-none will-change-[width] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Daraltma / Genişletme butonu */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-label={isCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
        title={isCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
        className="absolute -right-3 top-6 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-[#262a36] dark:bg-[#1e212b] dark:text-slate-400 dark:hover:border-[#383d4d] dark:hover:bg-[#252935] dark:hover:text-slate-100 active:scale-95 focus:outline-none cursor-pointer"
      >
        <ChevronLeft
          className={`h-3.5 w-3.5 transition-transform duration-300 ease-in-out ${
            isCollapsed ? 'rotate-180 text-slate-700 dark:text-slate-300' : 'rotate-0 text-slate-500 dark:text-slate-400'
          }`}
        />
      </button>

      {/* Üst Logo ve Başlık Alanı */}
      <div className="flex h-16 items-center border-b border-slate-100/80 dark:border-[#262a36] px-3">
        <Link
          href={homeHref}
          title="SMAUP"
          className="flex w-full items-center overflow-hidden rounded-xl py-1.5 focus:outline-none"
        >
          <div className="flex h-10 w-14 shrink-0 items-center justify-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 dark:bg-indigo-600 text-white shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95">
              <svg
                className="h-5 w-5 text-slate-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-8 4.5v9L12 21l8-4.5v-9L12 3Z" />
                <path d="M12 12 4 7.5" />
                <path d="m12 12 8-4.5" />
                <path d="M12 12v9" />
              </svg>
            </div>
          </div>
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed
                ? 'max-w-0 opacity-0 -translate-x-3 pointer-events-none'
                : 'max-w-[160px] opacity-100 translate-x-0'
            }`}
          >
            <span className="text-base font-black tracking-wider text-slate-800 dark:text-slate-100 leading-none whitespace-nowrap">
              SMAUP
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 whitespace-nowrap">
              Agency Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Navigasyon Linkleri */}
      <nav
        className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Ana navigasyon"
      >
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed
              ? 'max-h-0 opacity-0 mb-0 -translate-x-2 pointer-events-none'
              : 'max-h-6 opacity-100 mb-2 translate-x-0'
          }`}
        >
          <p className="px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">
            Menü
          </p>
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/agency' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`group relative flex h-10 w-full items-center rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-50/90 font-semibold text-indigo-700 shadow-sm shadow-indigo-100/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:shadow-none'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex h-10 w-14 shrink-0 items-center justify-center">
                <Icon
                  className={`h-4.5 w-4.5 transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                />
              </div>

              <div
                className={`flex flex-1 items-center overflow-hidden pr-3 transition-all duration-300 ease-in-out ${
                  isCollapsed
                    ? 'max-w-0 opacity-0 -translate-x-2 pointer-events-none'
                    : 'max-w-[180px] opacity-100 translate-x-0'
                }`}
              >
                <span className="truncate text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Alt Marka Alanı */}
      <div className="border-t border-slate-100/80 dark:border-[#262a36] px-3 py-3.5">
        <div
          title="SMAUP"
          className="relative flex h-8 items-center overflow-hidden"
        >
          {/* Daraltılmış durum: Ortalanmış 'S' */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
              isCollapsed
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            <span className="text-base font-black tracking-[0.2em] text-slate-700 dark:text-slate-300 select-none">
              S
            </span>
          </div>

          {/* Genişletilmiş durum: Birleşik ve hizalı 'SMAUP' */}
          <div
            className={`flex items-center px-4 transition-all duration-300 ease-in-out ${
              isCollapsed
                ? 'opacity-0 -translate-x-3 pointer-events-none'
                : 'opacity-100 translate-x-0'
            }`}
          >
            <span className="text-base font-black tracking-[0.2em] text-slate-700 dark:text-slate-300 select-none whitespace-nowrap">
              SMAUP
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
