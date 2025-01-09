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
            src: { type: "text" },
            alt: { type: "text" }
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
    batchSize: { type: "number" },
    gridGap: { type: "text" }
  },

  defaultProps: {
    articles: Array(6).fill({}).map((_, i) => ({
      id: `article-${i}`,
      image: {
        src: "/translogo3000.png",
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
          const lastBatchIndex = Math.floor(visibleItems / batchSize) * batchSize;
          if (entries[0].isIntersecting && lastBatchIndex < articles.length) {
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
          <div className="h-[calc(100vh-12rem)] overflow-y-auto">
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              style={{ gap: gridGap }}
            >
              {articles.slice(0, visibleItems).map((article, index) => (
                <article 
                  key={`${article.id}-${index}`} 
                  className="flex flex-col rounded-lg overflow-hidden shadow-lg"
                >
                  {/* Article content */}
                </article>
              ))}
            </div>
            
            {visibleItems < articles.length && (
              <div 
                ref={observerTarget}
                className="h-16 mt-4"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    );
  }
};