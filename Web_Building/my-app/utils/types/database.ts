// types/database.ts

export interface CarouselImage {
  id: string; // UUID as a string
  image_url: string; // URL of the image
  caption: string; // Caption for the image
  container_name: string; // Name of the container
  order: number; // Order of the image
  created_at: string; // Timestamp (ISO string format)
  signedURL?: boolean; // Optional: indicates if the URL is signed
  path: string; // Path of the image in storage
}