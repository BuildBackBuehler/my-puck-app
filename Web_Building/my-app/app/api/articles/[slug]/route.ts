// app/api/articles/[slug]/route.ts
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { injectArticlePageData } from '@/lib/injectArticlePageData'

export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params
    const supabase = await createClient()
    
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:author_id(
          id,
          pen_name,
          avatar_url
        ),
        engagement:article_engagement(*)
      `)
      .eq('slug', slug)
      .single()

    if (error || !article) {
      return new NextResponse('Article not found', { status: 404 })
    }

    // Generate and return Puck page data
    const pageData = await injectArticlePageData(slug, article)
    return NextResponse.json(pageData)
  } catch (error) {
    console.error('Error in article API:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Keep existing POST handler
export async function POST(request: Request, context: { params: { slug: string } }) {
  // ... POST handler implementation stays the same
}