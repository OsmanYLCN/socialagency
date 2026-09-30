import type { Metadata } from 'next'
import { SettingsShell } from '@/components/dashboard/settings/SettingsShell'

export const metadata: Metadata = {
  title: 'Ayarlar – SMAUP',
  description: 'Çalışan arayüz ve bildirim ayarları',
}

export default function EmployeeSettingsPage() {
  return <SettingsShell />
}
