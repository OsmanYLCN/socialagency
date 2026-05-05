'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCircle,
  CheckSquare,
  Calendar,
  Bell,
  Settings,
  Zap,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/agency', icon: LayoutDashboard },
  { label: 'Müşteriler', href: '/agency/customers', icon: Users },
  { label: 'Çalışanlar', href: '/agency/employees', icon: UserCircle },
  { label: 'Görev Yönetimi', href: '/agency/tasks', icon: CheckSquare },
  { label: 'İçerik Planı', href: '/agency/content', icon: Calendar },
  { label: 'Bildirimler', href: '/agency/notifications', icon: Bell },
  { label: 'Ayarlar', href: '/agency/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-red-600 shadow-2xl shadow-red-900/30">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-red-500/40 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-base font-extrabold tracking-wide text-white">Agency</span>
          <p className="text-[10px] font-medium uppercase tracking-widest text-red-200">Panel v2</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Ana navigasyon">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-red-300">
          Menü
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
                  : 'text-red-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-red-200'
                }`}
              />
              {item.label}
              {/* Active indicator dot */}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom user card */}
      <div className="border-t border-red-500/40 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
            AY
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Ajans Yöneticisi</p>
            <p className="truncate text-[10px] text-red-200">agency_owner</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
