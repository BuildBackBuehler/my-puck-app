import Link from 'next/link';
import { ComponentConfig } from "@measured/puck";

export interface ArticleListProps {
  articles: {
    id: string;
    number: number;
    title: string;
    date: string;
    summary: string;
    link: string
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
        link: { type: "text" }
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
    showDivider: "true",
    articles: Array(5).fill({}).map((_, i) => ({
      id: `article-${i}`,
      number: i + 1,
      title: `Article ${i + 1}`,
      date: "12.06.2021", 
      summary: "Sample summary text",
      link: `/article/${i + 1}`
    }))
  },
  render: ({ articles, maxArticles = 5, showDivider }) => (
    <section className="py-12 relative">
      {showDivider && (
        <div className="absolute left-0 top-0 w-px h-screen bg-neutral-800">
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
            <div className="flex justify-between items-center mb-4">
              <span className="font-display text-8xl opacity-80 select-none">
                {article.number}
              </span>
              <time className="font-sans text-md text-gray-400" dateTime={article.date}>
                {article.date}
              </time>
            </div>
            <div className="space-y-4">
              <h2>
                <Link 
                  href={article.link}
                  className="font-serif text-5xl hover:text-gray-300 transition-all"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="font-sans text-lg text-gray-300 max-w-2xl">
                {article.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
};