import { supabase } from "../lib/supabase"

// utils/upload.ts
export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}