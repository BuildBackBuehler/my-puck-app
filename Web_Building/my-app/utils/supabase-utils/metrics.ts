import { supabase } from "../../lib/supabase"

export const incrementMetric = async (
  articleId: string,
  metric: 'views' | 'likes' | 'comments'
) => {
  const { data, error } = await supabase
    .from('articles')
    .select(metric)
    .eq('id', articleId)
    .single()

  if (error) throw error

  return supabase
    .from('articles')
    .update({ [metric]: (data?.[metric] || 0) + 1 })
    .eq('id', articleId)
}

export const trackPageView = async (articleId: string) => {
  return incrementMetric(articleId, 'views')
}

export const toggleLike = async (articleId: string) => {
  return incrementMetric(articleId, 'likes')
}

export const addComment = async (articleId: string) => {
  return incrementMetric(articleId, 'comments')
}