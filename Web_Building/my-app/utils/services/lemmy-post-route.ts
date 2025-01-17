import { NextApiRequest, NextApiResponse } from 'next';
import { LemmyPostService, updateArticleWithLemmyPostId } from '@/utils/services/lemmy-helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Validate request body
  const { 
    id, 
    title, 
    content, 
    slug 
  } = req.body;

  // Validate required fields
  if (!id || !title || !content || !slug) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      requiredFields: ['id', 'title', 'content', 'slug']
    });
  }

  // Validate API key if using one
  const apiKey = req.headers['x-api-key'];
  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Create Lemmy post
    const lemmyPostId = await LemmyPostService.createPostFromArticle({
      title,
      content,
      slug
    });

    // Update article with Lemmy post ID
    await updateArticleWithLemmyPostId(id, lemmyPostId);

    return res.status(200).json({ 
      message: 'Lemmy post created successfully', 
      lemmyPostId 
    });
  } catch (error) {
    console.error('Error creating Lemmy post:', error);
    return res.status(500).json({ 
      message: 'Failed to create Lemmy post', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};