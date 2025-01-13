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

export const FilterBar: ComponentConfig = {
  fields: {},
  render: () => (
    <div className="w-full mb-8">
      <div className="flex items-center gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 bg-adaptive-primary hover:bg-adaptive-primaryAlt focus:ring-adaptive-accent rounded-md"
          />
        </div>

        <Select.Root>
          <Select.Trigger className="px-3 py-2 border rounded-md">
            <Select.Value placeholder="Category" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-adaptive-primary border rounded-md shadow-lg">
              <Select.Viewport>
                {['All', 'Awareness', 'Control', 'Escape', 'Present', 'Soul'].map(category => (
                  <Select.Item 
                    key={category} 
                    value={category}
                    className="px-3 py-2 hover:bg-adaptive-primaryAlt hover:text-adaptive-accent cursor-pointer"
                  >
                    <Select.ItemText>{category}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <Select.Root>
          <Select.Trigger className="px-3 py-2 border rounded-md">
            <Select.Value placeholder="Sort by" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-adaptive-primary border hover:bg-adaptive-primaryAlt hover:text-adaptive-accent focus:ring-adaptive-accent rounded-md shadow-lg">
              <Select.Viewport>
                <Select.Item value="newest" className="px-3 py-2  cursor-pointer">
                  <Select.ItemText>Newest first</Select.ItemText>
                </Select.Item>
                <Select.Item value="oldest" className="px-3 py-2 cursor-pointer">
                  <Select.ItemText>Oldest first</Select.ItemText>
                </Select.Item>
                <Select.Item value="popular" className="px-3 py-2 cursor-pointer">
                  <Select.ItemText>Most popular</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
      <div className="w-11/12 mx-auto h-px bg-adaptive-secondaryAlt" />
    </div>
  )
};