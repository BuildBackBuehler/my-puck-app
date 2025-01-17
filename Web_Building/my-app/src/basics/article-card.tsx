import { ComponentConfig } from "@measured/puck";
import Image from "next/image";
import Link from "next/link";
import { ArticleDialog } from "./article-dialog";
import type { ArticleDialogProps } from "./article-dialog";
import { ArticleWithEngagement } from "@/utils/types/database";
import { useArticle } from "@/utils/hooks/useArticles";


export type ArticleCardProps = {
  slug: string;
};

export const ArticleCard: ComponentConfig<ArticleCardProps> = {
  fields: {
    slug: { 
      type: "text",
      label: "Article Slug"
    }
  },

  defaultProps: {
    slug: "america-the-free"
  },

  render: ({ slug }) => {
    const { article, loading } = useArticle(slug);

    if (loading) {
      return <div className="animate-pulse">Loading...</div>;
    }

    if (!article) {
      return null;
    }
    
    return (
      <article className="overflow-hidden">
        <div className="h-screen flex flex-col justify-start py-8 space-y-1 px-3 lg:py-8 lg:space-y-2 lg:px-6">
          <h2 className="font-display text-4xl lg:text-9xl font-bold tracking-tight pt-4 lg:pt-4">
            {article.category}
          </h2>
          
          <time dateTime={article.date} className="block text-sm md:text-sm lg:text-2xl text-right pr-4">
            {article.date}
          </time>
          
          <div className="w-full h-px bg-adaptive-secondaryAlt" />
          
          {article.featured_image && (
            <div className="relative aspect-[2/1] overflow-hidden rounded-sm top-4 lg:rounded-lg lg:top-4">
              <Image 
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-2 md:gap-3">
            <h1 className="text-xl sm:text-center sm:max-md:text-center lg:text-left lg:text-4xl pl-4 lg:pl-0 font-bold text-adaptive-secondary hover:text-adaptive-accent focus:text-adaptive-accent transition-colors pt-4">
              <Link href={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h1>
            <h3 className="text-base italic text-adaptive-secondaryAlt pl-4 lg:pl-0 line-clamp-2 -mt-4">
              {article.subtitle}
            </h3>

            <div className="flex justify-between items-center">
              <span className="font-serif text-3xs md:text-xs lg:text-sm">
                {article.author.pen_name}
              </span>
              <span className="font-serif text-3xs md:text-xs lg:text-sm">
                {article.reading_time}
              </span>
            </div>

            <p className="font-sans text-sm lg:text-xl leading-loose line-clamp-5">
              {article.summary}
            </p>
          </div>
          
          <div className="w-full h-px bg-adaptive-secondaryAlt" />
          
          <div className="flex justify-end">
            <ArticleDialog.render slug={article.slug}
            />
          </div>
        </div>
      </article>
    );
  }
};