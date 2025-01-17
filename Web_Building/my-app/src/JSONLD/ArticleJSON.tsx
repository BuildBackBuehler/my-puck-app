export function ArticleJsonLd({ article }) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.summary,
      image: article.featured_image,
      datePublished: article.created_at,
      dateModified: article.updated_at,
      author: {
        '@type': 'Person',
        name: article.author?.pen_name,
        image: article.author?.avatar_url,
        url: `https://yourdomain.com/authors/${article.author_id}`
      },
      publisher: {
        '@type': 'Organization',
        name: 'Lemmy',
        logo: {
          '@type': 'ImageObject',
          url: 'https://yourdomain.com/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://yourdomain.com/articles/${article.slug}`
      },
      articleSection: article.category,
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/LikeAction',
          userInteractionCount: article.engagement?.likes || 0
        },
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/ViewAction',
          userInteractionCount: article.engagement?.views || 0
        }
      ]
    }
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  }
  