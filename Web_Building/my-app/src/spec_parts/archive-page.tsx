'use client';

import { ComponentConfig } from "@measured/puck";
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { FilterBar } from "./filter-bar";
import { ArchiveGrid } from "./archive-grid";
import { ArticleWithEngagement } from "@/utils/types/database";

const convertDate = (dateStr: string) => {
  // Convert from DD.MM.YYYY to Date object
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
};

export type Filters = {
  search: string;
  author: string;
  category: string;
  sort: string;
  articles?: ArticleWithEngagement[];
};

export const ArchivePage: ComponentConfig<Filters> = {
  defaultProps: {
    search: "",
    author: "",
    category: "",
    sort: "newest"
  },

  fields: {
    search: { type: "text" },
    author: { type: "text" },
    category: { type: "text" },
    sort: { 
      type: "select",
      options: [
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
        { label: "Popular", value: "popular" }
      ]
    }
  },

  resolveData: async () => {
    const { data: articles } = await supabase
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
      .order('date', { ascending: false });

    return {
      props: {
        articles: articles || []
      }
    };
  },

  render: ({ articles: initialArticles = [] }) => {
    const [articles, setArticles] = useState(initialArticles);
    const [filters, setFilters] = useState<Filters>({
      search: "",
      author: "",
      category: "",
      sort: "newest"
    });

    const applyFilters = useCallback((data: ArticleWithEngagement[], currentFilters: Filters) => {
      let filtered = [...data];

      // Apply search filter
      if (currentFilters.search) {
        const search = currentFilters.search.toLowerCase();
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(search) || 
          article.summary?.toLowerCase().includes(search)
        );
      }

      // Apply author filter
      if (currentFilters.author && currentFilters.author !== 'all') {
        filtered = filtered.filter(article => 
          article.author.id === currentFilters.author
        );
      }

      // Apply category filter
      if (currentFilters.category && currentFilters.category !== 'all') {
        filtered = filtered.filter(article => 
          article.category === currentFilters.category
        );
      }

      // Apply sorting
      switch (currentFilters.sort) {
        case 'oldest':
          filtered.sort((a, b) => convertDate(a.date).getTime() - convertDate(b.date).getTime());
          break;
        case 'popular':
          filtered.sort((a, b) => (b.engagement?.views || 0) - (a.engagement?.views || 0));
          break;
        case 'newest':
        default:
          filtered.sort((a, b) => convertDate(b.date).getTime() - convertDate(a.date).getTime());
      }

      return filtered;
    }, []);

    useEffect(() => {
      setArticles(applyFilters(initialArticles, filters));
    }, [initialArticles, filters, applyFilters]);

    const handleFilterChange = (newFilters: Partial<Filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    };

    return (
      <div className="min-h-screen mt-[6vh]">
        <FilterBar.render 
          searchPlaceholder="Search articles..."
          showSearch={true}
          showAuthorFilter={true}
          showCategoryFilter={true}
          showSortFilter={true}
          padding="1rem"
          onFilterChange={handleFilterChange}
        />
        <ArchiveGrid.render 
          articles={articles}
          batchSize={9}
          gridGap="2rem"
        />
      </div>
    );
  }
};