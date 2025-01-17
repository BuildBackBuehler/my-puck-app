import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase credentials');
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

async function setupStorage() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) throw listError;

  const articleBucket = buckets?.find(b => b.name === 'article-images');
  
  if (!articleBucket) {
    const { error: createError } = await supabase.storage.createBucket('article-images', {
      public: true,
      allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) throw createError;
    console.log('Created article-images bucket');
  }
}

setupStorage().catch(console.error);