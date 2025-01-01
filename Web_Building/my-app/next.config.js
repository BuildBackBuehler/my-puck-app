module.exports = {
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
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/random/800x600',
        search: '',
      },
    ],
  },
};

