import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "@measured/puck";
import { Section } from "./section";
import { clsx } from "clsx";
import React from "react";

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
      getItemSummary: (col) => `Column (span ${col.span ? Math.max(Math.min(col.span, 12), 1) : "auto"})`,
      arrayFields: {
        span: {
          label: "Span (1-12)",
          type: "number",
          min: 0,
          max: 12,
        },
      },
    },
  },

  defaultProps: {
    distribution: "auto",
    columns: [{}, {}],
  },

  render: ({ columns, distribution }) => {
    return (
      <section>
        <div
          className={clsx(
            "flex flex-col gap-6 min-h-0 min-w-0",
            "md:grid",
            distribution === "manual" ? "md:grid-cols-12" : `md:grid-cols-${columns.length}`
          )}
        >
          {columns.map(({ span, id }, idx) => (
            <div
              key={id ?? idx}
              className="flex flex-col"
              style={span && distribution === "manual" ? {
                gridColumn: `span ${Math.max(Math.min(span, 12), 1)}`
              } : undefined}
            >
              <DropZone
                zone={`column-${id ?? idx}`}
                disallow={["Hero", "Logos", "Stats"]}
              />
            </div>
          ))}
        </div>
      </section>
    );
  },
};