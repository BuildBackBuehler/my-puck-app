// src/components/featured/Header.tsx
import Link from 'next/link';
import { ComponentConfig } from "@measured/puck";

export interface FeaturedHeaderProps {
  title: string;
  linkText: string;
  linkUrl: string;
}

export const FeaturedHeader: ComponentConfig<FeaturedHeaderProps> = {
  fields: {
    title: { type: "text" },
    linkText: { type: "text" },
    linkUrl: { type: "text" }
  },
  defaultProps: {
    title: "Featured Articles",
    linkText: "See All",
    linkUrl: "/articles"
  },
  render: ({ title, linkText, linkUrl }) => (
    <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-4xl font-serif italic">{title}</h1>
          <Link 
            href={linkUrl}
            className="text-xl hover:text-gray-300 transition-all"
          >
            {linkText}
          </Link>
        </div>
      </nav>
      <div className="h-px bg-gray-800" />
    </header>
  )
};