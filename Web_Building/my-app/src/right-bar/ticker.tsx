import { ComponentConfig } from "@measured/puck";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { clsx } from "clsx";

interface NewsItem {
  source: string;
  title: string;
  link: string;
}

export type TickerProps = {
  sources: {
    guardian: boolean;
    foreignPolicy: boolean;
    proPub: boolean;
  };
  guardianApiKey?: string;
  direction: "left" | "right";
  speed: "slow" | "medium" | "fast";
  pauseOnHover: boolean;
  theme: "light" | "dark";
  maxArticlesPerSource: number;
};

const speedMap = {
  slow: "40s",
  medium: "30s",
  fast: "20s"
};

export const Ticker: ComponentConfig<TickerProps> = {
  fields: {
    sources: {
      type: "object",
      objectFields: {
        guardian: {
          type: "radio",
          options: [
            { label: "Enable", value: true },
            { label: "Disable", value: false }
          ]
        },
        foreignPolicy: {
          type: "radio",
          options: [
            { label: "Enable", value: true },
            { label: "Disable", value: false }
          ]
        },
        proPub: {
          type: "radio",
          options: [
            { label: "Enable", value: true },
            { label: "Disable", value: false }
          ]
        }
      }
    },
    guardianApiKey: { type: "text" },
    direction: {
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" }
      ]
    },
    speed: {
      type: "select",
      options: [
        { label: "Slow", value: "slow" },
        { label: "Medium", value: "medium" },
        { label: "Fast", value: "fast" }
      ]
    },
    pauseOnHover: {
      type: "radio",
      options: [
        { label: "Pause", value: "true" },
        { label: "Continuous", value: "false" }
      ]
    },
    theme: {
      type: "select",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" }
      ]
    },
    maxArticlesPerSource: {
      type: "number",
      min: 1,
      max: 10
    }
  },

  defaultProps: {
    sources: {
      guardian: true,
      foreignPolicy: true,
      proPub: true
    },
    direction: "right",
    speed: "medium",
    pauseOnHover: true,
    theme: "light",
    maxArticlesPerSource: 3
  },

  render: ({ 
    sources, 
    guardianApiKey, 
    direction, 
    speed, 
    pauseOnHover, 
    theme,
    maxArticlesPerSource = 3
  }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [scrollWidth, setScrollWidth] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch Guardian news
    const fetchGuardianNews = async () => {
      if (!guardianApiKey || !sources.guardian) return [];
      try {
        const response = await window.fetch(
          `https://content.guardianapis.com/search?api-key=${guardianApiKey}&show-fields=headline,shortUrl&page-size=${maxArticlesPerSource}`
        );
        const data = await response.json();
        return data.response.results.map((item: any) => ({
          title: item.fields.headline,
          link: item.fields.shortUrl,
          source: "The Guardian"
        }));
      } catch (error) {
        console.error("Error fetching Guardian news:", error);
        return [];
      }
    };

    // Fetch ProPublica RSS
    const fetchProPubNews = async () => {
      if (!sources.proPub) return [];
      try {
        const response = await window.fetch(
          'https://www.propublica.org/feed/main',
          { 
            headers: { 
              Accept: 'application/rss+xml',
              'Content-Type': 'application/xml'
            }
          }
        );
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");
        
        return Array.from(items).slice(0, maxArticlesPerSource).map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          source: "ProPublica"
        }));
      } catch (error) {
        console.error("Error fetching ProPublica news:", error);
        return [];
      }
    };

    // Fetch Foreign Policy RSS
    const fetchFPNews = async () => {
      if (!sources.foreignPolicy) return [];
      try {
        const response = await window.fetch(
          'https://foreignpolicy.com/feed/',
          { 
            headers: { 
              Accept: 'application/rss+xml',
              'Content-Type': 'application/xml'
            }
          }
        );
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");
        
        return Array.from(items).slice(0, maxArticlesPerSource).map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          source: "Foreign Policy"
        }));
      } catch (error) {
        console.error("Error fetching Foreign Policy news:", error);
        return [];
      }
    };

    // Fetch all enabled news sources
    useEffect(() => {
      const fetchNews = async () => {
        if (typeof window === 'undefined') return; // Guard against SSR

        const [guardianNews, proPubNews, fpNews] = await Promise.all([
          fetchGuardianNews(),
          fetchProPubNews(),
          fetchFPNews()
        ]);

        setNewsItems([...guardianNews, ...proPubNews, ...fpNews]);
      };

      fetchNews();
      const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }, [sources, guardianApiKey]);

    useEffect(() => {
      if (!contentRef.current || !wrapperRef.current) return;
      
      const calculateWidth = () => {
        const contentWidth = contentRef.current?.offsetWidth || 0;
        setScrollWidth(contentWidth);
      };

      calculateWidth();
      window.addEventListener('resize', calculateWidth);
      return () => window.removeEventListener('resize', calculateWidth);
    }, [newsItems]);

    return (
      <ScrollArea.Root className="w-full sticky top-2 pt-12 lg:pt-10 lg:top-8 md:py-4 lg:py-8">
        <ScrollArea.Viewport 
          ref={wrapperRef}
          className={clsx(
            "w-full overflow-hidden py-2 md:py-3 lg:py-4 text-xs md:text-sm lg:text-lg tracking-tight",
            "dark( bg-adaptive-primaryAlt text-white border-t border-b border-l border-white hover:text-adaptive-accent )",
            "bg-black text-white-mid hover:text-adaptive-accent3 border-t border-b border-l border-black-light"
          )}
        >
          <div className="relative">
            <div 
              ref={contentRef}
              className="inline-flex items-center"
              style={{
                animationDuration: speedMap[speed],
                animationDirection: direction === 'left' ? 'normal' : 'reverse',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationName: 'ticker-scroll',
                animationPlayState: 'running'
              }}
              onMouseEnter={pauseOnHover ? (e) => e.currentTarget.style.animationPlayState = 'paused' : undefined}
              onMouseLeave={pauseOnHover ? (e) => e.currentTarget.style.animationPlayState = 'running' : undefined}
            >
              {[...newsItems, ...newsItems].map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="whitespace-nowrap px-4"
                >
                  <span className={clsx(
                    "font-display md:font-lg lg:font-xl font-bold mr-2 text-adaptive-accent dark:text-adaptive-accent3"
                  )}>
                    {item.source}:
                  </span>
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {item.title}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes ticker-scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-${scrollWidth / 2}px);
              }
            }
          `}</style>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    );
  }
};