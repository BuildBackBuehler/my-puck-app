import { ComponentConfig } from "@measured/puck";
import { ArticleCard, ArticleCardProps } from "./article-card";

export interface ArticleCardListProps {
  cards: ArticleCardProps[];
  stickyOffset: number;
  stickyPosition: "top" | "bottom";
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
    },
    stickyPosition: {
      type: "select",
      options: [
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" }
      ]
    }
  },

  defaultProps: {
    cards:  [{
      mainTitle: "Article Title",
      date: "January 1, 2024",
      image: {
        src: "https://demo-source.imgix.net/puppy.jpg",
        alt: "A cute puppy."
      },
      title: "Article Subtitle",
      author: "Author Name",
      readTime: "5 min read",
      summary: "Article summary goes here",
      link: "#"
    }],
    stickyOffset: 0,
    stickyPosition: "top"
  },

  render: ({ cards, stickyPosition, stickyOffset }) => (
    <div 
      className={`w-full ${stickyPosition === "top" ? "sticky top-0" : "sticky bottom-0"}`}
      style={{ top: `${stickyOffset}px` }}
    >
      <div className="space-y-8">
        {cards.map((card, index) => (
          <ArticleCard.render key={index} {...card} id={`article-${index}`} />
        ))}
      </div>
    </div>
  )
};