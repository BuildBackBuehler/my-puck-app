import { ComponentConfig, DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";
import { useLayoutState } from '../../lib/layout-state'


export interface FixedColumnsProps {
  columns: {
    id?: string;
    width: number;
    className?: string;
  }[];
}

export const FixedColumns: ComponentConfig<FixedColumnsProps> = {
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
      { width: 20, id: generateId() },
      { width: 50, id: generateId() },
      { width: 30, id: generateId() }
    ]
  },

  render: ({ columns }) => {
    const { isSidebarOpen, isRightSidebarOpen } = useLayoutState()
    
    const sidebarWidth = isSidebarOpen 
      ? 'calc(7rem + ((100vw - 768px) * 0.15))'
      : 'calc(2.5rem + ((100vw - 768px) * 0.05))'

    const rightSidebarWidth = isRightSidebarOpen 
      ? `${columns[3].width}%` 
      : 'calc(2.5rem + ((100vw - 768px) * 0.05))'

    const expandedWidth = isRightSidebarOpen ? '50%' : '75%'

    return (
      <div 
        className="flex mb-8 md:mb-0 h-screen w-full overflow-hidden md:pl-[--sidebar-width]"
        style={{ 
          '--sidebar-width': sidebarWidth,
        } as any}
      >
        <div className="flex-none" style={{ width: `${columns[1].width}%` }}>
          <DropZone zone={`column-${columns[1].id}`} />
        </div>
        <div className="flex-1 transition-all duration-300" style={{ width: expandedWidth }}>
          <DropZone zone={`column-${columns[2].id}`} />
        </div>
        <div className="flex-none transition-all duration-300" style={{ width: rightSidebarWidth }}>
          <DropZone zone={`column-${columns[3].id}`} />
        </div>
      </div>
    );
  }
};