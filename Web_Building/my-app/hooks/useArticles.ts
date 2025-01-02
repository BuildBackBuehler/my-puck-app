// hooks/useBlogPosts.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

export function useFeaturedPosts() {
  return useQuery({
    queryKey: ['featured-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('views', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    }
  })
}