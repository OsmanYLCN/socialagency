import { redirect } from 'next/navigation'

// Eski müşteri rotasını yönlendirir
export default function ClientLegacyPage() {
  redirect('/customer')
}
