import type { ImageLoaderProps } from 'next/image'

// Isimden bas harfleri olusturur
export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'KL'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'KL'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// next/image icin passthrough loader (harici Supabase URL'leri icin)
export function avatarLoader({ src }: ImageLoaderProps): string {
  return src
}

// Yerel tarihi YYYY-MM-DD formatinda doner (saat dilimi kaymalarini onler)
export function getLocalDateString(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Bir gorevin teslim durumunu timezone kaymasi olmadan kesin hesaplar
export function getTaskDueStatus(
  dueDateStr?: string | null,
  status?: string | null,
  referenceDateStr?: string
) {
  const isCompleted = status === 'completed'
  if (!dueDateStr) {
    return { isOverdue: false, isToday: false, isCompleted }
  }
  const todayStr = referenceDateStr || getLocalDateString()
  const dueOnly = dueDateStr.slice(0, 10)

  return {
    isOverdue: !isCompleted && dueOnly < todayStr,
    isToday: !isCompleted && dueOnly === todayStr,
    isCompleted,
  }
}

