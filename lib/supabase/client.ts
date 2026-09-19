import { createClient } from '@supabase/supabase-js'

// İstemci tarafı Supabase bağlantısını güvenli şekilde sağlar
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase URL veya Anon Key tanımlanmamış (.env kontrol edin).')
  }

  return createClient(url, anonKey)
}
