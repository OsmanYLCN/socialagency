'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { type CustomerMetrics, CustomersMetricsRow } from './CustomersMetricsRow'
import { CustomersHeader } from './CustomersHeader'
import { CustomersList } from './CustomersList'
import { EditCustomerModal } from './EditCustomerModal'
import { DeleteCustomerModal } from './DeleteCustomerModal'
import { CustomerDetailDrawer } from './CustomerDetailDrawer'

export interface BrandRecentTask {
  id: string
  platform: string
  content: string
  status: string
  dueDate: string
  assignmentNote: string | null
}

export interface BrandMetadata {
  phone: string | null
  sector: string | null
  website: string | null
  instagram: string | null
  city: string | null
  billingTitle: string | null
  taxId: string | null
  taxOffice: string | null
  notes: string | null
}

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
  metadata: BrandMetadata
  activeTaskCount: number
  completedTaskCount: number
  weeklyTemplateQuota: number
  recentTasks: BrandRecentTask[]
}

interface CustomersClientViewProps {
  agencyName: string
  brands: BrandItem[]
  metrics: CustomerMetrics
}

// Müşteriler sayfasının interaktif istemci kabuğunu gösterir
export function CustomersClientView({ agencyName, brands, metrics }: CustomersClientViewProps) {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null)
  const [editTarget, setEditTarget] = useState<BrandItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null)

  // Server revalidation sonrası açık çekmecedeki veya modaldaki veriyi senkronize et
  useEffect(() => {
    if (selectedBrand) {
      const updated = brands.find((b) => b.id === selectedBrand.id) ?? null
      setSelectedBrand(updated)
    }
    if (editTarget) {
      const updated = brands.find((b) => b.id === editTarget.id) ?? null
      setEditTarget(updated)
    }
  }, [brands])

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
        onSelect={(brand) => setSelectedBrand(brand)}
        onEdit={(brand) => setEditTarget(brand)}
        onDelete={(brand) => setDeleteTarget(brand)}
      />

      <CustomerDetailDrawer
        isOpen={!!selectedBrand}
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
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
