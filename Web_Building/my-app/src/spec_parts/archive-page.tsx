import { ComponentConfig } from "@measured/puck";
import { FilterBar as FilterBarConfig } from './filter-bar';
import { ArchiveGrid as ArchiveConfig, ArticleData } from './archive-grid';

const FilterBar = FilterBarConfig.render;
const ArchiveGrid = ArchiveConfig.render;

export interface ArchivePageProps {
  articles: ArticleData[];
  authors: string[];
  categories: string[];
}

export const ArchivePage: ComponentConfig<ArchivePageProps> = {
  fields: {
    articles: {
      type: "array",
      arrayFields: {
        id: { type: "text" },
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
        date: { type: "text" },
        summary: { type: "textarea" },
        link: { type: "text" },
        engagement: {
          type: "object",
          objectFields: {
            views: { type: "number" },
            likes: { type: "number" },
            comments: { type: "number" }
          }
        }
      }
    },
    authors: {
      type: "array",
      arrayFields: { type: "text" }
    },
    categories: {
      type: "array",
      arrayFields: { type: "text" }
    }
  },

  defaultProps: {
    articles: [],
    authors: [],
    categories: []
  },

  render: ({ articles = [], authors = [], categories = [] }) => {
    return (
      <div className="col-auto flex-grow min-h-screen">
        <FilterBar 
          authors={authors}
          categories={categories}
          onFilterChange={() => {}}
          onSortChange={() => {}}
          onSearch={() => {}}
        />
        <ArchiveGrid 
          articles={articles}
          batchSize={9}
          gridGap="2rem"
        />
      </div>
    );
  }
};