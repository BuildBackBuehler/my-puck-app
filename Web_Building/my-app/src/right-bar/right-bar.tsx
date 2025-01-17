"use client";

import { ComponentConfig } from "@measured/puck"
import { Clock, Check, Heart, Eye, MessageCircle } from "lucide-react"
import { clsx } from "clsx"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { XMLParser } from 'fast-xml-parser'
import axios from 'axios'
import Link from 'next/link'
import { ArticleWithEngagement } from "@/utils/types/database"
import { Circle } from "./circle"
import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "@/utils/supabase/client"

type NewsItem = {
    source: string
    title: string
    link: string
  }

export interface RightBarProps {
  // Combined props from Ticker, Header, and ArticleList
  sources?: {
    guardian: boolean
    proPub: boolean
    foreignPolicy: boolean
    articles?: ArticleWithEngagement[];
  }
  tickerDirection: "left" | "right"
  tickerSpeed: "slow" | "medium" | "fast"
  pauseOnHover: boolean
  theme: "light" | "dark"
  maxArticlesPerSource: number
  maxArticles: number
  articles?: ArticleWithEngagement[]
  headerTitle: string
  headerLinkText: string
  headerLinkUrl: string
  showDivider: boolean
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataPropName: "__cdata",
  processEntities: true,
  htmlEntities: true,
  isArray: (name) => name === 'item' || name === 'script'
})

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/',
  'https://api.codetabs.com/v1/proxy?quest='
]

const RSS_FEEDS = {
  proPub: 'http://feeds.propublica.org/propublica/main',
  foreignPolicy: 'https://foreignpolicy.com/feed/',
  guardian: 'https://www.theguardian.com/world/rss'
}

