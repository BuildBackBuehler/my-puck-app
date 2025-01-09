module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    return config;
  },
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: [
      `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co` 
    ],
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
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/random/800x600',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'uywhaywnylcjrvkcsdem.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/Images',
        search: '**',
      },
    ]
  },
};


