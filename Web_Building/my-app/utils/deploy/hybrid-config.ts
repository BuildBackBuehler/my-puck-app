interface HybridDeploymentConfig {
    vercel: {
      routes: {
        source: string;
        destination?: string;
        has?: { type: string; key: string }[];
      }[];
      ignorePatterns: string[];
    };
    cloudflare: {
      routes: {
        pattern: string;
        zone_id: string;
        custom_domain?: string;
      }[];
      ignorePatterns: string[];
    };
  }
  
  export const hybridConfig: HybridDeploymentConfig = {
    vercel: {
      routes: [
        // Dynamic routes go to Vercel
        {
          source: '/api/:path*',
          destination: '/api/:path*'
        },
        {
          source: '/admin/:path*',
          destination: '/admin/:path*'
        },
        // Forward static assets to Cloudflare
        {
          source: '/_next/static/:path*',
          destination: 'https://your-cloudflare-domain.com/_next/static/:path*'
        }
      ],
      ignorePatterns: [
        'public/**/*',
        '.next/static/**/*',
        'out/**/*'
      ]
    },
    cloudflare: {
      routes: [
        {
          pattern: '/_next/static/*',
          zone_id: process.env.CLOUDFLARE_ZONE_ID!
        },
        {
          pattern: '/static/*',
          zone_id: process.env.CLOUDFLARE_ZONE_ID!
        }
      ],
      ignorePatterns: [
        'api/**/*',
        'admin/**/*',
        'articles/**/*'
      ]
    }
  };