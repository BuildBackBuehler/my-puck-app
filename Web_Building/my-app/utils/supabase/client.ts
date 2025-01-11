import { createClient } from "@supabase/supabase-js";
import type { CarouselImage } from "../types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

export const supabase = createClient(supabaseUrl, supabaseKey);

  const isUrlExpired = (url: string): boolean => {
    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');
    if (!token) return true;
    
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  };

  export const refreshSignedUrl = async (bucketName: string, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 31536000); // 1 year
      
    if (error) throw error;
    return data.signedUrl;
  };


  export async function getAuthors() {
    const { data: authors, error } = await supabase
      .from('authors')
      .select('*')
      .order('created_at', { ascending: false })
  
    if (error) throw error
    return authors
  }

  export async function getAvatars() {
    const { data: avatar, error } = await supabase
      .from('authors_avatars')
      .select('*')
      .order('created_at', { ascending: false })
  
    if (error) throw error
    return avatar
  }

  export async function getArticles() {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
  
    if (error) throw error
    return articles
  }

  async function signInWithAccessToken(accessToken) {
    try {
      // Set the access token to authenticate the user
      await supabase.auth.setSession({
        access_token: `${process.env.accessToken}`,
        refresh_token: '',
      });
  
      // Now you can use the Supabase client to make authenticated requests
      const { data, error } = await supabase
        .from('your-table-name') // Replace with your actual table name
        .select('*');
  
      if (error) {
        console.error('Error fetching data:', error);
        return false;
      }
      console.log('Fetched data:', data);
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  export const getCarouselImages = async (containerName: string): Promise<CarouselImage[]> => {

    const { data, error } = await supabase
  
      .from('carousel_images')
  
      .select('*')
  
      .eq('container_name', containerName)
  
      .order('order', { ascending: true });
  
  
  
    if (error) {
  
      console.error('Error fetching carousel images:', error);
  
      return [];
  
    }
  
  
  
    return data as CarouselImage[];
  
  }