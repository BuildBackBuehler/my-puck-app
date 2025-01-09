import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";
import { useLayoutState } from '../../lib/layout-state'
import { DropColumn } from "./drop-column";

export interface ThreeColumnsProps {
  columns: {
    id?: string;
    width: number;
    className?: string;
  }[];
}

export const ThreeColumns: ComponentConfig<ThreeColumnsProps> = {
  resolveData: ({ props }, { lastData }) => {
    if (lastData?.props.columns.length === props.columns.length) return { props };

    return {
      props: {
        ...props,
        columns: props.columns.map(column => ({
          ...column,
          id: column.id ?? generateId()
        }))
      }
    };
  },

  defaultProps: {
    columns: [
      { width: 0, id: generateId() },  // Left column width managed by sidebar
      { width: 70, id: generateId() },
      { width: 30, id: generateId() }
    ]
  },

  render: ({ columns }) => {
    const { isSidebarOpen, isRightSidebarOpen } = useLayoutState()
    
    const sidebarWidth = isSidebarOpen 
      ? 'calc(7rem + ((100vw - 430px) * 0.15))' // Mobile to Desktop: 7rem -> 9rem -> 16rem
      : 'calc(2.5rem + ((100vw - 430px) * 0.05))' // Mobile to Desktop: 2.5rem -> 3rem -> 4rem
      
    const rightSidebarWidth = isRightSidebarOpen 
      ? `${columns[2].width}%` 
      : 'calc(2.5rem + ((100vw - 430px) * 0.05))'
      
    const mainWidth = isRightSidebarOpen ? columns[1].width : columns[1].width + 25

    return (
      <div 
        className="flex h-screen w-full overflow-hidden" 
        style={{ 
          paddingLeft: sidebarWidth,
          transition: 'padding-left 300ms'
        }}
      >
        <div className="flex-1 transition-all duration-300" style={{ width: `${mainWidth}%` }}>
          <DropZone zone={`column-${columns[1].id}`} />
        </div>
        <div className="flex-none transition-all duration-300" style={{ width: rightSidebarWidth }}>
          <DropZone zone={`column-${columns[2].id}`} />
        </div>
      </div>
    );
  }
};