export function WebsiteJsonLd() {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Website',
      name: 'Lemmy',
      url: 'https://yourdomain.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://yourdomain.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  }
  