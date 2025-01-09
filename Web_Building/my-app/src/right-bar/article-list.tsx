import Link from 'next/link';
import { ComponentConfig, DropZone } from "@measured/puck";
import { Eye, Heart, MessageCircle } from 'lucide-react';

export interface ArticleListProps {
  articles: {
    id: string;
    number: number;
    title: string;
    date: string;
    summary: string;
    link: string;
    engagement: {
      views: number;
      likes: number;
      comments: number;
      showStats?: boolean;
    }
  }[];
  maxArticles?: number;
  showDivider?: boolean;
}

export const ArticleList: ComponentConfig<ArticleListProps> = {
  fields: {
    articles: {
      type: "array",
      arrayFields: {
        id: { type: "text" },
        number: { type: "number" },
        title: { type: "text" },
        date: { type: "text" },
        summary: { type: "textarea" },
        link: { type: "text" },
        engagement: {
          type: "object",
          objectFields: {
            views: { type: "number" },
            likes: { type: "number" },
            comments: { type: "number" },
            showStats: {
              type: "radio",
              options: [
                { label: "Show", value: "true" },
                { label: "Hide", value: "false" }
              ]
            }
          }
        }
      }
    },
    maxArticles: { type: "number" },
    showDivider: {
      type: "radio",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" }
      ]
    }
  },
  defaultProps: {
    maxArticles: 5,
    showDivider: true,
    articles: Array(5).fill({}).map((_, i) => ({
      id: `article-${i}`,
      number: i + 1,
      title: `Article ${i + 1}`,
      date: "12.06.2021",
      summary: "Sample summary text",
      link: `/article/${i + 1}`,
      engagement: {
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        showStats: true
      }
    }))
  },
  render: ({ articles, maxArticles = 5, showDivider }) => (
    <section className="h-[80vh] overflow-y-auto scrollbar-hide xs:scrollbar-default">
      {showDivider === true && (
        <div>
          {articles.slice(0, maxArticles).map((_, index) => (
            index !== maxArticles - 1 && (
              <div key={index} className="absolute w-px h-16 bg-transparent" style={{
                top: `calc(${(100 / maxArticles) * (index + 1)}% - 8rem)`
              }} />
            )
          ))}
        </div>
      )}
      <div className="space-y-4 md:space-y-8 lg:space-y-16">
        {articles.slice(0, maxArticles).map((article) => (
          <article key={article.id} className="relative pl-2 md:pl-8 lg:pl-16">
            <div className="flex justify-between mb-4">
              <span className="font-display text-4xl lg:text-8xl text-adaptive-secondaryAlt select-none">
                {article.number}
              </span>
              <div className="sm:mt-4 flex flex-col items-end justify-end gap-1 pb-2">
                <time className="pr-1 md:pr-2 lg:pr-4 font-display text-3xs md:text-sm lg:text-base text-adaptive-secondaryAlt" dateTime={article.date}>
                  {article.date}
                </time>
                {article.engagement?.showStats === true && (
                  <div className="pr-1 md:pr-2 lg:pr-4 flex gap-0.5 md:gap-1 lg:gap-2 text-adaptive-secondaryAlt text-3xs md:text-xs lg:text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-2 md:w-3 lg:w-4" />
                      <span>{article.engagement.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart 
                        className="w-2 md:w-3 lg:w-4 text-transparent fill-adaptive-accent dark:fill-adaptive-accent3" 
                      />
                      <span>{article.engagement.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-2 md:w-3.5 lg:w-4" />
                      <span>{article.engagement.comments}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1 md:space-y-2 lg:space-y-4">
              <h2>
                <Link 
                  href={article.link}
                  className="font-serif text-base md:text-lg lg:text-3xl font-bold hover:text-adaptive-accent transition-all"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="font-sans text-xs md:text-sm lg:text-base text-adaptive-secondaryAlt max-w-2xl">
                {article.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
      <DropZone zone="my-content 1" />
    </section>
  )
};