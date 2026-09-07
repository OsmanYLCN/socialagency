'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCircle,
  CheckSquare,
  Calendar,
  Settings,
  ShieldCheck,
  Building2,
  FileImage,
  Zap,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

// ─── Her role göre menü listesi ───────────────────────────────────────────────
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
    { label: 'Çalışanlar', href: '/agency/employees', icon: UserCircle },
    { label: 'Görev Yönetimi', href: '/agency/tasks', icon: CheckSquare },
    { label: 'İçerik Planı', href: '/agency/content', icon: Calendar },
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

// ─── Role label etiketi ───────────────────────────────────────────────────────
const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Süper Admin',
  agency_owner: 'Ajans Sahibi',
  employee: 'Çalışan',
  customer: 'Müşteri',
}

interface SidebarProps {
  role: string
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.agency_owner
  const roleLabel = ROLE_LABELS[role] ?? role

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-extrabold tracking-wide text-slate-900">SMAUP</span>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
            {roleLabel}
          </p>
        </div>
      </div>

      {/* Navigasyon */}
      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
        aria-label="Ana navigasyon"
      >
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Menü
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Alt bölüm: Auth */}
      <div className="border-t border-slate-100 p-4">
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Çıkış Yap
        </Link>
      </div>
    </aside>
  )
}
