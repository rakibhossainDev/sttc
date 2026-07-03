import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Fallback to prevent hard crashes if env variables are missing or incorrectly formatted (e.g., missing https://)
  if (!supabaseUrl.startsWith('http')) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is missing or invalid. Using a placeholder to prevent crashes.');
    supabaseUrl = 'https://placeholder.supabase.co';
    supabaseAnonKey = 'placeholder';
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
