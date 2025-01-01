import { ComponentConfig } from "@measured/puck";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { clsx } from "clsx";

export type TickerProps = {
  items: {
    text: string;
    link?: string;
  }[];
  direction: "left" | "right";
  speed: "slow" | "medium" | "fast";
  pauseOnHover: boolean;
  theme: "light" | "dark";
};

const speedMap = {
  slow: "30s",
  medium: "20s",
  fast: "10s"
};

export const Ticker: ComponentConfig<TickerProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item) => item.text,
      arrayFields: {
        text: { type: "text" },
        link: { type: "text", label: "URL (optional)" }
      }
    },
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
        { label: "Continuous", value: "false" },
      ]
    },
    theme: {
      type: "select",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" }
      ]
    }
  },

  defaultProps: {
    items: [
      { text: "Breaking News" },
      { text: "Latest Updates" },
      { text: "Featured Story" }
    ],
    direction: "left",
    speed: "medium",
    pauseOnHover: true,
    theme: "light"
  },

  render: ({ items, direction, speed, pauseOnHover, theme }) => {
    const [scrollWidth, setScrollWidth] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!contentRef.current || !wrapperRef.current) return;
      
      const calculateWidth = () => {
        const contentWidth = contentRef.current?.offsetWidth || 0;
        setScrollWidth(contentWidth);
      };

      calculateWidth();
      window.addEventListener('resize', calculateWidth);
      return () => window.removeEventListener('resize', calculateWidth);
    }, [items]);

    const scrollerStyle = {
      '--duration': speedMap[speed],
      '--direction': direction === 'left' ? 'forwards' : 'reverse'
    } as React.CSSProperties;

    return (
      <ScrollArea.Root className="w-full overflow-hidden sticky top-8 py-4">
        <ScrollArea.Viewport 
          ref={wrapperRef}
          className={clsx(
            "w-full overflow-hidden py-4",
            theme === "dark" ? "bg-black-light text-white" : "bg-black text-white"
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
              {[...items, ...items].map((item, idx) => (
                <div
                  key={`${item.text}-${idx}`}
                  className="whitespace-nowrap px-4"
                >
                  {item.link ? (
                    <a 
                      href={item.link}
                      className={clsx(
                        "hover:underline",
                        theme === "dark" ? "text-red" : "text-cyan"
                      )}
                    >
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
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