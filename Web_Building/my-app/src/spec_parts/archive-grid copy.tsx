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
  subtitle: string;
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
        subtitle: { type: "text" },
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
      subtitle: "Article subtitle",
      author: "Author Name",
      readTime: "5 min read",
      date: "12.06.2021",
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
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3" style={{ gap: gridGap }}>
            {articles.slice(0, visibleItems).map((article, index) => (
              <article 
                key={`${article.id}-${index}`} 
                className="flex flex-col rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative group h-full">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {article.image ? (
                      <>
                        <Image
                          src={article.image.src}
                          alt={article.image.alt || "Article thumbnail"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-adaptive-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                          <p 
                            className="text-lg font-semibold text-adaptive-secondary line-clamp-4"
                            style={{ 
                              textShadow: `
                                -2px -2px 0 adaptive-primary,  
                                2px -2px 0 adaptive-primary,
                                -2px 2px 0 adaptive-primary,
                                2px 2px 0 adaptive-primary
                              `
                            }}
                          >
                            {article.summary}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-secondaryAlt">No image available</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-grow p-4 space-y-3">
                    <h2 className="text-xl font-semibold line-clamp-2">
                      <Link 
                        href={article.link || '#'} 
                        className="font-display hover:text-adaptive-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    
                    <p className="text-sm text-adaptive-secondary line-clamp-2">
                      {article.subtitle}
                    </p>
                    
                    <div className="font-serif flex justify-between text-sm text-adaptive-secondary">
                      <span>{article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>

                  <div className="mt-auto pt-4 border-t border-adaptive-secondaryAlt">
                    <div className="flex justify-between items-center px-4">
                      <time className="text-sm text-adaptive-secondary">
                        {article.date}
                      </time>
                      
                      <div className="flex items-center space-x-2 text-xs text-adaptive-secondary">
                        <span className="inline-flex items-center gap-1">
                          <Eye size={12}/> {article?.engagement?.views ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Heart size={12} className="fill-adaptive-accent text-transparent"/> {article?.engagement?.likes ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={12}/> {article?.engagement?.comments ?? 0}
                        </span>
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