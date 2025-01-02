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
      <div className="space-y-16">
        {articles.slice(0, maxArticles).map((article) => (
          <article key={article.id} className="relative pl-16">
            <div className="flex justify-between mb-4">
              <span className="font-display text-8xl text-adaptive-secondaryAlt select-none">
                {article.number}
              </span>
              <div className="flex flex-col items-end justify-end gap-1 pb-2">
                <time className="pr-4 font-display text-md text-adaptive-secondaryAlt" dateTime={article.date}>
                  {article.date}
                </time>
                {article.engagement?.showStats === true && (
                  <div className="pr-4 flex gap-2 text-adaptive-accent text-sm">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{article.engagement.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      <span>{article.engagement.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{article.engagement.comments}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h2>
                <Link 
                  href={article.link}
                  className="font-serif text-5xl hover:text-adaptive-accent transition-all"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="font-display text-lg text-adaptive-secondaryAlt max-w-2xl">
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