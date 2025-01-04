// utils/image.ts
type TransformOptions = {
  width?: number
  height?: number
  quality?: number
  format?: 'origin' | 'webp'
}

export function getTransformedImageUrl(url: string, options: TransformOptions = {}) {
  if (!url) return ''
  
  // Create the transformation parameters
  const params = new URLSearchParams()
  
  if (options.width) params.append('width', options.width.toString())
  if (options.height) params.append('height', options.height.toString())
  if (options.quality) params.append('quality', options.quality.toString())
  if (options.format) params.append('format', options.format)
  
  // Add the transform query parameter to the URL
  return `${url}?${params.toString()}`
}

// Usage example:
const imageUrl = getTransformedImageUrl(article.image_url, {
  width: 800,
  height: 400,
  quality: 80,
  format: 'webp'
})