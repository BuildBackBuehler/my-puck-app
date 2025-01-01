import { ComponentConfig } from "@measured/puck";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface ArticleData {
  id: string;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  author: string;
  readTime: string;
  date: string;
  summary: string;
  link: string;
  engagement: {
    views: number;
    likes: number;
    comments: number;
  };
}

export interface ArchiveGridProps {
  articles: ArticleData[];
  batchSize?: number;
  gridGap?: string;
}

export const ArchiveGrid: ComponentConfig<ArchiveGridProps> = {
  fields: {
    articles: {
      type: "array",
      arrayFields: {
        id: { type: "text" },
        image: {
          type: "object",
          objectFields: {
            src: { type: "text", defaultValue: "/placeholder.jpg" },
            alt: { type: "text", defaultValue: "Article thumbnail" }
          }
        },
        title: { type: "text" },
        author: { type: "text" },
        readTime: { type: "text" },
        date: { type: "text" },
        summary: { type: "textarea" },
        link: { type: "text" },
        engagement: {
          type: "object",
          objectFields: {
            views: { type: "number" },
            likes: { type: "number" },
            comments: { type: "number" }
          }
        }
      }
    },
    batchSize: { type: "number", defaultValue: 9 },
    gridGap: { type: "text", defaultValue: "2rem" }
  },

  defaultProps: {
    articles: Array(6).fill({}).map((_, i) => ({
      id: `article-${i}`,
      image: {
        src: "/placeholder.jpg",
        alt: "Article thumbnail"
      },
      title: `Article ${i + 1}`,
      author: "Author Name",
      readTime: "5 min read",
      date: new Date().toISOString(),
      summary: "Article summary goes here...",
      link: "#",
      engagement: {
        views: 0,
        likes: 0,
        comments: 0
      }
    })),
    batchSize: 9,
    gridGap: "2rem"
  },

  render: ({ articles = [], batchSize = 9, gridGap = "2rem" }) => {
    const [visibleItems, setVisibleItems] = useState(batchSize);
    const observerTarget = useRef(null);

    useEffect(() => {
      if (!articles?.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && visibleItems < articles.length) {
            setVisibleItems(prev => Math.min(prev + batchSize, articles.length));
          }
        },
        { threshold: 0.1 }
      );

      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }

      return () => observer.disconnect();
    }, [visibleItems, articles?.length, batchSize]);

    if (!articles?.length) return null;

    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: gridGap }}>
            {articles.slice(0, visibleItems).map((article, index) => (
              <article 
                key={`${article.id}-${index}`} 
                className="flex flex-col rounded-lg overflow-hidden bg-white shadow-lg dark:bg-gray-800"
              >
                <div className="relative h-48">
                  {article?.image?.src ? (
                    <Image
                      src={article.image.src}
                      alt={article.image.alt || "Article thumbnail"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-grow p-4 space-y-4">
                  <h2 className="text-xl font-semibold line-clamp-2">
                    <Link 
                      href={article.link || '#'} 
                      className="hover:text-adaptive-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  
                  <div className="flex justify-between text-sm text-adaptive-secondary">
                    <span>{article.author}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <p className="text-sm text-adaptive-secondary line-clamp-3">
                    {article.summary}
                  </p>

                  <div className="mt-auto pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <time className="text-sm text-adaptive-secondary">
                        {article.date}
                      </time>
                      
                      <div className="flex items-center space-x-3 text-xs text-adaptive-secondary">
                        <span className="inline-flex items-center gap-1">
                          <Eye size={12}/> {article?.engagement?.views ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Heart size={12}/> {article?.engagement?.likes ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={12}/> {article?.engagement?.comments ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {visibleItems < articles.length && (
          <div ref={observerTarget} className="h-4 mt-8" />
        )}
      </div>
    );
  }
};