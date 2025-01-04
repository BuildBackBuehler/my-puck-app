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
    <header className="flex-grow sticky top-0 backdrop-blur-sm z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end pt-14 pb-2">
          <h1 className="text-3xl font-serif italic">{title}</h1>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-adaptive-secondary rounded-full" />
            <Link 
              href={linkUrl}
              className="text-2xl underline-offset-1 hover:text-adaptive-accent transition-all"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </nav>
      <div className="mx-4 self-center px-8 h-px bg-adaptive-secondaryAlt" />
    </header>
  )
};