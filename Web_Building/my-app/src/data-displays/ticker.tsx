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
  slow: "animate-[scroll_30s_linear_infinite]",
  medium: "animate-[scroll_20s_linear_infinite]",
  fast: "animate-[scroll_10s_linear_infinite]"
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
    const [duplicatedItems, setDuplicatedItems] = useState(items);
    const containerRef = useRef<HTMLDivElement>(null);

    const duplicateItems = useCallback(() => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = containerRef.current.scrollWidth;
      const duplicatesNeeded = Math.ceil(containerWidth / contentWidth) + 1;
      setDuplicatedItems(Array(duplicatesNeeded).fill(items).flat());
    }, [items]);

    useEffect(() => {
      duplicateItems();
      window.addEventListener('resize', duplicateItems);
      return () => window.removeEventListener('resize', duplicateItems);
    }, [duplicateItems]);

    return (
      <ScrollArea.Root className="w-full overflow-hidden">
        <ScrollArea.Viewport 
          ref={containerRef}
          className={clsx(
            "w-full overflow-hidden py-4",
            theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          )}
        >
          <div 
            className={clsx(
              "inline-flex items-center",
              speedMap[speed],
              direction === "right" && "animate-[scroll_20s_linear_infinite_reverse]",
              pauseOnHover && "hover:pause"
            )}
          >
            {duplicatedItems.map((item, idx) => (
              <div
                key={`${item.text}-${idx}`}
                className="whitespace-nowrap px-4"
              >
                {item.link ? (
                  <a 
                    href={item.link} 
                    className={clsx(
                      "hover:underline",
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
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
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    );
  }
};