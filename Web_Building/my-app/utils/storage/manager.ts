import { StorageConfig } from '../types/database';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

export class StorageManager {
  private supabase: any;
  private r2: S3Client;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
    this.supabase = createClient(config.supabase.url, config.supabase.key);
    
    // Initialize R2 client
    this.r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.cloudflare.apiToken,
          secretAccessKey: config.cloudflare.apiToken
          }
              });
        }

  async upload(file: File | Buffer, options: {
    bucket: 'articles' | 'avatars' | 'images' | 'static' | 'cache';
    path: string;
    metadata?: Record<string, string>;
    cacheControl?: string;
  }) {
    // Route to appropriate storage based on bucket type
    if (['articles', 'avatars'].includes(options.bucket)) {
      return this.uploadToSupabase(file, options);
    } else {
      return this.uploadToR2(file, options);
    }
  }

  private async uploadToSupabase(file: File | Buffer, options: any) {
    const { data, error } = await this.supabase.storage
      .from(this.config.supabase.buckets[options.bucket])
      .upload(options.path, file, {
        metadata: options.metadata,
        cacheControl: options.cacheControl || '3600',
        upsert: true
      });

    if (error) throw error;
    return this.supabase.storage
      .from(this.config.supabase.buckets[options.bucket])
      .getPublicUrl(options.path);
  }

  private async uploadToR2(file: File | Buffer, options: any) {
    const buffer = file instanceof File ? 
      await file.arrayBuffer() : 
      file;

    await this.r2.send(new PutObjectCommand({
      Bucket: this.config.cloudflare.buckets[options.bucket],
      Key: options.path,
      Body: buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer,
      Metadata: options.metadata,
      CacheControl: options.cacheControl || 'max-age=31536000'
    }));

    return `https://${this.config.cloudflare.buckets[options.bucket]}.r2.dev/${options.path}`;
  }
}