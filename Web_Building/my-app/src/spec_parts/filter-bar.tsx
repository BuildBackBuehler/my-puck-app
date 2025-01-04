import { ComponentConfig } from "@measured/puck";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import * as Popover from "@radix-ui/react-popover";

export interface FilterCriteria {
  author?: string;
  category?: string;
}

export interface FilterBarProps {
  authors: string[];
  categories: string[];
  onFilterChange?: (filters: FilterCriteria) => void;
  onSortChange?: (sort: SortCriteria) => void;
  onSearch?: (query: string) => void;
}

type SortCriteria = {
  field: 'date' | 'title' | 'category';
  direction: 'asc' | 'desc';
}

export const FilterBar: ComponentConfig<FilterBarProps> = {
  fields: {
    authors: {
      type: "array",
      arrayFields: {
        type: { type: "text" }
      }
    },
    categories: {
      type: "array",
      arrayFields: {
        type: { type: "text" }
      }
    }
  },

  defaultProps: {
    authors: ["John Doe", "Jane Smith", "Alan Write"],
    categories: ["Technology", "Design", "Business", "Culture"],
    onFilterChange: (filters: FilterCriteria) => console.log('Filter changed:', filters),
    onSortChange: (sort: SortCriteria) => console.log('Sort changed:', sort),
    onSearch: (query: string) => console.log('Search query:', query)
  },

  render: ({ authors = [], categories = [], onFilterChange = () => {}, onSortChange = () => {}, onSearch = () => {} }) => {
    return (
      <div className="flex items-center gap-4 p-4 border-b border-adaptive-secondaryAlt pt-[6.7vh]">
        <Select.Root onValueChange={(value) => onFilterChange({ author: value })}>
          <Select.Trigger className="inline-flex items-center gap-2 px-3 py-2 border rounded-md focus:bg-adaptive-primaryAlt  focus:text-adaptive-accent hover:text-adaptive-accent ">
            <Select.Value placeholder="Filter by Author" />
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content className="border rounded-md shadow-lg">
              <Select.Viewport>
                {authors.map((author) => (
                  <Select.Item 
                    key={author} 
                    value={author}
                    className="px-3 py-2 outline-none cursor-pointer hover:bg-adaptive-primaryAlt"
                  >
                    <Select.ItemText>{author}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <Select.Root onValueChange={(value) => onFilterChange({ category: value })}>
          <Select.Trigger className="inline-flex items-center gap-2 px-3 py-2 border rounded-md focus:bg-adaptive-primaryAlt focus:text-adaptive-accent hover:text-adaptive-accent">
            <Select.Value placeholder="Filter by Category" />
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content className="border rounded-md shadow-lg">
              <Select.Viewport>
                {categories.map((category) => (
                  <Select.Item 
                    key={category} 
                    value={category}
                    className="px-3 py-2 outline-none cursor-pointer hover:bg-adaptive-primaryAlt"
                  >
                    <Select.ItemText>{category}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 bg-adaptive-primary" size={16} />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-adaptive-primary focus:outline-none focus:ring-2 focus:ring-adaptive-accent focus:border-adaptive-accent"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    );
  }
};