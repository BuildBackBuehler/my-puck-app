import { ComponentConfig } from "@measured/puck";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArticleWithEngagement } from "@/utils/types/database";

export type ArchiveGridProps = {
  batchSize: number;
  gridGap: string;
  articles: ArticleWithEngagement[];
};

export const ArchiveGrid: ComponentConfig<ArchiveGridProps> = {
  fields: {
    batchSize: { type: "number" },
    gridGap: {
      type: "select",
      options: ["1rem", "2rem", "3rem"].map(gap => ({
        label: gap,
        value: gap
      }))
    },
    articles: {
      type: "array",
      arrayFields: {
        id: { type: "text" },
        slug: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "text" },
        summary: { type: "text" },
        category: { type: "text" },
        featured_image: { type: "text" },
        engagement: {
          type: "object",
          objectFields: {
            views: { type: "number" },
            likes: { type: "number" },
            comments: { type: "number" },
            article_id: { type: "text" },
          }
        },
        author: { type: "text" },
        date: { type: "text" },
        reading_time: { type: "text" },
        content: { type: "text" },
      }
    }
  },

  defaultProps: {
    batchSize: 9,
    gridGap: "2rem",
    articles: []
  },

  render: ({ articles = [], batchSize = 9, gridGap = "2rem" }) => (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {!articles.length ? (
        <div className="text-center p-8 text-adaptive-secondaryAlt">
          No articles available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pr-1" style={{ gap: gridGap }}>
          {articles.slice(0, batchSize).map(article => (
            <article key={article.id} className="flex flex-col rounded-lg overflow-hidden shadow-lg hover:bg-adaptive-primaryAlt hover:shadow-xl">
              <Link href={`/articles/${article.slug}`}>
                {article.featured_image && (
                  <div className="relative h-48">
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4 flex-1">
                  <h2 className="text-xl font-bold">{article.title}</h2>
                  <h3 className="text-sm italic text-adaptive-accent mb-2 line-clamp-2">{article.subtitle}</h3>
                  {article.summary && (
                    <p className="text-base text-adaptive-secondaryAlt mb-4 line-clamp-[8]">
                      {article.summary}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-adaptive-accent">{article.category}</span>
                    <div className="flex gap-4 text-sm text-adaptive-secondaryAlt">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4" />
                        {article.engagement?.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4" />
                        {article.engagement?.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4" />
                        {article.engagement?.comments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
};