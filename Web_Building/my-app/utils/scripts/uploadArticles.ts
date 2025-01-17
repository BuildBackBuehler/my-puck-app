import { createClient } from '@supabase/supabase-js';
import { Database, ArticleMetadata } from '../types/database';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' })

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const uploadImage = async (imgPath: string) => {
  const imgId = `${uuid()}${path.extname(imgPath)}`;
  const imgBuffer = await fs.readFile(imgPath);

  await supabase.storage
    .from('article-images')
    .upload(imgId, imgBuffer, { contentType: 'image/webp' });

  return supabase.storage.from('article-images').getPublicUrl(imgId).data.publicUrl;
};

const processImages = async (articlePath: string, content: string) => {
  const imageRegex = /<img(?:\s+align="[^"]*")?\s+src="([^"]+)"[^>]*>/g;
  const matches = Array.from(content.matchAll(imageRegex));
  let processedContent = content;

  for (const match of matches) {
    const [fullMatch, imgPath] = match;
    const absolutePath = path.join(articlePath, imgPath);
    try {
      const publicUrl = await uploadImage(absolutePath);
      const newImgTag = fullMatch.replace(imgPath, publicUrl);
      processedContent = processedContent.replace(fullMatch, newImgTag);
    } catch (error) {
      console.error(`Failed to process image ${imgPath}:`, error);
    }
  }

  return processedContent;
};

const extractMetadataAndContent = async (rawContent: string) => {
  const parts = rawContent.split('---').filter(Boolean);
  const metadataSection = parts[0].trim();
  
  const metadata: ArticleMetadata = {
    author: '',
    category: '',
    date: '',
    reading_time: '',
    subtitle_quote: '',
    summary: '',
    featured_image: ''
  };

  let currentField = '';
  let multilineValue = '';

  metadataSection.split('\n').forEach(line => {
    const labelMatch = line.match(/^(\w+(?:\/\w+)?)(?: time)?:\s*(.*)$/);
    
    if (labelMatch) {
      if (currentField === 'summary' && multilineValue) {
        metadata.summary = multilineValue.trim();
        multilineValue = '';
      }

      const [, key, rawValue] = labelMatch;
      currentField = key.toLowerCase();
      const value = rawValue.trim();
      
      switch (currentField) {
        case 'author': metadata.author = value; break;
        case 'category': metadata.category = value; break;
        case 'date': metadata.date = value; break;
        case 'reading': metadata.reading_time = value; break;
        case 'subtitle': metadata.subtitle_quote = value.replace(/^["'](.+)["']$/, '$1'); break;
        case 'summary': multilineValue = value; break;
        case 'featured_image':
          const imageMatch = value.match(/<img[^>]+src="([^"]+)"[^>]*>/);
          metadata.featured_image = imageMatch ? imageMatch[1] : value;
          break;
      }
    }
  });

  if (currentField === 'summary' && multilineValue) {
    metadata.summary = multilineValue.trim();
  }

  return { metadata, content: parts[1].trim() };
};

const processArticle = async (articlePath: string) => {
  const mdFile = (await fs.readdir(articlePath))
    .find(f => f.endsWith('.md') && f !== 'attachment.md');
    
  if (!mdFile) throw new Error('No markdown file found');

  const rawContent = await fs.readFile(path.join(articlePath, mdFile), 'utf-8');
  const { metadata, content } = await extractMetadataAndContent(rawContent);

  const { data: authorData } = await supabase
    .from('authors')
    .select('id, pen_name')
    .eq('pen_name', metadata.author?.trim())
    .single();

  const featuredImagePath = metadata.featured_image && path.join(articlePath, metadata.featured_image);
  const featuredImageUrl = featuredImagePath ? await uploadImage(featuredImagePath) : null;
  const processedContent = await processImages(articlePath, content);

  const articleData = {
    slug: path.basename(articlePath).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: path.basename(mdFile, '.md').replace(/[-_]/g, ' '),
    author: authorData?.pen_name || metadata.author?.trim(),
    author_id: authorData?.id || null,
    category: metadata.category?.trim() || 'Uncategorized',
    date: metadata.date?.replace(/["']/g, '').trim() || '2025',
    reading_time: metadata.reading_time?.trim() || '5 min read',
    subtitle: metadata.subtitle_quote?.trim() || null,
    summary: metadata.summary?.trim() || null,
    content: processedContent.trim(),
    featured_image: featuredImageUrl
  };

  const { data: insertedArticle, error: articleError } = await supabase
    .from('articles')
    .insert(articleData)
    .select()
    .single();

  if (articleError) throw articleError;

  const { error: engagementError } = await supabase
    .from('article_engagement')
    .insert({
      article_id: insertedArticle.id,
      views: 0,
      likes: 0,
      comments: 0
    });

  if (engagementError) throw engagementError;

  return insertedArticle;
};

export const processAllArticles = async (articlesDir: string) => {
  const folders = await fs.readdir(articlesDir);
  const results = [];

  for (const folder of folders) {
    const fullPath = path.join(articlesDir, folder);
    if (!(await fs.stat(fullPath)).isDirectory()) continue;

    try {
      const result = await processArticle(fullPath);
      results.push({ path: fullPath, success: true, data: result });
    } catch (error) {
      results.push({ path: fullPath, success: false, error });
    }
  }

  return results;
}