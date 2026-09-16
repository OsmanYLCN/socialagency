import type { ImageLoaderProps } from 'next/image'

// Isimden bas harfleri olusturur
export function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return 'KL'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// next/image icin passthrough loader (harici Supabase URL'leri icin)
export function avatarLoader({ src }: ImageLoaderProps): string {
  return src
}
