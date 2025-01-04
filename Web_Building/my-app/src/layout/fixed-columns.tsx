import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";

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
      { width: 15, id: generateId(), className: 'grid grid-cols-[auto,1fr,1fr,auto] h-full'},
      { width: 20, id: generateId() },
      { width: 35, id: generateId() },
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
            // minWidth: column.className?.includes('grid') ? 'min-content' : '15vw'
          }}
        >
          <DropZone zone={`column-${column.id}`} />
        </div>
      ))}
    </div>
  )
};