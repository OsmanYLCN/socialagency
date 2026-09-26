import type { Metadata } from 'next'
import { requireAgencyOwner } from '@/lib/auth'
import { CreateEmployeePageForm } from './_components/CreateEmployeePageForm'

export const metadata: Metadata = {
  title: 'Yeni Çalışan & Personel Ekle – SMAUP',
  description: 'Ajans kadronuza yeni bir ekip üyesi ve çalışan hesabı tanımlayın.',
}

export default async function NewEmployeePage() {
  await requireAgencyOwner()

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <CreateEmployeePageForm />
    </div>
  )
}
