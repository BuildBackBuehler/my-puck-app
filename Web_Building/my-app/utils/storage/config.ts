import { StorageConfig } from "../types/database";

export const storageConfig: StorageConfig = {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key: process.env.SUPABASE_SERVICE_KEY!,
      buckets: {
        articles: 'article-images',
        avatars: 'authors-avatars',
        images: 'blog-images'
      }
    },
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      apiToken: process.env.CLOUDFLARE_API_TOKEN!,
      buckets: {
        static: 'static-assets',
        cache: 'cache-assets'
      }
    }
  };