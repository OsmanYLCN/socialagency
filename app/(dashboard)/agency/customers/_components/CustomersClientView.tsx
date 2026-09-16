'use client'

import { useState } from 'react'
import { type CustomerMetrics, CustomersMetricsRow } from './CustomersMetricsRow'
import { CustomersHeader } from './CustomersHeader'
import { CustomersList } from './CustomersList'
import { CreateCustomerModal } from './CreateCustomerModal'

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

// Musteriler sayfasinin interaktif istemci kabugunu gosterir
export function CustomersClientView({ agencyName, brands, metrics }: CustomersClientViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BrandItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null)

  return (
    <>
      <CustomersHeader agencyName={agencyName} onAddClick={() => setIsCreateOpen(true)} />

      <CustomersMetricsRow {...metrics} />

      <CustomersList
        brands={brands}
        onAdd={() => setIsCreateOpen(true)}
        onEdit={(brand) => setEditTarget(brand)}
        onDelete={(brand) => setDeleteTarget(brand)}
      />

      <CreateCustomerModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* TODO Part 3: EditCustomerModal ve DeleteCustomerModal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-sm text-slate-600">Duzenleme modali Part 3&apos;te eklenecek: {editTarget.name}</p>
            <button onClick={() => setEditTarget(null)} className="mt-3 text-xs text-slate-500 hover:underline cursor-pointer">Kapat</button>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-sm text-slate-600">Silme modali Part 3&apos;te eklenecek: {deleteTarget.name}</p>
            <button onClick={() => setDeleteTarget(null)} className="mt-3 text-xs text-slate-500 hover:underline cursor-pointer">Kapat</button>
          </div>
        </div>
      )}
    </>
  )
}
