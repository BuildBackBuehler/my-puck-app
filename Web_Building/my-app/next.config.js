/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    // Add source maps for better error traces
    if (!isServer && !dev) {
      config.devtool = 'source-map'
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
  },
  images: {
    domains: [
      'uywhaywnylcjrvkcsdem.supabase.co'
    ],
    formats: ['image/webp']
  },
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/articles',
        has: [{ type: 'query', key: 'page' }],
        destination: '/articles/page/:page',
        permanent: true
      }
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/articles/:slug',
          destination: '/api/articles/:slug'
        }
      ]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo-source.imgix.net',
        port: '',
        pathname: '/puppy.jpg',
        search: '',
      },     
      { 
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`, 
        port: '',
        pathname: '/storage/v1/object/public/Images',   
        search: '**',
      }, 
      { 
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`, 
        port: '',
        pathname: '',   
        search: '**',
      }, 
      {
        protocol: 'https',
        hostname: 'uywhaywnylcjrvkcsdem.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: 'https',
        hostname: 'uywhaywnylcjrvkcsdem.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ]
  },
}


