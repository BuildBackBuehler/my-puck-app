import { exec } from 'child_process';
import { hybridConfig } from './hybrid-config';

export class HybridDeployment {
  private vercelToken: string;
  private cloudflareToken: string;

  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN!;
    this.cloudflareToken = process.env.CLOUDFLARE_API_TOKEN!;
  }

  async deploy() {
    // 1. Build project
    await this.buildProject();

    // 2. Deploy static assets to Cloudflare
    await this.deployToCloudflare();

    // 3. Deploy dynamic app to Vercel
    await this.deployToVercel();

    // 4. Configure routing
    await this.setupRouting();
  }

  private async buildProject() {
    await exec('next build');
  }

  private async deployToCloudflare() {
    const response = await fetch('https://api.cloudflare.com/client/v4/pages/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.cloudflareToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: process.env.PROJECT_NAME,
        production_branch: 'main',
        build_config: {
          build_command: null, // We'll handle the build
          destination_dir: '.next/static',
        }
      })
    });

    return response.json();
  }

  private async deployToVercel() {
    const { execSync } = require('child_process');
    execSync('vercel deploy --prod', { stdio: 'inherit' });
  }

  private async setupRouting() {
    // Configure Vercel routes
    const vercelConfig = {
      version: 2,
      routes: hybridConfig.vercel.routes
    };

    await exec(`echo '${JSON.stringify(vercelConfig, null, 2)}' > vercel.json`);

    // Configure Cloudflare routes
    for (const route of hybridConfig.cloudflare.routes) {
      await fetch(`https://api.cloudflare.com/client/v4/zones/${route.zone_id}/workers/routes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.cloudflareToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(route)
      });
    }
  }
}
