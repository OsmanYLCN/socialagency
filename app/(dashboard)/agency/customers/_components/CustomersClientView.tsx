'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type CustomerMetrics, CustomersMetricsRow } from './CustomersMetricsRow'
import { CustomersHeader } from './CustomersHeader'
import { CustomersList } from './CustomersList'
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
  const router = useRouter()
  const [editTarget, setEditTarget] = useState<BrandItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null)

  const handleNavigateNew = () => {
    router.push('/agency/customers/new')
  }

  return (
    <>
      <CustomersHeader agencyName={agencyName} onAddClick={handleNavigateNew} />

      <CustomersMetricsRow {...metrics} />

      <CustomersList
        brands={brands}
        onAdd={handleNavigateNew}
        onEdit={(brand) => setEditTarget(brand)}
        onDelete={(brand) => setDeleteTarget(brand)}
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

