import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

/**
 * Creates a Supabase client for use in the browser.
 * This client is used for client-side operations like authentication.
 */
export const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or anon key not found in environment variables')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
