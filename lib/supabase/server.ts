import { createClient } from '@supabase/supabase-js'

// For server-side usage (Server Actions, Route Handlers)
// We use the service role key to bypass RLS for admin operations
// and the anon key for user-scoped operations.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
