'use client'

import { Bell, Settings, Search } from 'lucide-react'
import { useState } from 'react'

export function Topbar() {
  const [search, setSearch] = useState('')

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-6 shadow-sm">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id="topbar-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ara..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20"
        />
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <button
          id="topbar-notifications"
          aria-label="Bildirimler"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600"
        >
          <Bell className="h-4 w-4" />
          {/* Badge */}
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
        </button>

        {/* Settings */}
        <button
          id="topbar-settings"
          aria-label="Ayarlar"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* User avatar */}
        <button
          id="topbar-user-menu"
          aria-label="Kullanıcı menüsü"
          className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 transition-all hover:bg-gray-100"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-sm">
            AY
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-800 leading-none">Ajans Yönetici</p>
            <p className="mt-0.5 text-[10px] text-gray-500">Agency Owner</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  )
}
