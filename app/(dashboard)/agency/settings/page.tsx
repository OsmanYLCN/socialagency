import type { Metadata } from 'next'
import { SettingsShell } from '@/components/dashboard/settings/SettingsShell'

export const metadata: Metadata = {
  title: 'Ayarlar – SMAUP',
  description: 'Sistem görünüm ve tercih ayarları',
}

export default function AgencySettingsPage() {
  return <SettingsShell />
}
