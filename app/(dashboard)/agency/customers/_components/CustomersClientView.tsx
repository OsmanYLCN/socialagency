'use client'

import { useState } from 'react'
import { type CustomerMetrics, CustomersMetricsRow } from './CustomersMetricsRow'
import { CustomersHeader } from './CustomersHeader'
import { CustomersList } from './CustomersList'
import { CreateCustomerModal } from './CreateCustomerModal'
import { EditCustomerModal } from './EditCustomerModal'
import { DeleteCustomerModal } from './DeleteCustomerModal'

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

      <EditCustomerModal
        isOpen={!!editTarget}
        brand={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <DeleteCustomerModal
        isOpen={!!deleteTarget}
        brand={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  )
}

