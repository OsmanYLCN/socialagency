import type { Metadata } from 'next'
import { requireAgencyOwner } from '@/lib/auth'
import { CreateCustomerPageForm } from './_components/CreateCustomerPageForm'

export const metadata: Metadata = {
  title: 'Yeni Müşteri & Marka Ekle – SMAUP',
  description: 'Ajansınıza yeni bir kurumsal müşteri hesabı ve marka profili tanımlayın.',
}

export default async function NewCustomerPage() {
  await requireAgencyOwner()

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <CreateCustomerPageForm />
    </div>
  )
}
