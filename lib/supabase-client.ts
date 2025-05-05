import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://espdnmbbnmajevqaxqqd.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcGRubWJibm1hamV2cWF4cXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwOTYxMzAsImV4cCI6MjA2MDY3MjEzMH0.ubSr95ngsfIgdHKO7Z75oOEZvbPHOIZsuYTzHK7OwEg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
