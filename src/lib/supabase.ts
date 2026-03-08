import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Create a .env.local file based on .env.example'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// ---- Database types ----

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  house: string | null
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  current_level: number
  max_level_reached: number
  total_spells_typed: number
  total_spells_missed: number
  total_sessions: number
  total_time_played_seconds: number
  last_played_at: string | null
  updated_at: string
}

export interface LevelScore {
  id: string
  user_id: string
  level: number
  best_score: number
  best_accuracy: number
  games_played: number
  times_completed: number
  last_played_at: string | null
}
