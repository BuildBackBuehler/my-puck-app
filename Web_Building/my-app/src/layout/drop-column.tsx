import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";
import { useLayoutState } from '../../lib/layout-state'
import { useState, useEffect } from 'react'

export interface DropColumnProps {
  padding: string;
  gap: string;
  id?: string;
  zoneCount: number;
  showDivider: boolean;
  initialState?: 'open' | 'closed';
}

export const DropColumn: ComponentConfig<DropColumnProps> = {

  fields: {
    padding: {
      type: "select",
      options: [
        { label: "None", value: "p-0" },
        { label: "Small", value: "p-4" },
        { label: "Medium", value: "p-8" },
        { label: "Large", value: "p-12" }
      ]
    },
    gap: {
      type: "select",
      options: [
        { label: "None", value: "gap-0" },
        { label: "Small", value: "gap-4" },
        { label: "Medium", value: "gap-8" },
        { label: "Large", value: "gap-12" }
      ]
    },
    zoneCount: {
      type: "number",
      min: 1,
      max: 10,
      defaultValue: 3
    },
    showDivider: {
      type: "radio",
      options: [
        { label: "Show Divider", value: true },
        { label: "Hide Divider", value: false }
      ],
      defaultValue: true
    },
    initialState: {
      type: "radio",
      options: [
        { label: "Initially Open", value: "open" },
        { label: "Initially Closed", value: "closed" }
      ],
      defaultValue: "open"
    }
  },

  defaultProps: {
    padding: "p-0",
    gap: "gap-0",
    zoneCount: 3,
    showDivider: true,
    initialState: "open"
  },

  render: ({ padding, gap, id, zoneCount, showDivider, initialState = 'open' }) => {
    const [isOpen, setIsOpen] = useState(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('rightSidebarState')
        return saved ? JSON.parse(saved) : true
      }
      return true
    })

    const { isRightSidebarOpen, setRightSidebarOpen } = useLayoutState()

    useEffect(() => {
      setRightSidebarOpen(isOpen)
      if (typeof window !== 'undefined') {
        localStorage.setItem('rightSidebarState', JSON.stringify(isOpen))
      }
    }, [isOpen, setRightSidebarOpen])

    useEffect(() => {
      const checkWidth = () => {
        const isMobileOrTablet = window.innerWidth <= 1024
        const newState = !isMobileOrTablet
        setIsOpen(newState)
        setRightSidebarOpen(newState)
        localStorage.setItem('rightSidebarState', JSON.stringify(newState))
      }

      checkWidth()
      window.addEventListener('resize', checkWidth)
      return () => window.removeEventListener('resize', checkWidth)
    }, [setRightSidebarOpen])

    return (
      <div className="h-full relative">
        {showDivider && (
          <div className={`absolute mb-16 md:mb-0 left-0 top-[10vh] w-px h-[90vh] bg-adaptive-secondaryAlt transition-opacity duration-300 ${
            isRightSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`} />
        )}
        <button 
          onClick={() => setRightSidebarOpen(!isRightSidebarOpen)}
          className={`
            absolute top-[51vh] md:top-[52vh] lg:top-[53vh] w-3.5 h-3.5 md:w-4 md:h-4 lg:w-6 lg:h-6 
            border border-adaptive-secondary text-adaptive-secondary 
            hover:text-adaptive-accent hover:border-adaptive-accent rounded-full 
            flex items-center justify-center cursor-pointer z-50
            transition-all duration-150
            ${isRightSidebarOpen ? 'left-2 opacity-40 hover:opacity-100' : 'right-2 opacity-40 hover:opacity-100'}
          `}
        >
          <span className="text-3xs md:text-sm lg:text-base bg-adaptive-secondary"></span>
          {isRightSidebarOpen ? '→' : '←'}
        </button>

        <div className={`h-full transition-all duration-300 ${
          isRightSidebarOpen ? 'opacity-100 w-full' : 'opacity-0'
        }`}>
          <div className={`h-full flex flex-col ${padding} ${gap}`}>
            {Array.from({ length: zoneCount }).map((_, index) => (
              <section 
                key={`${id}-${index}`}
                className={`${
                  index === zoneCount - 1 ? 'flex-1 min-h-0' : 'flex-none'
                } overflow-y-auto`}
              >
                <DropZone zone={`zone-${id}-${index}`} />
              </section>
            ))}
          </div>
        </div>
      </div>
    );
  }
};