// types/database.ts

export interface CarouselImage {
  id: string; // UUID as a string
  image_url: string; // URL of the image
  caption: string; // Caption for the image
  container_name: string; // Name of the container
  order: number; // Order of the image
  created_at: string; // Timestamp (ISO string format)
  signedURL?: boolean; // Optional: indicates if the URL is signed
  path: string; // Path of the image in storage
}

export type ArticleMetadata = {
  author: string;
  category: string;
  date?: string;
  reading_time?: string;
  subtitle_quote?: string;
  summary?: string;
  featured_image?: string;
}

export type Article = {
  id?: string // Changed to match uuid type
  slug: string
  author: string
  category: string
  date: string
  reading_time: string
  subtitle: string | null
  summary: string | null
  content: string
  featured_image: string | null
  created_at: string
  updated_at: string
  title: string
}

export interface ArticleEngagement {
  article_id: string;
  views: number;
  likes: number;
  comments: number;
}

export interface DBArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  reading_time: string;
  subtitle: string | null;
  summary: string | null;
  content: string;
  featured_image: string | null;
}

export interface ArticleWithEngagement extends DBArticle {
  engagement: ArticleEngagement;
}

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: DBArticle;
        Insert: Omit<DBArticle, 'id' | 'created_at'>;
        Update: Partial<DBArticle>;
      };
      article_engagement: {
        Row: ArticleEngagement;
        Insert: ArticleEngagement;
        Update: Partial<ArticleEngagement>;
      };
    };
  };
}

export interface Author {
  id: string;
  first_name: string;
  last_name: string;
  pen_name: string;
  avatar_url: string;
  bio: string;
  initials: string;
}

export interface ArticleWithAuthor extends DBArticle {
  author: Author;
  engagement: ArticleEngagement;
}

export interface ArticleWithEngagement extends ArticleWithAuthor {
  engagement: ArticleEngagement;
}

export interface StorageConfig {
  supabase: {
    url: string;
    key: string;
    buckets: {
      articles: string;
      avatars: string;
      images: string;
    };
  };
  cloudflare: {
    accountId: string;
    apiToken: string;
    buckets: {
      static: string;
      cache: string;
    };
  };
}

export interface DeploymentConfig {
  static: {
    patterns: string[];
    excludePatterns: string[];
  };
  dynamic: {
    patterns: string[];
  };
}