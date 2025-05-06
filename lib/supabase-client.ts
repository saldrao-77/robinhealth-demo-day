import { createClient } from "@supabase/supabase-js"

// Dummy client that won't actually be used
export const supabase = createClient("https://example.supabase.co", "dummy-key")

// Return the same dummy client for client-side usage
export const getClientSupabase = () => {
  return supabase
}
