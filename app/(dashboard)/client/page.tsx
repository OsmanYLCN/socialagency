import { redirect } from 'next/navigation'

// /client route'u artik kullanilmıyor.
// Musteri paneli /customer adresine taşindi.
// ROLE_REDIRECT: customer → /customer
export default function ClientLegacyPage() {
  redirect('/customer')
}
