import { supabase } from '../supabase/client';

export const getStorageUrl = async (bucketName: string, path: string, needsSignedUrl: boolean) => {
  if (needsSignedUrl) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 31536000); // 1 year expiration
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  }
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);
    
  return data.publicUrl;
};

export const insertCarouselImages = async (
  bucketName: string,
  containerName: string,
  images: { path: string; caption: string; order: number; signedURL: boolean }[]
) => {
  // Wait for all URLs to be generated
  const imageRecords = await Promise.all(
    images.map(async ({ path, caption, order, signedURL }) => ({
      image_url: await getStorageUrl(bucketName, path, signedURL),
      caption,
      container_name: containerName,
      order
    }))
  );

  const { error } = await supabase
    .from('carousel_images')
    .insert(imageRecords);

  if (error) throw error;
};