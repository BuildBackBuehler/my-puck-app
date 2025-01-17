import { ComponentConfig } from "@measured/puck";
import { ArticleCard } from "./article-card";
import { useLayoutState } from "../../lib/layout-state";
import { ArticleCardProps } from "./article-card";

// type WithoutPuck<T> = Omit<T, 'puck'>;

export interface ArticleCardListProps {
  cards: ArticleCardProps[];
  stickyOffset: number;
};

export const ArticleCardList: ComponentConfig<ArticleCardListProps> = {
  fields: {
    cards: {
      type: "array",
      arrayFields: {
        slug: { type: "text" }
      }
    },
    stickyOffset: { 
      type: "number",
      min: 0,
      max: 100
    }
  },

  defaultProps: {
    cards: [
      { slug: "article-1" },
      { slug: "article-2" },
      { slug: "article-3" },
      { slug: "article-4" },
      { slug: "article-5" },
    ],
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
              <ArticleCard.render {...card} /> 
            </div>
          </div>
        ))}
      </div>
    );
  }
};