import { createClient } from '@supabase/supabase-js';

// For client-side operations in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the anon key for regular operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create a Supabase client for client-side operations
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};
