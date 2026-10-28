import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cachedAdminClient: SupabaseClient | null = null

/**
 * Creates or returns the memoized Supabase admin client using the service role key.
 * Falls back to anon key if service role key is not configured.
 * 
 * IMPORTANT: Only use this server-side (API routes). 
 * Never expose the service role key to the client.
 */
export function getAdminClient(): SupabaseClient {
  if (cachedAdminClient) {
    return cachedAdminClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  cachedAdminClient = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        return fetch(input, { ...init, cache: 'no-store' })
      }
    }
  })

  return cachedAdminClient
}

