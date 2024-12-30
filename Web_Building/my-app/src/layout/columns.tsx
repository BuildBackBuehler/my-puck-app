import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";
import clsx from "clsx";

const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

export type ColumnsProps = {
  distribution: "auto" | "manual";
  columns: {
    span?: number;
    id?: string;
    height?: string;
  }[];
};

export const Columns: ComponentConfig<ColumnsProps> = {
  resolveData: ({ props }, { lastData }) => {
    if (lastData?.props.columns.length === props.columns.length) return { props };

    return {
      props: {
        ...props,
        columns: props.columns.map((column) => ({
          ...column,
          id: column.id ?? generateId(),
        })),
      },
    };
  },

  fields: {
    distribution: {
      type: "select",
      options: [
        { label: "Auto", value: "auto" },
        { label: "Manual", value: "manual" },
      ],
    },
    columns: {
      type: "array",
      arrayFields: {
        span: { type: "number", min: 1, max: 12 },
        height: { type: "text", label: "Height" },
      },
      defaultItemProps: {
        span: 1,
        height: "300px",
      },
    },
  },

  defaultProps: {
    distribution: "auto",
    columns: [
      { span: 6, height: "300px" },
      { span: 6, height: "300px" },
    ],
  },

  render: ({ columns, distribution }) => {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={clsx(
          "grid w-full",
          distribution === "auto" 
            ? `grid-cols-${Math.min(columns.length, 12)}`
            : "grid-cols-12"
        )}>
          {columns.map((column) => (
            <div
              key={column.id}
              className={clsx(
                "h-full w-full",
                distribution === "manual" && `col-span-${Math.min(column.span || 1, 12)}`
              )}
              style={{ 
                height: column.height || '300px',
                gridColumn: distribution === "auto" ? 'span 1' : undefined
              }}
            >
              <DropZone
                zone={`column-${column.id}`}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export default Columns;