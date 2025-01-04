import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";
import { useLayoutState } from '../../lib/layout-state'

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
      { width: 15, id: generateId() },
      { width: 55, id: generateId() },
      { width: 30, id: generateId() }
    ]
  },

  render: ({ columns }) => (
    <div className="flex w-full h-screen">
      {columns.map((column) => (
        <div
          key={column.id || generateId()}
          className={`transition-all duration-300 ${column.className || ''}`}
          style={{ 
            width: `${column.width}%`,
            minWidth: column.className?.includes('grid') ? 'min-content' : undefined
          }}
        >
          <DropZone zone={`column-${column.id}`} />
        </div>
      ))}
    </div>
  )
};