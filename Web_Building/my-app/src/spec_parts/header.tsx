import Link from 'next/link';
import { ComponentConfig } from "@measured/puck";

export interface FeaturedHeaderProps {
  title: string;
  linkText: string;
  linkUrl: string;
  showDivider?: boolean;
}

export const FeaturedHeader: ComponentConfig<FeaturedHeaderProps> = {
  fields: {
    title: { type: "text" },
    linkText: { type: "text" },
    linkUrl: { type: "text" },
    showDivider: {
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false }
      ]
    }
  },
  defaultProps: {
    title: "Featured Articles",
    linkText: "See All",
    linkUrl: "/articles",
    showDivider: true
  },
  render: ({ title, linkText, linkUrl, showDivider }) => (
    <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-serif italic">{title}</h1>
          {showDivider && <div className="absolute left-0 top-0 w-px h-full bg-neutral-800" />}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-4 h-4 bg-white rounded-full" />
            <Link 
              href={linkUrl}
              className="text-xl underline-offset-1 hover:text-gray-300 transition-all"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </nav>
      <div className="h-px bg-gray-800" />
    </header>
  )
};