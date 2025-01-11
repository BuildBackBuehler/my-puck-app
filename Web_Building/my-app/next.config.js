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
};


