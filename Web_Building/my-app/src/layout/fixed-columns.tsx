import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";

export interface FixedColumnsProps {
  columns: {
    id?: string;
    width: number;
    className: string;
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
      { width: 15, id: generateId(), className: 'flex-shrink h-full'},
      { width: 20, id: generateId(), className: 'flex-grow h-full' },
      { width: 35, id: generateId(), className: 'flex-grow h-full' },
      { width: 30, id: generateId(), className: 'flex-shrink h-full'}
    ]
  },

  render: ({ columns }) => (
    <div className="flex w-full h-screen">
      {columns.map((column) => (
        <div
          key={column.id || generateId()}
          style={{ width: `${column.width}%`, height: '100vh' }}
        >
          <DropZone zone={`column-${column.id}-${column.className}`} />
        </div>
      ))}
    </div>
  )
};