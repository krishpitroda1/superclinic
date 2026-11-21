import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Public Supabase client for client-side interactions with RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin Supabase client using Service Role for server-side actions & demos
export const getAdminSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey);
};
