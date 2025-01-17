'use client';

import { ComponentConfig } from "@measured/puck"
import { Search } from "lucide-react"
import * as Select from "@radix-ui/react-select"
import { getAuthors } from "@/utils/supabase/client"
import { Author } from "@/utils/types/database"
import { CATEGORIES } from "@/utils/hooks/useArticles"
import { useCallback, useEffect, useState } from "react"

const convertDate = (dateStr: string) => {
  // Convert from DD.MM.YYYY to YYYY-MM-DD for proper date comparison
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
};

const sortArticles = (articles, sortType) => {
  return [...articles].sort((a, b) => {
    switch(sortType) {
      case 'newest':
        return convertDate(b.date).getTime() - convertDate(a.date).getTime();
      case 'oldest':
        return convertDate(a.date).getTime() - convertDate(b.date).getTime();
      case 'most popular':
        return (b.engagement?.views || 0) - (a.engagement?.views || 0);
      default:
        return 0;
    }
  });
};

export type FilterBarProps = {
  searchPlaceholder: string
  showSearch: boolean
  showAuthorFilter: boolean
  showCategoryFilter: boolean
  showSortFilter: boolean
  backgroundColor: string
  borderColor: string
  padding: string
  onFilterChange?: (filters: any) => void
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Popular", value: "most popular" }
]

export const FilterBar: ComponentConfig<FilterBarProps> = {
  fields: {
    searchPlaceholder: { type: "text" },
    showSearch: {
      type: "radio",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ]
    },
    showAuthorFilter: {
      type: "radio", 
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ]
    },
    showCategoryFilter: {
      type: "radio",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ]
    },
    showSortFilter: {
      type: "radio",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ]
    },
    backgroundColor: { type: "text" },
    borderColor: { type: "text" },
    padding: {
      type: "select",
      options: [
        { label: "Small", value: "p-2" },
        { label: "Medium", value: "p-4" },
        { label: "Large", value: "p-6" }
      ]
    }
  },
  defaultProps: {
    searchPlaceholder: "Search articles...",
    showSearch: true,
    showAuthorFilter: true,
    showCategoryFilter: true,
    showSortFilter: true,
    backgroundColor: "bg-adaptive-primary",
    borderColor: "border-adaptive-secondaryAlt",
    padding: "p-4"
  },
  render: ({ 
    searchPlaceholder,
    showSearch,
    showAuthorFilter,
    showCategoryFilter,
    showSortFilter,
    backgroundColor,
    borderColor,
    padding,
    onFilterChange
  }) => {
    const [authors, setAuthors] = useState<Author[]>([])
    const [filters, setFilters] = useState({
      search: "",
      author: "",
      category: "",
      sort: "newest"
    })

    const loadAuthors = useCallback(async () => {
      const authorData = await getAuthors()
      setAuthors(authorData)
    }, [])

    useEffect(() => {
      loadAuthors()
    }, [loadAuthors])

    const handleSortChange = (value: string) => {
      setFilters(prev => ({ ...prev, sort: value }));
      onFilterChange?.({ sort: value, sortFunction: (articles) => sortArticles(articles, value) });
    };

    const categories = [
      { label: 'All Categories', value: 'all' },
      { label: 'Awareness', value: 'Awareness' },
      { label: 'Control', value: 'Control' },
      { label: 'Escape', value: 'Escape' },
      { label: 'Present', value: 'Present' },
      { label: 'Soul', value: 'Soul' }
    ];

    return (
      <div className={`w-full mb-8 ${backgroundColor}`}>
        <div className={`flex items-center gap-3 ${padding} pr-4`}>
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onFilterChange?.({ search: e.target.value })}
                className="w-full pl-10 py-2 bg-adaptive-primary hover:bg-adaptive-primaryAlt focus:ring-adaptive-accent rounded-md"
              />
            </div>
          )}

          {showAuthorFilter && authors.length > 0 && (
            <Select.Root onValueChange={(value) => onFilterChange?.({ author: value === 'all' ? '' : value })}>
              <Select.Trigger 
                className="relative px-3 py-2 border rounded-md min-w-[140px] bg-adaptive-primary flex justify-center outline-none"
                aria-label="Select Author"
              >
                <Select.Value placeholder="Author" className="text-center flex-1" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content 
                  className="w-[140px] py-2 bg-adaptive-primary border rounded-md shadow-lg z-10 fixed"
                  position="popper"
                  sideOffset={5}
                  align="start"
                  style={{
                    transform: 'translateY(0)',
                    WebkitTransform: 'translateY(0)'
                  }}
                >
                  <Select.Viewport className="max-h-[300px] overflow-visible">
                  <Select.Item value="all" className="px-4 py-2 hover:bg-adaptive-primaryAlt hover:text-adaptive-accent cursor-pointer rounded-sm outline-none flex justify-center text-center">
                      <Select.ItemText>All Authors</Select.ItemText>
                    </Select.Item>
                    {authors.map(author => (
                      <Select.Item 
                        key={author.id}
                        value={author.id}
                        className="px-4 py-2 hover:bg-adaptive-primaryAlt hover:text-adaptive-accent cursor-pointer rounded-sm outline-none flex text-center justify-center"
                      >
                        <Select.ItemText>{author.pen_name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          )}

          {showCategoryFilter && (
            <Select.Root
              onValueChange={(value) => {
                setFilters(prev => ({ ...prev, category: value }));
                onFilterChange?.({ category: value === 'all' ? '' : value });
              }}
            >
              <Select.Trigger className="relative px-3 py-2 border rounded-md w-[140px] bg-adaptive-primary text-adaptive-secondary flex outline-none cursor-pointer justify-center">
                <Select.Value placeholder="Category" className="w-full truncate text-center" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content 
                  className="w-[140px] py-2 border rounded-md bg-adaptive-primary shadow-lg outline-none cursor-pointer text-center" 
                  position="popper"
                  sideOffset={5}
                  align="start"
                >
                  <Select.Viewport className="max-h-[300px] overflow-visible">
                    {categories.map(({ label, value }) => (
                      <Select.Item 
                      key={value} 
                      value={value}
                      className="px-3 py-2 hover:bg-adaptive-primaryAlt hover:text-adaptive-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText className="truncate">{label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          )}

{showSortFilter && (
          <Select.Root onValueChange={handleSortChange}>
            <Select.Trigger className="px-3 py-2 border rounded-md min-w-[140px] outline-none">
              <Select.Value placeholder="Sort by" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content 
                className="w-[140px] py-2 border rounded-md bg-adaptive-primary shadow-lg outline-none cursor-pointer text-center"
                position="popper"
                sideOffset={5}
                align="start"
              >
                <Select.Viewport>
                  {sortOptions.map(option => (
                    <Select.Item 
                      key={option.value}
                      value={option.value}
                      className="px-4 py-2 hover:bg-adaptive-primaryAlt hover:text-adaptive-accent cursor-pointer outline-none"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      </div>
        <div className={`w-11/12 mx-auto h-px ${borderColor}`} />
      </div>
    )
  }
}