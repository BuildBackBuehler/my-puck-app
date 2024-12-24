import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";

export interface ColumnsProps {
  distribution: "auto" | "manual";
  columns: {
    span?: number;
    id?: string;
  }[];
}

export const Columns: ComponentConfig<ColumnsProps> = {
  resolveData: ({ props }, { lastData }) => {
    if (lastData?.props.columns.length === props.columns.length) return { props };

    return {
      props: {
        ...props,
        columns: props.columns.map(column => ({
          ...column,
          id: column.id ?? generateId(),
        })),
      },
    };
  },

  fields: {
    distribution: {
      type: "radio",
      options: [
        { value: "auto", label: "Auto" },
        { value: "manual", label: "Manual" },
      ],
    },
    columns: {
      type: "array",
      getItemSummary: (col) => `Column (span ${col.span || "auto"})`,
      arrayFields: {
        span: {
          label: "Span (1-12)",
          type: "number",
          min: 1,
          max: 12,
        },
      },
    },
  },

  defaultProps: {
    distribution: "auto",
    columns: [{ span: 6 }, { span: 6 }],
  },

  render: ({ columns, distribution }) => {
    const getGridCols = () => {
      if (distribution === "manual") return "grid-cols-12";
      return columns.length <= 4 
        ? `grid-cols-${columns.length}` 
        : "grid-cols-12";
    };

    return (
      <div className="w-full px-4 py-8">
        <div className={`
          grid gap-6
          ${getGridCols()}
        `}>
          {columns.map(({ span = distribution === "auto" ? 12 / columns.length : 1, id }, i) => (
            <div
              key={id ?? i}
              className={distribution === "manual" ? `col-span-${Math.min(span, 12)}` : ""}
            >
              <DropZone
                zone={`column-${id ?? i}`}
                disallow={["Hero", "Logos", "Stats"]}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};