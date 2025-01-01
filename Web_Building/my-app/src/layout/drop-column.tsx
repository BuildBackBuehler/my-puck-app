import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";

export interface DropColumnProps {
  padding: string;
  gap: string;
  id?: string;
  zoneCount: number;
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
    }
  },

  defaultProps: {
    padding: "p-0",
    gap: "gap-0",
    id: generateId(),
    zoneCount: 3
  },

  render: ({ padding, gap, id, zoneCount, puck }) => {
    return (
      <div className={`h-screen flex flex-col justify-start ${padding} ${gap} overflow-hidden`}>
        {Array.from({ length: zoneCount }).map((_, index) => (
          <section 
            key={`${id}-${index}`}
            className={index === zoneCount - 1 ? "flex-1 min-h-0 overflow-y-auto" : "flex-none"}
          >
            <DropZone zone={`zone-${id}-${index}`} />
          </section>
        ))}
      </div>
    );
  }
};