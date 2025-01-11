// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export type Article = {
  id: string
  title: string
  summary: string
  created_at: string
  views: number
  likes: number
  comments: number
}

export type Author = {
  id: string
  first_name: string
  last_name: string
  pen_name: string
  initials: string
  bio: string
  avatar_url: string
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)