'use client'

import { useEffect } from 'react'
import { getSavedSettings, applyAllPreferences, applyThemePreference } from '@/lib/settings'

export function ThemeListener() {
  useEffect(() => {
    // Sayfa ilk yüklendiğinde ayarları oku ve uygula
    const currentSettings = getSavedSettings()
    applyAllPreferences(currentSettings)

    // Sistem teması seçiliyse işletim sistemi renk modu değişimini dinle
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      const active = getSavedSettings()
      if (active.theme === 'system') {
        applyThemePreference('system')
      }
    }

    try {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } catch {
      // Eski Safari vb. için geriye dönük uyumluluk
      mediaQuery.addListener(handleSystemThemeChange)
    }

    // Diğer tarayıcı sekmelerinde yapılan ayar değişikliklerini senkronize et
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smaup_user_settings') {
        const updated = getSavedSettings()
        applyAllPreferences(updated)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      try {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      } catch {
        mediaQuery.removeListener(handleSystemThemeChange)
      }
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return null
}
