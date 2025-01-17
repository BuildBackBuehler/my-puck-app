// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://lotuswav.es',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api']
      }
    ],
    additionalSitemaps: [
      'https://lotuswav.es/sitemap-articles.xml',
      'https://lotuswav.es/sitemap-authors.xml'
    ]
  },
  transform: async (config, path) => {
    // Custom transformation for dynamic routes
    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString()
    }
  }
}