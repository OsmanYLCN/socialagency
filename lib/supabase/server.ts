import { createClient, SupabaseClient } from '@supabase/supabase-js'

let serviceClientInstance: SupabaseClient | null = null
let anonClientInstance: SupabaseClient | null = null

// Yönetici işlemleri için Supabase istemcisi
export function getServiceClient() {
  if (serviceClientInstance) return serviceClientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase URL veya Service Role Key tanımlanmamış (.env kontrol edin).')
  }

  serviceClientInstance = createClient(url, key)
  return serviceClientInstance
}

// Kimlik doğrulama için anonim istemci
export function getAnonClient() {
  if (anonClientInstance) return anonClientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase URL veya Anon Key tanımlanmamış (.env kontrol edin).')
  }

  anonClientInstance = createClient(url, key)
  return anonClientInstance
}

