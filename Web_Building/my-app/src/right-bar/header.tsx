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
    <header className="flex-grow sticky top-0 z-10">
      <nav className="max-w-7xl md:mx-auto px-2 md:px-6 lg:px-8">
        <div className="flex justify-center items-center pt-4 md:justify-between md:items-end lg:pt-[4.75vh] md:pb-2">
          <h1 className="text-sm sm:text-center md:text-xl lg:text-3xl font-serif italic">{title}</h1>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-3 h-3 lg:w-4 lg:h-4 bg-adaptive-secondary rounded-full" />
            <Link 
              href={linkUrl}
              className="text-base lg:text-2xl underline-offset-1 hover:text-adaptive-accent transition-all"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </nav>
      <div className="mx-4 self-center px-8 h-px bg-adaptive-secondaryAlt" />
      <div className="md:hidden flex items-center gap-2 px-4">
            <span className="w-2 h-2 lg:w-4 lg:h-4 bg-adaptive-secondary rounded-full" />
            <Link 
              href={linkUrl}
              className="text-sm underline-offset-1 hover:text-adaptive-accent transition-all"
            >
              {linkText}
            </Link>
          </div>
    </header>
  )
};