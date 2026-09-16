'use client'

import { useState } from 'react'
import { type CustomerMetrics, CustomersMetricsRow } from './CustomersMetricsRow'
import { CustomersHeader } from './CustomersHeader'

export interface BrandItem {
  id: string
  name: string
  monthlyFee: number
  createdAt: string | null
  customer: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string | null
    isActive: boolean
  } | null
  activeTaskCount: number
  completedTaskCount: number
}

interface CustomersClientViewProps {
  agencyName: string
  brands: BrandItem[]
  metrics: CustomerMetrics
}

// Musteriler sayfasinin interaktif istemci kabuğunu gosterir
// Part 2'de CustomersList ve modaller buraya eklenecek
export function CustomersClientView({ agencyName, brands, metrics }: CustomersClientViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <>
      <CustomersHeader agencyName={agencyName} onAddClick={() => setIsCreateOpen(true)} />
      <CustomersMetricsRow {...metrics} />

      {/* Placeholder — Part 2'de CustomersList buraya gelecek */}
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
        <p className="text-sm text-slate-400">
          Marka listesi ve modaller Part 2 ile eklenecek...
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Toplam {brands.length} marka yuklendi.
        </p>
      </div>

      {/* TODO Part 2: <CreateCustomerModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} /> */}
    </>
  )
}
