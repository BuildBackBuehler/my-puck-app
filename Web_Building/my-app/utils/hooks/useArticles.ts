import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Database, ArticleWithEngagement, ArticleEngagement, ArticleWithAuthor } from '../types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useArticle(slug: string) {
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const { data: articleData } = await supabase
        .from('articles')
        .select(`
          *,
          author:author_id(
            id,
            first_name,
            last_name,
            pen_name,
            avatar_url,
            bio,
            initials
          ),
          engagement:article_engagement(*)
        `)
        .eq('slug', slug)
        .single();

      if (articleData) setArticle(articleData);
      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  const updateEngagement = async (engagement: Partial<ArticleEngagement>) => {
    if (!article?.id) return;

    const { data } = await supabase
      .from('article_engagement')
      .upsert({
        article_id: article.id,
        ...article.engagement,
        ...engagement
      })
      .select()
      .single();

    if (data) {
      setArticle(prev => prev ? { ...prev, engagement: data } : null);
    }
  };

  return { article, loading, updateEngagement };
}

export function useTopArticles(limit = 5) {
  const [articles, setArticles] = useState<ArticleWithEngagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopArticles() {
      const { data: engagementData } = await supabase
        .from('article_engagement')
        .select('*')
        .order('views', { ascending: false })
        .limit(limit);

      if (engagementData) {
        const articleIds = engagementData.map(e => e.article_id);
        const { data: articlesData } = await supabase
          .from('articles')
          .select('*')
          .in('id', articleIds);

        if (articlesData) {
          const articlesWithEngagement = articlesData.map(article => ({
            ...article,
            engagement: engagementData.find(e => e.article_id === article.id)!
          }));

          setArticles(articlesWithEngagement);
        }
      }
      
      setLoading(false);
    }

    fetchTopArticles();
  }, [limit]);

  return { articles, loading };
}

export function useArticlesByCategory(category: string) {
  const [articles, setArticles] = useState<ArticleWithEngagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category);

      if (articlesData) {
        const { data: engagementData } = await supabase
          .from('article_engagement')
          .select('*')
          .in('article_id', articlesData.map(a => a.id));

        const articlesWithEngagement = articlesData.map(article => ({
          ...article,
          engagement: engagementData?.find(e => e.article_id === article.id) || {
            article_id: article.id,
            views: 0,
            likes: 0,
            comments: 0
          }
        }));

        setArticles(articlesWithEngagement);
      }
      
      setLoading(false);
    }

    fetchArticles();
  }, [category]);

  return { articles, loading };
}

export function useArticlesByAuthor(authorId: string) {
  const [articles, setArticles] = useState<ArticleWithEngagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const { data: articlesData } = await supabase
        .from('articles')
        .select(`
          *,
          author:author_id(
            id,
            pen_name,
            avatar_url
          )
        `)
        .eq('author_id', authorId);

      if (articlesData) {
        const { data: engagementData } = await supabase
          .from('article_engagement')
          .select('*')
          .in('article_id', articlesData.map(a => a.id));

        const articlesWithEngagement = articlesData.map(article => ({
          ...article,
          engagement: engagementData?.find(e => e.article_id === article.id) || {
            article_id: article.id,
            views: 0,
            likes: 0,
            comments: 0
          }
        }));

        setArticles(articlesWithEngagement);
      }
      
      setLoading(false);
    }

    fetchArticles();
  }, [authorId]);

  return { articles, loading };
}

export const CATEGORIES = ['Awareness', 'Control', 'Escape', 'Soul', 'Present'] as const;

export function useLatestArticlesByCategories() {
  const [articlesByCategory, setArticlesByCategory] = useState<Record<string, ArticleWithEngagement[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestArticles() {
      const articlesPromises = CATEGORIES.map(async (category) => {
        const { data } = await supabase
          .from('articles')
          .select(`
            *,
            author:author_id(
              id,
              pen_name,
              avatar_url
            )
          `)
          .eq('category', category)
          .order('date', { ascending: false })
          .limit(1);
        
        return { category, articles: data || [] };
      });

      const categorizedArticles = await Promise.all(articlesPromises);
      
      // Get all article IDs for engagement data
      const allArticleIds = categorizedArticles.flatMap(({ articles }) => 
        articles.map(a => a.id)
      );

      // Fetch engagement data for all articles
      const { data: engagementData } = await supabase
        .from('article_engagement')
        .select('*')
        .in('article_id', allArticleIds);

      // Organize articles by category with engagement data
      const result = categorizedArticles.reduce((acc, { category, articles }) => {
        acc[category] = articles.map(article => ({
          ...article,
          engagement: engagementData?.find(e => e.article_id === article.id) || {
            article_id: article.id,
            views: 0,
            likes: 0,
            comments: 0
          }
        }));
        return acc;
      }, {} as Record<string, ArticleWithEngagement[]>);

      setArticlesByCategory(result);
      setLoading(false);
    }

    fetchLatestArticles();
  }, []);

  return { articlesByCategory, loading };
}