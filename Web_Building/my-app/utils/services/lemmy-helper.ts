import { Login, LemmyHttp } from 'lemmy-js-client';
import { Database } from '@/utils/types/database';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' })

// Ensure these are set in your environment variables
const LEMMY_INSTANCE_URL = process.env.LEMMY_INSTANCE_URL || 'https://lemmy.world';
const LEMMY_USERNAME = process.env.LEMMY_BOT_USERNAME!;
const LEMMY_PASSWORD = process.env.LEMMY_BOT_PASSWORD!;
const LEMMY_COMMUNITY_ID = parseInt(process.env.LEMMY_COMMUNITY_ID!, 10);

export class LemmyPostService {
  private static client: LemmyHttp;
  private static authToken: string;

  private static async authenticate() {
    if (this.authToken) return this.authToken;

    const client = new LemmyHttp(LEMMY_INSTANCE_URL);
    
    try {
      const loginForm: Login = {
        username_or_email: LEMMY_USERNAME,
        password: LEMMY_PASSWORD,
      };

      const loginResponse = await client.login(loginForm);
      this.authToken = loginResponse.jwt;
      this.client = client;

      return this.authToken;
    } catch (error) {
      console.error('Lemmy authentication failed:', error);
      throw new Error('Failed to authenticate with Lemmy');
    }
  }

  static async createPostFromArticle(article: {
    title: string, 
    content: string, 
    slug: string,
    category?: string
  }) {
    // Ensure authentication
    await this.authenticate();

    // Prepare post body
    const postBody = `
## ${article.title}

${article.content}

[Read full article](${process.env.SITE_URL}/articles/${article.slug})
    `.trim();

    try {
      const postResponse = await this.client.createPost({
        name: article.title,
        body: postBody,
        community_id: LEMMY_COMMUNITY_ID,
        url: `${process.env.SITE_URL}/articles/${article.slug}`,
        auth: this.authToken
      });

      return postResponse.post_view.post.id;
    } catch (error) {
      console.error('Failed to create Lemmy post:', error);
      throw new Error('Failed to create Lemmy post');
    }
  }
}

// Supabase client for updating article with Lemmy post ID
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_KEY!
);

export async function updateArticleWithLemmyPostId(
  articleId: string, 
  lemmyPostId: number
) {
  const { error } = await supabase
    .from('articles')
    .update({ lemmy_post_id: lemmyPostId })
    .eq('id', articleId);

  if (error) {
    console.error('Failed to update article with Lemmy post ID:', error);
    throw error;
  }
}