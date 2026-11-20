'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { type EmployeeMetrics, EmployeesMetricsRow } from './EmployeesMetricsRow'
import { EmployeesHeader } from './EmployeesHeader'
import { EmployeesList } from './EmployeesList'
import { EditEmployeeModal } from './EditEmployeeModal'
import { DeleteEmployeeModal } from './DeleteEmployeeModal'
import { ResetPasswordModal } from './ResetPasswordModal'
import { EmployeeDetailDrawer } from './EmployeeDetailDrawer'

export interface EmployeeRecentTask {
  id: string
  brandName: string
  platform: string
  content: string
  status: string
  dueDate: string
  assignmentNote: string | null
}

export interface EmployeeMetadata {
  phone: string | null
  department: string | null
  title: string | null
  workType: string | null
  startDate: string | null
  city: string | null
  iban: string | null
  emergencyContact: string | null
  notes: string | null
}

export interface EmployeeItem {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  salary: number
  isActive: boolean
  createdAt: string | null
  metadata: EmployeeMetadata
  activeTaskCount: number
  completedTaskCount: number
  recentTasks: EmployeeRecentTask[]
}

interface EmployeesClientViewProps {
  agencyName: string
  employees: EmployeeItem[]
  metrics: EmployeeMetrics
}

// Çalışanlar sayfasının interaktif istemci kabuğunu gösterir
export function EmployeesClientView({ agencyName, employees, metrics }: EmployeesClientViewProps) {
  const router = useRouter()
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null)
  const [editTarget, setEditTarget] = useState<EmployeeItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EmployeeItem | null>(null)
  const [resetTarget, setResetTarget] = useState<EmployeeItem | null>(null)

  // Server revalidation sonrası açık çekmecedeki veya modaldaki veriyi senkronize et
  useEffect(() => {
    if (selectedEmployee) {
      const updated = employees.find((e) => e.id === selectedEmployee.id) ?? null
      setSelectedEmployee(updated)
    }
    if (editTarget) {
      const updated = employees.find((e) => e.id === editTarget.id) ?? null
      setEditTarget(updated)
    }
  }, [employees])

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
        onSelect={(emp) => setSelectedEmployee(emp)}
        onEdit={(emp) => setEditTarget(emp)}
        onDelete={(emp) => setDeleteTarget(emp)}
        onResetPassword={(emp) => setResetTarget(emp)}
      />

      <EmployeeDetailDrawer
        isOpen={!!selectedEmployee}
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
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
