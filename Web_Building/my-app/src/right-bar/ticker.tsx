import { ComponentConfig } from "@measured/puck";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, Clock } from "lucide-react";
import { clsx } from "clsx";
import Parser from 'rss-parser';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const parser = new Parser();
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/',
  'https://api.codetabs.com/v1/proxy?quest='
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataPropName: "__cdata",
  processEntities: true,
  htmlEntities: true,
  isArray: (name) => {
    return name === 'item' || name === 'script';
  }
});

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
  slow: "60s",
  medium: "50s",
  fast: "40s"
};

const RSS_FEEDS = {
  proPub: 'http://feeds.propublica.org/propublica/main',
  foreignPolicy: 'https://foreignpolicy.com/feed/'
};

const calculateDynamicSpeed = (headlines: NewsItem[], speedSetting: string) => {
  // Base reading speed (words per minute)
  const baseWPM = 150;
  
  // Calculate average words per headline
  const avgWordsPerHeadline = headlines.reduce((acc, item) => {
    return acc + item.title.split(' ').length;
  }, 0) / headlines.length;
  
  // Calculate total reading time in seconds
  const totalWords = avgWordsPerHeadline * headlines.length;
  const baseSeconds = (totalWords / baseWPM) * 60;
  
  // Speed modifiers
  const speedModifiers = {
    slowest: 1.6,
    slow: 1.3,
    medium: 1,
    fast: 0.8,
    fastest: 0.5
  };
  
  // Calculate final speed with boundaries
  const speed = Math.max(
    20,
    Math.min(
      120,
      baseSeconds * speedModifiers[speedSetting as keyof typeof speedModifiers]
    )
  );
  
  return `${speed}s`;
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
        ]}
      }
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
        { label: "Slowest", value: "slowest" },
        { label: "Slow", value: "slow" },
        { label: "Medium", value: "medium" },
        { label: "Fast", value: "fast" },
        { label: "Fastest", value: "fastest" }
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
    const rssPubParser = new Parser({
      customFields: {
        feed: ['copyright', 'language'],
        item: [['media:content', 'media'], ['atom:link', 'atomLink']]
      },
      xml2js: {
        removeNSPrefix: true,
        strict: false,
        normalizeTags: true,
        ignoreAttrs: true,
        tagNameProcessors: [
          name => name.replace(':', '_'),
          name => name === 'script' ? '' : name
        ],
        valueProcessors: [
          value => value?.trim()
        ]
      }
    });


    const fetchWithRetry = useCallback(async (url: string, attempts = 3) => {
      for (let i = 0; i < attempts; i++) {
        try {
          const proxyUrl = `${CORS_PROXIES[i % CORS_PROXIES.length]}${encodeURIComponent(url)}`;
          const response = await axios.get(proxyUrl, {
            timeout: 15000,
            headers: {
              'Accept': 'application/rss+xml, application/xml, text/xml',
              'Content-Type': 'application/xml'
            }
          });
          
          if (response.status === 200 && response.data) {
            return response.data;
          }
        } catch (error) {
          console.warn(`Attempt ${i + 1} with proxy ${i % CORS_PROXIES.length} failed:`, error.message);
          if (i === attempts - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
      throw new Error('All proxy attempts failed');
    }, []);
    
    const fetchRssFeed = useCallback(async (url: string, source: string) => {
      try {
        const data = await fetchWithRetry(url);
        const parsedXml = xmlParser.parse(data);
        const items = parsedXml?.rss?.channel?.item || [];
    
        if (!Array.isArray(items)) {
          console.error('RSS items not found or not an array:', items);
          return [];
        }
    
        return items
          .filter(item => {
            // Check both direct title/link and potential CDATA wrapped content
            const title = item.title?.__cdata || item.title;
            const link = item.link?.__cdata || item.link;
            return title && link;
          })
          .slice(0, maxArticlesPerSource)
          .map(item => ({
            title: item.title?.__cdata || item.title,
            link: item.link?.__cdata || item.link,
            source
          }));
      } catch (error) {
        console.error(`Error fetching ${source} feed:`, error);
        console.error('Full error details:', error.response?.data || error);
        return [];
      }
    }, [maxArticlesPerSource]);

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

    useEffect(() => {
      const fetchNews = async () => {
        if (typeof window === 'undefined') return;

        const newsPromises = [
          sources.guardian && fetchGuardianNews(),
          sources.proPub && fetchRssFeed(RSS_FEEDS.proPub, 'ProPublica'),
          sources.foreignPolicy && fetchRssFeed(RSS_FEEDS.foreignPolicy, 'Foreign Policy')
        ].filter(Boolean);

        const results = await Promise.all(newsPromises);
        
        // Interleave articles from different sources
        const maxLength = Math.max(...results.map(arr => arr.length));
        const interleaved = Array.from({ length: maxLength * results.length })
          .map((_, i) => {
            const sourceIndex = i % results.length;
            const articleIndex = Math.floor(i / results.length);
            return results[sourceIndex]?.[articleIndex];
          })
          .filter(Boolean);

        setNewsItems(interleaved);
      };

      fetchNews();
      const interval = setInterval(fetchNews, 300000);
      return () => clearInterval(interval);
    }, [sources, fetchGuardianNews, fetchRssFeed]);

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

    const contextMenuItems = ["slowest", "slow", "medium", "fast", "fastest"].map((s) => ({
      label: s,
      isActive: s === speed,
      onClick: () => setSpeed(s as typeof speed)
    }));

    const tickerSpeed = calculateDynamicSpeed(newsItems, speed);

  return (
      <TooltipPrimitive.Provider>
        <ContextMenuPrimitive.Root>
          <TooltipPrimitive.Root>
            <ContextMenuPrimitive.Trigger asChild>
              <TooltipPrimitive.Trigger asChild>
                <ScrollArea.Root className="w-full sticky pt-14 lg:pt-[7vh]">
                  <ScrollArea.Viewport 
                    ref={wrapperRef}
                    className={clsx(
                      "w-full overflow-hidden py-2 lg:py-4 text-2xs md:text-sm lg:text-lg tracking-tight",
                      theme === 'dark' ? "bg-adaptive-primaryAlt text-white border-t border-b border-l border-white hover:text-cyan" 
                        : "bg-black text-white-mid hover:text-adaptive-accent3 border-t border-b border-l border-black-light"
                    )}
                  >
                    <div className="relative">
                      <div 
                        ref={contentRef}
                        className="inline-flex items-center"
                        style={{
                          animationDuration: tickerSpeed,
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
                          <div key={`${item.title}-${idx}`} className="whitespace-nowrap px-4 flex items-center">
                            <span className="font-display text-xs md:text-sm lg:text-xl font-bold mr-2 text-adaptive-accent dark:text-adaptive-accent3">
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
                            <span className="ml-8 w-2 h-2 lg:w-3 lg:h-3 bg-adaptive-primary rounded-full whitespace-nowrap"></span>
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