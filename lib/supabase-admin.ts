import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client using the service role key.
 * Falls back to anon key if service role key is not configured.
 * 
 * IMPORTANT: Only use this server-side (API routes). 
 * Never expose the service role key to the client.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        return fetch(input, { ...init, cache: 'no-store' })
      }
    }
  })
}
