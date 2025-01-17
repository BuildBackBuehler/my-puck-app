// app/articles/[slug]/page.tsx
import { Render } from "@measured/puck";
import { notFound } from "next/navigation";
import { createClient } from '@/utils/supabase/server'
import config from '@/puck.config'
import { injectArticlePageData } from '@/lib/injectArticlePageData'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient();
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
      .eq('slug', params.slug)
      .single();

    if (error || !article) {
      return notFound();
    }

    // Generate Puck page data from article data
    const pageData = await injectArticlePageData(params.slug, article);

    // Render using Puck
    return <Render config={config} data={pageData} />;

  } catch (error) {
    console.error('Error in article page:', error);
    return notFound();
  }
}