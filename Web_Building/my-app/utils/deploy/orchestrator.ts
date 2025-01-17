import { exec } from 'child_process';
import glob from 'fast-glob';
import fs from 'fs';
import { StorageManager } from '../storage/manager';
import { deploymentConfig } from './config';

export class DeploymentOrchestrator {
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
  }

  async deploy() {
    // 1. Build Next.js project
    await this.buildProject();

    // 2. Deploy static content to Cloudflare
    await this.deployToCloudflare();

    // 3. Deploy dynamic content to Supabase
    await this.deployToSupabase();
  }

  private async buildProject() {
    return new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });
  }

  private async deployToCloudflare() {
    // Find all static files
    const files = await glob(deploymentConfig.static.patterns, {
      ignore: deploymentConfig.static.excludePatterns
    });

    // Deploy to Cloudflare Pages
    const response = await fetch('https://api.cloudflare.com/client/v4/pages/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: process.env.PROJECT_NAME,
        production_branch: 'main',
        build_config: {
          build_command: 'npm run build',
          destination_dir: '.next',
          root_dir: '/'
        }
      })
    });

    return response.json();
  }

  private async deployToSupabase() {
    // Find all dynamic content files
    const files = await glob(deploymentConfig.dynamic.patterns);

    // Upload to appropriate Supabase buckets
    for (const file of files) {
      const bucket = this.getBucketForFile(file);
      if (!bucket) continue;

      const fileContent = await fs.promises.readFile(file);
      await this.storage.upload(fileContent, {
        bucket,
        path: file,
        metadata: { deployed: new Date().toISOString() }
      });
    }
  }

  private getBucketForFile(filepath: string): 'articles' | 'avatars' | 'images' | null {
    if (filepath.startsWith('articles/')) return 'articles';
    if (filepath.startsWith('authors/')) return 'avatars';
    if (filepath.startsWith('uploads/')) return 'images';
    return null;
  }
}