export const RightBar: ComponentConfig<RightBarProps> = {
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
    tickerDirection: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" }
      ]
    },
    tickerSpeed: {
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
    maxArticlesPerSource: { type: "number", min: 1, max: 10 },
    maxArticles: { type: "number", min: 1, max: 10 },
    headerTitle: { type: "text" },
    headerLinkText: { type: "text" },
    headerLinkUrl: { type: "text" },
    showDivider: {
      type: "radio",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ]
    }
  },

  defaultProps: {
    sources: {
      guardian: true,
      proPub: true,
      foreignPolicy: true
    },
    tickerDirection: "left",
    tickerSpeed: "medium",
    pauseOnHover: true,
    theme: "light",
    maxArticlesPerSource: 3,
    maxArticles: 5,
    headerTitle: "Featured Articles",
    headerLinkText: "See All",
    headerLinkUrl: "/essentials",
    showDivider: true
  },

  resolveData: async ({ props }) => {
    const { data: articlesData } = await supabase
      .from('articles')
      .select(`
        *,
        author:author_id(
          id,
          pen_name,
          avatar_url
        ),
        engagement:article_engagement(*)
      `)
      .order('date', { ascending: false })
      .limit(props.maxArticles || 5);

    return {
      props: {
        ...props,
        articles: articlesData
      }
    };
  },

  render: ({ sources, tickerDirection, tickerSpeed, pauseOnHover, theme, maxArticlesPerSource, 
            maxArticles,headerTitle, headerLinkText, headerLinkUrl, showDivider, articles = [] }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [scrollWidth, setScrollWidth] = useState(0)
    const [speed, setSpeed] = useState(tickerSpeed)
    const contentRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const fetchRssFeed = useCallback(async (url: string, source: string) => {
      for (let i = 0; i < CORS_PROXIES.length; i++) {
        try {
          const proxyUrl = `${CORS_PROXIES[i]}${encodeURIComponent(url)}`
          const response = await axios.get(proxyUrl, {
            timeout: 15000,
            headers: {
              'Accept': 'application/rss+xml, application/xml, text/xml',
              'Content-Type': 'application/xml'
            }
          })
          
          if (response.status === 200 && response.data) {
            const parsedXml = xmlParser.parse(response.data)
            const items = parsedXml?.rss?.channel?.item || []
            
            if (!Array.isArray(items)) return []
        
            return items
              .filter(item => item.title && item.link)
              .slice(0, maxArticlesPerSource)
              .map(item => ({
                title: item.title?.__cdata || item.title,
                link: item.link?.__cdata || item.link,
                source
              }))
          }
        } catch (error) {
          console.warn(`Proxy ${i} failed:`, error.message)
          continue
        }
      }
      return []
    }, [maxArticlesPerSource])

    useEffect(() => {
      const fetchNews = async () => {
        if (typeof window === 'undefined') return

        const newsPromises = [
          sources.guardian && fetchRssFeed(RSS_FEEDS.guardian, 'The Guardian'),
          sources.proPub && fetchRssFeed(RSS_FEEDS.proPub, 'ProPublica'),
          sources.foreignPolicy && fetchRssFeed(RSS_FEEDS.foreignPolicy, 'Foreign Policy')
        ].filter(Boolean)

        const results = await Promise.all(newsPromises)
        
        const maxLength = Math.max(...results.map(arr => arr.length))
        const interleaved = Array.from({ length: maxLength * results.length })
          .map((_, i) => {
            const sourceIndex = i % results.length
            const articleIndex = Math.floor(i / results.length)
            return results[sourceIndex]?.[articleIndex]
          })
          .filter(Boolean)

        setNewsItems(interleaved)
      }

      fetchNews()
      const interval = setInterval(fetchNews, 300000)
      return () => clearInterval(interval)
    }, [sources, fetchRssFeed])

    useEffect(() => {
      if (!contentRef.current || !wrapperRef.current) return
      const calculateWidth = () => {
        setScrollWidth(contentRef.current?.offsetWidth || 0)
      }

      calculateWidth()
      window.addEventListener('resize', calculateWidth)
      return () => window.removeEventListener('resize', calculateWidth)
    }, [newsItems])

    const contextMenuItems = ["slow", "medium", "fast"].map((s) => ({
      label: s,
      isActive: s === speed,
      onClick: () => setSpeed(s as "slow" | "medium" | "fast")
    }))

    return (
      <div className="flex flex-col space-y-8">
        {/* Ticker Component */}
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
                            animationName: 'ticker-scroll',
                            animationDuration: `${speed === 'slow' ? 60 : speed === 'medium' ? 50 : 40}s`,
                            animationDirection: tickerDirection === 'left' ? 'normal' : 'reverse',
                            animationTimingFunction: 'linear',
                            animationIterationCount: 'infinite',
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
                              <span className="ml-8 w-2 h-2 lg:w-3 lg:h-3 bg-adaptive-primary dark:bg-white-mid rounded-full whitespace-nowrap"></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollArea.Viewport>
                  </ScrollArea.Root>
                </TooltipPrimitive.Trigger>
              </ContextMenuPrimitive.Trigger>
            </TooltipPrimitive.Root>
          </ContextMenuPrimitive.Root>
        </TooltipPrimitive.Provider>

        {/* Header Component */}
        <header className="flex-grow sticky top-0 z-10">
          <nav className="max-w-7xl md:mx-auto px-2 md:px-6 lg:px-8">
            <div className="flex justify-center items-center pt-1.5 md:justify-between md:items-end lg:pt-[4.5vh] md:pb-2">
              <h1 className="text-sm sm:text-center md:text-lg lg:text-3xl font-serif italic">{headerTitle}</h1>
              <div className="hidden md:flex items-center gap-2">
                <span className="w-3 h-3 lg:w-4 lg:h-4 bg-adaptive-secondary rounded-full" />
                <Link 
                  href={headerLinkUrl}
                  className="text-base lg:text-2xl underline-offset-1 hover:text-adaptive-accent transition-all"
                >
                  {headerLinkText}
                </Link>
              </div>
            </div>
          </nav>
          {showDivider && (
            <div className="mx-4 self-center px-8 h-px bg-adaptive-secondaryAlt" />
          )}
        </header>

        {/* Article List Component */}
      <section className="h-[80vh] overflow-y-auto scrollbar-hide xs:scrollbar-default">
          <div>
            {articles.map((_, index) => (
              index !== maxArticles - 1 && (
                <div 
                  key={index} 
                  className="absolute w-px h-16 bg-transparent" 
                  style={{
                    top: `calc(${(100 / maxArticles) * (index + 1)}% - 8rem)`
                  }} 
                />
              )
            ))}
          </div>

        <div className="space-y-4 md:space-y-8 lg:space-y-16">
          {articles.map((article, index) => (
            <article key={article.id} className="relative pl-1 md:pl-2 lg:pl-4">
              <div className="flex justify-between mb-4">
                <span className="font-display text-4xl lg:text-8xl text-adaptive-secondaryAlt select-none">
                  {index + 1}
                </span>
                <div className="sm:mt-4 flex flex-col items-end justify-end gap-1 pb-2">
                  <time className="pr-1 md:pr-2 lg:pr-4 font-display text-3xs md:text-sm lg:text-base text-adaptive-secondaryAlt">
                    {article.date}
                  </time>
                  <div className="pr-1 md:pr-2 lg:pr-4 flex gap-0.5 md:gap-1 lg:gap-2 text-adaptive-secondaryAlt text-3xs md:text-xs lg:text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-2 md:w-3 lg:w-4" />
                      <span>{article.engagement?.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-2 md:w-3 lg:w-4 text-transparent fill-adaptive-accent" />
                      <span>{article.engagement?.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-2 md:w-3.5 lg:w-4" />
                      <span>{article.engagement?.comments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gap-2 md:gap-5 lg:gap-8">
                <h2>
                  <Link 
                    href={`/articles/${article.slug}`}
                    className="font-serif text-base md:text-lg lg:text-3xl font-bold hover:text-adaptive-accent transition-all"
                  >
                    {article.title}
                  </Link>
                </h2>
                <h3 className="font-sans italic text-xs md:text-sm lg:text-base text-adaptive-secondaryAlt line-clamp-1 lg:-mt-1">
                  {article.subtitle}
                </h3>
                <p className="font-sans text-xs md:text-sm lg:text-base text-adaptive-secondaryAlt max-w-2xl line-clamp-4 mt-1 md:mt-2 lg:mt-4">
                  {article.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
          <Circle.render title="Leave Your Old Life Behind" subtitle="Explore" blurb="Don't try to be like someone else, be yourself." />
        </section>

        <style jsx>{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${scrollWidth / 2}px); }
          }
        `}</style>
      </div>
    )
  }
}