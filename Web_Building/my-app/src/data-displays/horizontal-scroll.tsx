'use client';

import { ComponentConfig } from "@measured/puck"
import { useEffect, useRef, Fragment } from "react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import { MiniCard, MiniCardProps } from "../basics/mini-card"

gsap.registerPlugin(Draggable)

export interface ScrollArticlesProps {
  articles: MiniCardProps[]
  backgroundColor?: string
  padding?: string
}

export const ScrollArticles: ComponentConfig<ScrollArticlesProps> = {
  fields: {
    articles: {
      type: "array",
      arrayFields: MiniCard.fields,
      getItemSummary: (item) => item.title || "Article"
    },
    backgroundColor: {
      type: "select",
      options: [
        { label: "None", value: "transparent" },
        { label: "Primary", value: "bg-adaptive-primary" },
        { label: "Secondary", value: "bg-adaptive-secondary" }
      ]
    },
    padding: {
      type: "select",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "4" },
        { label: "Medium", value: "8" },
        { label: "Large", value: "16" }
      ]
    }
  },

  defaultProps: {
    articles: [],
    backgroundColor: "transparent",
    padding: "8"
  },

  render: ({ articles, backgroundColor, padding }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!trackRef.current || !containerRef.current || articles.length < 4) return

      const track = trackRef.current
      const container = containerRef.current
      const cardWidth = container.offsetWidth / 3
      const totalWidth = cardWidth * articles.length
      const maxScroll = -(totalWidth - container.offsetWidth)

      const snap = (value: number) => {
        const increment = cardWidth
        return Math.round(value / increment) * increment
      }

      const proxy = document.createElement("div")
      const draggable = new Draggable(proxy, {
        trigger: container,
        type: "x",
        inertia: true,
        bounds: { minX: maxScroll, maxX: 0 },
        onPress() {
          gsap.killTweensOf(track)
          this.startX = gsap.getProperty(track, "x") as number
        },
        onDrag() {
          gsap.set(track, { x: this.startX + this.x })
        },
        onDragEnd() {
          const momentum = this.getDirection("start") === "left" ? -cardWidth/2 : cardWidth/2
          const targetX = snap(gsap.getProperty(track, "x") as number + momentum)
          
          gsap.to(track, {
            x: Math.max(maxScroll, Math.min(0, targetX)),
            duration: 0.5,
            ease: "power2.out"
          })
        }
      })

      return () => {
        draggable.kill()
      }
    }, [articles])

    return (
      <div className={`w-full ${backgroundColor} p-${padding}`}>
        <div 
          ref={containerRef}
          className="relative overflow-hidden w-full"
        >
          <div 
            ref={trackRef}
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{ 
              width: `${(articles.length * (100/3))}%`,
              minWidth: `${articles.length * 350}px`
            }}
          >
            {articles.map((article, i) => (
              <Fragment key={`article-${i}`}>
                <div 
                  className="flex-shrink-0 px-4" 
                  style={{ 
                    width: 'calc(33.333% - 1.5rem)',
                    minWidth: '300px',
                    maxWidth: '400px'
                  }}
                >
                  <div className="h-[450px]">
                    <MiniCard.render {...article} />
                  </div>
                </div>
                {i < articles.length - 1 && (
                  <div className="h-[450px] w-px bg-adaptive-secondaryAlt self-center flex-shrink-0" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    )
  }
}