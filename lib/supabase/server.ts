import { createClient } from '@supabase/supabase-js'

// Supabase servis rolü istemcisi (RLS bypass ve admin işlemleri)
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase URL veya Service Role Key tanımlanmamış (.env kontrol edin).')
  }

  return createClient(url, key)
}

// Supabase anonim istemcisi (kullanıcı yetkilendirmesi ve oturum işlemleri)
export function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase URL veya Anon Key tanımlanmamış (.env kontrol edin).')
  }

  return createClient(url, key)
}

// Genel sunucu istemcisi
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
