import type { Metadata } from 'next'
import { SettingsShell } from '@/components/dashboard/settings/SettingsShell'

export const metadata: Metadata = {
  title: 'Sistem Ayarları – SMAUP',
  description: 'Sistem ve platform ayarları',
}

export default function AdminSettingsPage() {
  return <SettingsShell />
}
