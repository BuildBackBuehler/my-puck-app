import { ComponentConfig } from "@measured/puck"
import { Search, ArrowUpDown } from "lucide-react"
import * as Select from "@radix-ui/react-select"
import * as Popover from "@radix-ui/react-popover"

interface SortOption {
  label: string
  field: 'date' | 'title' | 'engagement'
  direction: 'asc' | 'desc'
}

export interface FilterBarProps {
  authors: string[]
  categories: string[]
  onFilterChange?: (filters: { author?: string; category?: string }) => void
  onSortChange?: (sort: SortOption) => void
  onSearch?: (query: string) => void
}

const sortOptions: SortOption[] = [
  { label: "Newest First", field: "date", direction: "desc" },
  { label: "Oldest First", field: "date", direction: "asc" },
  { label: "Most Popular", field: "engagement", direction: "desc" },
  { label: "A-Z", field: "title", direction: "asc" },
  { label: "Z-A", field: "title", direction: "desc" }
]

export const FilterBar: ComponentConfig<FilterBarProps> = {
  fields: {
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
    authors: ["John Doe", "Jane Smith", "Alan Write"],
    categories: ["Technology", "Design", "Business", "Culture"]
  },

  render: ({ authors = [], categories = [], onFilterChange = () => {}, onSortChange = () => {}, onSearch = () => {} }) => {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 p-4 mt-12">
          <Select.Root onValueChange={(value) => onFilterChange({ author: value })}>
            <Select.Trigger className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:text-adaptive-accent focus:outline-none focus:ring-2 focus:ring-adaptive-accent">
              <Select.Value placeholder="Filter by Author" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-adaptive-primary border rounded-md shadow-lg">
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
            <Select.Trigger className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:text-adaptive-accent focus:outline-none focus:ring-2 focus:ring-adaptive-accent">
              <Select.Value placeholder="Filter by Category" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-adaptive-primary border rounded-md shadow-lg">
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

          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:text-adaptive-accent focus:outline-none focus:ring-2 focus:ring-adaptive-accent">
                <ArrowUpDown size={16} />
                <span>Sort</span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content 
                className="bg-adaptive-primary border rounded-md shadow-lg p-1 w-48"
                sideOffset={5}
              >
                {sortOptions.map((option) => (
                  <button
                    key={`${option.field}-${option.direction}`}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-adaptive-primaryAlt focus:outline-none"
                    onClick={() => onSortChange(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-adaptive-primary hover:text-adaptive-accent focus:outline-none focus:ring-2 focus:ring-adaptive-accent"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-11/12 mx-auto h-px bg-adaptive-secondaryAlt" />
      </div>
    )
  }
}