import { ComponentConfig } from "@measured/puck";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { ArticleWithEngagement } from "@/utils/types/database";
import { Circle } from "./circle";

export type ArticleListProps = {
  maxArticles?: number;
  articles?: ArticleWithEngagement[];
};

export const ArticleList: ComponentConfig<ArticleListProps> = {
  fields: {
    maxArticles: { type: "number" },
  },

  defaultProps: {
    maxArticles: 5,
  },

  resolveData: async ({ props }) => {
    const { data: articlesData } = await supabase
      .from('articles')
      .select(`
        *,
        author:author_id(
          id,
          pen_name,
          avatar_url
        ),
        engagement:article_engagement(*)
      `)
      .order('date', { ascending: false })
      .limit(props.maxArticles || 5);

    return {
      props: {
        ...props,
        articles: articlesData
      }
    };
  },

  render: ({ articles = [], maxArticles = 5 }) => {
    if (!articles?.length) {
      return (
        <div className="text-center p-8 text-adaptive-secondaryAlt">
          No articles available
        </div>
      );
    }

    return (
      <section className="h-[80vh] overflow-y-auto scrollbar-hide xs:scrollbar-default">
          <div>
            {articles.map((_, index) => (
              index !== maxArticles - 1 && (
                <div 
                  key={index} 
                  className="absolute w-px h-16 bg-transparent" 
                  style={{
                    top: `calc(${(100 / maxArticles) * (index + 1)}% - 8rem)`
                  }} 
                />
              )
            ))}
          </div>

        <div className="space-y-4 md:space-y-8 lg:space-y-16">
          {articles.map((article, index) => (
            <article key={article.id} className="relative pl-1 md:pl-2 lg:pl-4">
              <div className="flex justify-between mb-4">
                <span className="font-display text-4xl lg:text-8xl text-adaptive-secondaryAlt select-none">
                  {index + 1}
                </span>
                <div className="sm:mt-4 flex flex-col items-end justify-end gap-1 pb-2">
                  <time className="pr-1 md:pr-2 lg:pr-4 font-display text-3xs md:text-sm lg:text-base text-adaptive-secondaryAlt">
                    {article.date}
                  </time>
                  <div className="pr-1 md:pr-2 lg:pr-4 flex gap-0.5 md:gap-1 lg:gap-2 text-adaptive-secondaryAlt text-3xs md:text-xs lg:text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-2 md:w-3 lg:w-4" />
                      <span>{article.engagement?.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-2 md:w-3 lg:w-4 text-transparent fill-adaptive-accent" />
                      <span>{article.engagement?.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-2 md:w-3.5 lg:w-4" />
                      <span>{article.engagement?.comments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gap-2 md:gap-5 lg:gap-8">
                <h2>
                  <Link 
                    href={`/articles/${article.slug}`}
                    className="font-serif text-base md:text-lg lg:text-3xl font-bold hover:text-adaptive-accent transition-all"
                  >
                    {article.title}
                  </Link>
                </h2>
                <h3 className="font-sans italic text-xs md:text-sm lg:text-base text-adaptive-secondaryAlt line-clamp-1 lg:-mt-1">
                  {article.subtitle}
                </h3>
                <p className="font-sans text-xs md:text-sm lg:text-base text-adaptive-secondaryAlt max-w-2xl line-clamp-4 mt-1 md:mt-2 lg:mt-4">
                  {article.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
        <Circle.render
            title="Leave Your Old Life Behind"
            subtitle="Explore"
            blurb="Don't try to be like someone else, be yourself. Be secure with yourself."
            className="hidden lg:block absolute w-full max-w-3xl aspect-[2/1]"
          />
      </section>
    );
  }
};