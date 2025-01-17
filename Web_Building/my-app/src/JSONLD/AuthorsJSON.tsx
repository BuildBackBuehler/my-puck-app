export function ProfilePageJsonLd({ profile }) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        '@id': `https://yourdomain.com/about/${profile.slug}`,
        name: profile.name,
        image: profile.avatar_url,
        description: profile.bio,
        jobTitle: profile.occupation,
        email: profile.email,
        sameAs: [
          profile.linkedin_url,
          profile.instagram_url,
          profile.rss_url,
          profile.email_url
        ],
        memberOf: {
          '@type': 'Organization',
          name: 'Lemmy',
          url: 'https://yourdomain.com'
        },
        knowsAbout: [
          // Converting skills and interests into structured data
          ...profile.skills.map(skill => ({
            '@type': 'Thing',
            name: skill
          })),
          // Adding philosophical interests
          ...profile.interests.map(interest => ({
            '@type': 'Thing',
            name: interest
          }))
        ],
        // Adding work experience
        hasOccupation: profile.occupations.map(occupation => ({
          '@type': 'Occupation',
          name: occupation.title,
          description: occupation.description,
          qualifications: occupation.qualifications
        }))
      },
      // Adding content authored by this person
      about: {
        '@type': 'ItemList',
        itemListElement: profile.articles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            headline: article.title,
            url: `https://yourdomain.com/articles/${article.slug}`
          }
        }))
      }
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  }