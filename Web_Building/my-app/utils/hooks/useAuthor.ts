import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { Author } from '../types/database'

export const useAuthor = (authorId: string) => {
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .eq('id', authorId)
          .single()

        if (error) throw error
        setAuthor(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (authorId) fetchAuthor()
  }, [authorId])

  return { author, loading, error }
}