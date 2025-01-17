export function ArtistProfileJsonLd({ artist }) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        '@id': `https://yourdomain.com/arts/${artist.slug}`,
        name: artist.name,
        image: artist.images,
        description: artist.bio,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://yourdomain.com/arts/${artist.slug}`
        }
      }
    }
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  }