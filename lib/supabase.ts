import { createClient } from "@supabase/supabase-js"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          mood_status: any
          ambient_theme: any
          badges: any[]
          stats: any
          is_verified: boolean
          followers: number
          following: number
          total_likes: number
          joined_at: string
          last_active: string
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          mood_status?: any
          ambient_theme?: any
          badges?: any[]
          stats?: any
          is_verified?: boolean
          followers?: number
          following?: number
          total_likes?: number
          joined_at?: string
          last_active?: string
          preferences?: any
        }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
