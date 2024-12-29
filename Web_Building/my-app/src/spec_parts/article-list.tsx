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
};

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
    maxArticles: { type: "number" }
  },
  defaultProps: {
    maxArticles: 5,
    articles: Array(5).fill({}).map((_, i) => ({
      id: `article-${i}`,
      number: i + 1, 
      title: `Article ${i + 1}`,
      date: "12.06.2021",
      summary: "Sample summary text",
      link: `/article/${i + 1}`
    }))
  },
  render: ({ articles, maxArticles = 5 }) => (
    <section className="py-12 space-y-16">
      {articles.slice(0, maxArticles).map((article) => (
        <article key={article.id} className="group relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-8xl font-bold opacity-80 select-none">
              {article.number}
            </span>
            <time className="text-xl text-gray-400" dateTime={article.date}>
              {article.date}
            </time>
          </div>
          <div className="space-y-4">
            <h2>
              <Link 
                href={article.link}
                className="text-4xl font-bold hover:text-gray-300 transition-all"
              >
                {article.title}
              </Link>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl">
              {article.summary} 
            </p>
          </div>
        </article>
      ))}
    </section>
  )
};