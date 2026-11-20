'use client'

import Link from 'next/link'
import { CheckSquare, Briefcase, Calendar } from 'lucide-react'

interface EmployeeDashboardHeaderProps {
  employeeName: string
  agencyName: string
  employeeTitle?: string | null
  employeeDepartment?: string | null
  poolCount: number
  activeTasksCount: number
  formattedDate: string
}

export function EmployeeDashboardHeader({
  employeeName,
  agencyName,
  employeeTitle,
  employeeDepartment,
  poolCount,
  activeTasksCount,
  formattedDate,
}: EmployeeDashboardHeaderProps) {
  const roleBadgeText = [agencyName, employeeTitle || employeeDepartment || 'Ekip Üyesi']
    .filter(Boolean)
    .join(' • ')

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-[#272b37]">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {roleBadgeText}
          </span>
          {employeeTitle && employeeDepartment && (
            <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40">
              {employeeDepartment}
            </span>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Merhaba, {employeeName} 👋
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Bugün üzerinizde <strong className="font-semibold text-slate-700 dark:text-slate-200">{activeTasksCount} aktif görev</strong> bulunuyor. Ajans iş havuzunda ise <strong className="font-semibold text-indigo-600 dark:text-indigo-400">{poolCount} açık iş</strong> seni bekliyor.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          href="/employee/tasks?tab=pool"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-200 dark:hover:bg-[#222632]"
        >
          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>İş Havuzu</span>
          {poolCount > 0 && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              {poolCount}
            </span>
          )}
        </Link>

        <Link
          href="/employee/tasks"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          <CheckSquare className="h-4 w-4" />
          <span>Tüm Görevlerim</span>
        </Link>
      </div>
    </div>
  )
}
