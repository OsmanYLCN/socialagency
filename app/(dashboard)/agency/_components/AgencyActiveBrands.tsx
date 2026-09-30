import { Building, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface BrandOverviewItem {
  id: string
  name: string
  managerName?: string
  activeTasksCount?: number
}

interface ActiveBrandsProps {
  brands?: BrandOverviewItem[]
}

// Aktif müşteriler panelini gösterir
export function AgencyActiveBrands({ brands = [] }: ActiveBrandsProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-[#272b37] dark:bg-[#16181f]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Aktif Müşteriler</h3>
          <p className="text-xs text-slate-400 dark:text-slate-400">Ajans bünyesinde yönetilen markalar, sorumlu personeller ve aktif işler</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:border dark:border-[#272b37] dark:bg-[#1a1d25] dark:text-slate-300">
            {brands.length} Marka
          </span>
          <Link
            href="/agency/customers"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>Tüm Müşteriler</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center dark:border-[#272b37] dark:bg-[#14161d]">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-[#1e212b] dark:text-slate-400">
            <Building className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Henüz Kayıtlı Müşteri Bulunmuyor</p>
          <p className="mt-1 max-w-md text-xs text-slate-400 dark:text-slate-400">
            Müşterilerinizi eklemek, düzenlemek ve sözleşmelerini yönetmek için sol menüdeki{' '}
            <Link href="/agency/customers" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              Müşteriler
            </Link>{' '}
            bölümünü kullanabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4.5 transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:shadow-xs dark:border-[#272b37] dark:bg-[#14161d] dark:hover:border-indigo-500/40 dark:hover:bg-[#1a1d25]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700 dark:border dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <Building className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{brand.name}</h4>
                  <p className="truncate text-xs text-slate-400 dark:text-slate-400">
                    Sorumlu: <span className="font-medium text-slate-600 dark:text-slate-300">{brand.managerName || 'Atanmadı'}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 pt-3 text-xs dark:border-[#272b37]">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {brand.activeTasksCount ?? 0} Aktif Görev
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
