// src/components/JsonLd/index.tsx - Create a central file for all JSON-LD components
import { ComponentConfig } from "@measured/puck";
import { ArticleJsonLd } from "./ArticleJSON";
import { ProfilePageJsonLd } from "./AuthorsJSON";
import { ArtistProfileJsonLd } from "./ArtistJSON";

// First, define TypeScript interfaces for our props
export interface JSONLDProps {
  pageType?: 'home' | 'article' | 'archive' | 'about' | 'essentials' | 'arts' | 'manifesto';
  pageData?: any; // You can make this more specific based on your data structure
  children?: React.ReactNode; // Add children to the interface
}

// Then create our JSON-LD components as before
function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: 'Lemmy',
    url: 'https://yourdomain.com'
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Modify the config to safely handle props
export const JSONLD: ComponentConfig<JSONLDProps> = {
  fields: {
    pageType: {
      type: 'select',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Article', value: 'article' },
        { label: 'Archive', value: 'archive' },
        { label: 'About', value: 'about' },
        { label: 'Essentials', value: 'essentials' },
        { label: 'Arts', value: 'arts' },
        { label: 'Manifesto', value: 'manifesto' }
      ]
    },
    pageData: {
      type: 'external',
      // Configure this based on your data source
      fetchList: async () => {
        // Your data fetching logic
        return [];
      }
    }
  },

  defaultProps: {
    pageType: 'home',
    pageData: null
  },

  // Use a more defensive rendering approach
  render: (props) => {
    // Safely destructure props with defaults
    const { pageType = 'home', pageData = null, children } = props;

    return (
      <div>
        {/* Always render the website schema */}
        <WebsiteJsonLd />
        
        {/* Conditionally render other schemas based on pageType */}
        {pageType === 'article' && pageData && (
          <ArticleJsonLd article={pageData} />
        )}
        
        {pageType === 'about' && pageData && (
          <ProfilePageJsonLd profile={pageData} />
        )}
        
        {pageType === 'arts' && pageData && (
          <ArtistProfileJsonLd artist={pageData} />
        )}
        
        {/* Render the page content */}
        {children}
      </div>
    );
  }
};