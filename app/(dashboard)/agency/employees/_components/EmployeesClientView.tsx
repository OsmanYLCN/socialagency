'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type EmployeeMetrics, EmployeesMetricsRow } from './EmployeesMetricsRow'
import { EmployeesHeader } from './EmployeesHeader'
import { EmployeesList } from './EmployeesList'
import { EditEmployeeModal } from './EditEmployeeModal'
import { DeleteEmployeeModal } from './DeleteEmployeeModal'
import { ResetPasswordModal } from './ResetPasswordModal'

export interface EmployeeItem {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  salary: number
  isActive: boolean
  createdAt: string | null
  activeTaskCount: number
  completedTaskCount: number
}

interface EmployeesClientViewProps {
  agencyName: string
  employees: EmployeeItem[]
  metrics: EmployeeMetrics
}

// Calisanlar sayfasinin interaktif istemci kabugunu gosterir
export function EmployeesClientView({ agencyName, employees, metrics }: EmployeesClientViewProps) {
  const router = useRouter()
  const [editTarget, setEditTarget] = useState<EmployeeItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EmployeeItem | null>(null)
  const [resetTarget, setResetTarget] = useState<EmployeeItem | null>(null)

  const handleNavigateNew = () => {
    router.push('/agency/employees/new')
  }

  return (
    <>
      <EmployeesHeader agencyName={agencyName} onAddClick={handleNavigateNew} />

      <EmployeesMetricsRow {...metrics} />

      <EmployeesList
        employees={employees}
        onAdd={handleNavigateNew}
        onEdit={(emp) => setEditTarget(emp)}
        onDelete={(emp) => setDeleteTarget(emp)}
        onResetPassword={(emp) => setResetTarget(emp)}
      />

      <EditEmployeeModal
        isOpen={!!editTarget}
        employee={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <DeleteEmployeeModal
        isOpen={!!deleteTarget}
        employee={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <ResetPasswordModal
        isOpen={!!resetTarget}
        employee={resetTarget}
        onClose={() => setResetTarget(null)}
      />
    </>
  )
}
