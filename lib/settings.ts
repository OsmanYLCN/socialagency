// Sistem ve Kullanıcı Ayarları Türleri ve Varsayılanları

export type ThemeMode = 'light' | 'dark' | 'system'
export type DensityMode = 'comfortable' | 'compact'
export type LanguageMode = 'tr' | 'en'
export type DateFormatMode = 'DD.MM.YYYY' | 'YYYY-MM-DD' | 'MM/DD/YYYY'
export type WeekStartMode = 'monday' | 'sunday'
export type TaskViewMode = 'kanban' | 'list'
export type ContentViewMode = 'matrix' | 'calendar'

export interface UserSettings {
  // Görünüm & Tema
  theme: ThemeMode
  density: DensityMode
  animations: boolean

  // Dil & Bölge
  language: LanguageMode
  timezone: string
  dateFormat: DateFormatMode
  weekStart: WeekStartMode

  // Bildirimler
  emailTaskAssigned: boolean
  emailTaskStatusChanged: boolean
  emailContentApproval: boolean
  emailWeeklyDigest: boolean
  soundEnabled: boolean
  desktopNotifications: boolean

  // Çalışma Alanı
  defaultTaskView: TaskViewMode
  defaultContentView: ContentViewMode
  autoSaveDrafts: boolean
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  density: 'comfortable',
  animations: true,

  language: 'tr',
  timezone: 'Europe/Istanbul',
  dateFormat: 'DD.MM.YYYY',
  weekStart: 'monday',

  emailTaskAssigned: true,
  emailTaskStatusChanged: true,
  emailContentApproval: true,
  emailWeeklyDigest: false,
  soundEnabled: true,
  desktopNotifications: false,

  defaultTaskView: 'kanban',
  defaultContentView: 'matrix',
  autoSaveDrafts: true,
}

export const SETTINGS_STORAGE_KEY = 'smaup_user_settings'

// Tarayıcıdan ayarları okur
export function getSavedSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

// Ayarları tarayıcıya kaydeder
export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    // Tüm tercihleri anında HTML sınıflarına yansıt
    applyAllPreferences(settings)
  } catch (error) {
    console.error('Ayarlar kaydedilirken hata oluştu:', error)
  }
}

// Tema tercihini HTML elementine uygular
export function applyThemePreference(theme: ThemeMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // Sistem tercihini dinle
    const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

// Yoğunluk tercihini HTML elementine uygular
export function applyDensityPreference(density: DensityMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (density === 'compact') {
    root.classList.add('compact-mode')
  } else {
    root.classList.remove('compact-mode')
  }
}

// Animasyon tercihini HTML elementine uygular
export function applyAnimationPreference(animations: boolean): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (animations === false) {
    root.classList.add('reduce-motion')
  } else {
    root.classList.remove('reduce-motion')
  }
}

// Tüm tercihleri tek seferde HTML elementine uygular
export function applyAllPreferences(settings: UserSettings): void {
  applyThemePreference(settings.theme)
  applyDensityPreference(settings.density)
  applyAnimationPreference(settings.animations)
}
