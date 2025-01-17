import { supabase } from '../supabase/client';

export const getStorageUrl = async (bucketName: string, path: string, needsSignedUrl: boolean) => {
  // For Supabase buckets
  if (['articles', 'avatars', 'images'].includes(bucketName)) {
    if (needsSignedUrl) {
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .createSignedUrl(path, 31536000);
      
      if (error) throw error;
      return data.signedUrl;
    }
    
    return this.supabase.storage
      .from(bucketName)
      .getPublicUrl(path)
      .data.publicUrl;
  }
  
  // For R2 buckets
  return `https://${bucketName}.r2.dev/${path}`;
}


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

