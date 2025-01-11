import { ComponentConfig } from "@measured/puck";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, Clock } from "lucide-react";
import { clsx } from "clsx";

interface NewsItem {
  source: string;
  title: string;
  link: string;
}

interface NewsSourcesConfig {
  guardian: boolean;
  proPub: boolean;
  foreignPolicy: boolean;
}

export interface TickerProps {
  sources?: NewsSourcesConfig;
  direction: "left" | "right";
  speed: "slow" | "medium" | "fast";
  pauseOnHover: boolean;
  theme: "light" | "dark";
  maxArticlesPerSource: number;
}

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
        guardian: { type: "radio", options: [
          { label: "Yes", value: true },
          { label: "No", value: false }
        ]},
        proPub: { type: "radio", options: [
          { label: "Yes", value: true },
          { label: "No", value: false }
        ]},
        foreignPolicy: { type: "radio", options: [
          { label: "Yes", value: true },
          { label: "No", value: false }
        ]
      }
    },
  },
  direction: {
    type: "radio",
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
      proPub: true,
      foreignPolicy: true
    },
    maxArticlesPerSource: 3,
    speed: "medium",
    direction: "left",
    pauseOnHover: true,
    theme: "light",
  },

  render: ({ 
    sources = { guardian: true, proPub: true, foreignPolicy: true }, 
    direction, 
    speed: initialSpeed, 
    pauseOnHover, 
    theme,
    maxArticlesPerSource = 3
  }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [speed, setSpeed] = useState(initialSpeed);
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const fetchGuardianNews = useCallback(async () => {
      const guardianApiKey = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
      
      if (!guardianApiKey || !sources?.guardian) return [];
    
      try {
        const response = await fetch(
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
    }, [sources?.guardian, maxArticlesPerSource]);

    const fetchProPubNews = useCallback(async () => {
      if (!sources.proPub) return [];
      try {
        const response = await fetch('https://www.propublica.org/feed/main');
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
    }, [sources.proPub, maxArticlesPerSource]);

    const fetchFPNews = useCallback(async () => {
      if (!sources.foreignPolicy) return [];
      try {
        const response = await fetch('https://foreignpolicy.com/feed/');
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
    }, [sources.foreignPolicy, maxArticlesPerSource]);

    useEffect(() => {
      const fetchNews = async () => {
        if (typeof window === 'undefined') return;

        const [guardianNews, proPubNews, fpNews] = await Promise.all([
          fetchGuardianNews(),
          fetchProPubNews(),
          fetchFPNews()
        ]);

        setNewsItems([...guardianNews, ...proPubNews, ...fpNews]);
      };

      fetchNews();
      const interval = setInterval(fetchNews, 300000);
      return () => clearInterval(interval);
    }, [sources, fetchGuardianNews, fetchProPubNews, fetchFPNews]);

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

    const contextMenuItems = ["slow", "medium", "fast"].map((s) => ({
      label: s,
      isActive: s === speed,
      onClick: () => setSpeed(s as typeof speed)
    }));

    return (
      <TooltipPrimitive.Provider>
        <ContextMenuPrimitive.Root>
          <TooltipPrimitive.Root>
            <ContextMenuPrimitive.Trigger asChild>
              <TooltipPrimitive.Trigger asChild>
                <ScrollArea.Root className="w-full sticky pt-12 lg:pt-[7vh]">
                  <ScrollArea.Viewport 
                    ref={wrapperRef}
                    className={clsx(
                      "w-full overflow-hidden py-2 md:py-3 lg:py-4 text-xs md:text-sm lg:text-lg tracking-tight",
                      theme === 'dark' ? "bg-adaptive-primaryAlt text-white border-t border-b border-l border-white hover:text-cyan" 
                        : "bg-black text-white-mid hover:text-adaptive-accent3 border-t border-b border-l border-black-light"
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
                          <div key={`${item.title}-${idx}`} className="whitespace-nowrap px-4">
                            <span className="font-display md:font-lg lg:font-xl font-bold mr-2 text-adaptive-accent dark:text-adaptive-accent3">
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
                  </ScrollArea.Viewport>
                </ScrollArea.Root>
              </TooltipPrimitive.Trigger>
            </ContextMenuPrimitive.Trigger>

            <TooltipPrimitive.Content
              sideOffset={4}
              className={clsx(
                "z-50 rounded-md px-3 py-0.5 text-xs font-medium shadow-md",
                "bg-adaptive-secondary text-adaptive-primaryAlt"
              )}
            >
              Right click to adjust speed
              <TooltipPrimitive.Arrow className="fill-current text-adaptive-primaryAlt" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Root>

          <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content 
              className={clsx(
                "z-50 min-w-[8rem] rounded-md p-1",
                "bg-adaptive-primary shadow-md"
              )}
            >
              {contextMenuItems.map(({ label, isActive, onClick }) => (
                <ContextMenuPrimitive.Item
                  key={label}
                  onClick={onClick}
                  className={clsx(
                    "flex cursor-default select-none items-center rounded-sm px-2 py-2 text-xs outline-none",
                    "text-adaptive-secondaryAlt focus:bg-adaptive-primaryAlt focus:text-adaptive-accent"
                  )}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="flex-grow capitalize">{label}</span>
                  {isActive && <Check className="h-4 w-4" />}
                </ContextMenuPrimitive.Item>
              ))}
            </ContextMenuPrimitive.Content>
          </ContextMenuPrimitive.Portal>
        </ContextMenuPrimitive.Root>

        <style jsx>{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${scrollWidth / 2}px); }
          }
        `}</style>
      </TooltipPrimitive.Provider>
    );
  }
};