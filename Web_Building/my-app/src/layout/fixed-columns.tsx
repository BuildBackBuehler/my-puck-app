import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";

export interface FixedColumnsProps {
  columns: {
    id?: string;
    width: number;
  }[];
}

export const FixedColumns: ComponentConfig<FixedColumnsProps> = {
  resolveData: ({ props }, { lastData }) => {
    if (lastData?.props.columns.length === props.columns.length) return { props };

    return {
      props: {
        columns: props.columns.map(column => ({
          ...column,
          id: column.id ?? generateId()
        }))
      }
    };
  },

  defaultProps: {
    columns: [
      { width: 20 },
      { width: 15 },
      { width: 35 },
      { width: 30 }
    ]
  },

  render: ({ columns }) => (
    <div className="flex w-full h-screen">
      {columns.map((column) => (
        <div
          key={column.id}
          style={{ width: `${column.width}%`, height: '100vh' }}
        >
          <DropZone zone={`column-${column.id}`} className="h-full" />
        </div>
      ))}
    </div>
  )
};