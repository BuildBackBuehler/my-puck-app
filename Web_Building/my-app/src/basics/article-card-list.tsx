import { ComponentConfig } from "@measured/puck";
import { ArticleCard } from "./article-card";
import { useEffect, useRef, useState } from "react";
import { useLayoutState } from "../../lib/layout-state";

export interface ArticleCardListProps {
  cards: ArticleCardProps[];
  stickyOffset: number;
};

export const ArticleCardList: ComponentConfig<ArticleCardListProps> = {
  fields: {
    cards: {
      type: "array",
      getItemSummary: (item) => item.title,
      arrayFields: {
        mainTitle: { type: "text" },
        date: { type: "text" },
        image: {
          type: "object",
          objectFields: {
            src: { type: "text" },
            alt: { type: "text" }
          }
        },
        title: { type: "text" },
        author: { type: "text" },
        readTime: { type: "text" },
        summary: { type: "textarea" },
        link: { type: "text" }
      }
    },
    stickyOffset: { 
      type: "number",
      min: 0,
      max: 100
    }
  },

  defaultProps: {
    cards: [{
      mainTitle: "First Article",
      date: "January 1, 2024",
      image: {
        src: "https://demo-source.imgix.net/puppy.jpg",
        alt: "A cute puppy"
      },
      title: "Article Subtitle",
      author: "Author Name",
      readTime: "5 min read",
      summary: "Article summary goes here",
      link: "#"
    }],
    stickyOffset: 0
  },

  render: ({ cards, stickyOffset }) => {
    const { isSidebarOpen, isRightSidebarOpen } = useLayoutState()

    return (
      <div className= {`relative h-screen w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide xs:scrollbar-default transition-all duration-300 ${isSidebarOpen ? 'pl-4' : 'pl-2'}
        ${isRightSidebarOpen ? 'pr-4' : 'pr-2'}`}>
        {cards.map((card, index) => (
          <div 
            key={`article-${index}`}
            className="h-screen snap-start"
          >
            <div 
              className="sticky"
              style={{ top: `${stickyOffset}px` }}
            >
              <ArticleCard.render {...card} id={`article-${index}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }
};