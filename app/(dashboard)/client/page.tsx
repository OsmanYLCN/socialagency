import { redirect } from 'next/navigation'

// Eski müşteri rotasını yeni rotaya yönlendirir
export default function ClientLegacyPage() {
  redirect('/customer')
}
