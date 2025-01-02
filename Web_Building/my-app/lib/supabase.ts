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

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// hooks/useArticles.ts
import { useQuery } from '@tanstack/react-query'
import { Article, supabase } from '../lib/supabase'

export const useArticles = (limit = 5) => {
  return useQuery({
    queryKey: ['articles', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('likes', { ascending: false })
        .order('views', { ascending: false })
        .order('comments', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      return data.map((article: Article, index: number) => ({
        id: article.id,
        number: index + 1,
        title: article.title,
        date: new Date(article.created_at).toLocaleDateString(),
        summary: article.summary,
        link: `/article/${article.id}`,
        engagement: {
          views: article.views,
          likes: article.likes,
          comments: article.comments,
          showStats: true
        }
      }))
    }
  })
}