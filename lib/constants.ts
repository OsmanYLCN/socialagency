// Rol bazlı yonlendirme haritasi — auth.ts, lib/auth.ts ve proxy.ts tarafından kullanılır
export const ROLE_REDIRECT: Record<string, string> = {
  super_admin: '/admin',
  agency_owner: '/agency',
  employee: '/employee',
  customer: '/customer',
}

// Rol bazlı ayarlar sayfasi haritasi
export const ROLE_SETTINGS: Record<string, string> = {
  super_admin: '/admin/settings',
  agency_owner: '/agency/settings',
  employee: '/employee/settings',
  customer: '/customer/settings',
}
