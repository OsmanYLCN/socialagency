'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export function Pagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`px-3 py-1 rounded-md text-sm border ${
          currentPage <= 1
            ? 'pointer-events-none opacity-50 bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-[#1a1d25] dark:text-slate-200 dark:border-[#272b37] dark:hover:bg-[#20242d]'
        }`}
      >
        Önceki
      </Link>
      
      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
        Sayfa {currentPage} / {totalPages}
      </span>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`px-3 py-1 rounded-md text-sm border ${
          currentPage >= totalPages
            ? 'pointer-events-none opacity-50 bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-[#1a1d25] dark:text-slate-200 dark:border-[#272b37] dark:hover:bg-[#20242d]'
        }`}
      >
        Sonraki
      </Link>
    </div>
  )
}
