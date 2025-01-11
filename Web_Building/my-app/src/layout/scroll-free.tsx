import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";

export interface ScrollFreeProps {
  paddingX: string;
  paddingY: string;
  gap: string;
  id?: string;
  zoneCount: number;
}

export const ScrollFree: ComponentConfig<ScrollFreeProps> = {
  fields: {
    paddingX: {
      type: "select",
      options: [
        { label: "None", value: "px-0" },
        { label: "Small", value: "px-2 md:px-3 lg:px-4" },
        { label: "Medium", value: "px-4 md:px-6 lg:px-8" },
        { label: "Large", value: "px-6 md:px-9 lg:px-12" },
        { label: "Xtra-Large", value: "px-8 md:px-12 lg:px-16" }
      ]
    },
    paddingY: {
      type: "select",
      options: [
        { label: "None", value: "py-0" },
        { label: "Small", value: "py-2 md:py-3 lg:py-4" },
        { label: "Medium", value: "py-4 md:py-6 lg:py-8" },
        { label: "Large", value: "py-6 md:py-9 lg:py-12" },
        { label: "Xtra-Large", value: "py-8 md:py-12 lg:py-16" }
      ]
    },
    gap: {
      type: "select",
      options: [
        { label: "None", value: "gap-0" },
        { label: "Small", value: "gap-1 md:gap-2 lg:gap-4" },
        { label: "Medium", value: "gap-2 md:gap-4 lg:gap-6" },
        { label: "Large", value: "gap-4 md:gap-8 lg:gap-12" },
        { label: "Xtra-Large", value: "gap-6 md:gap-10 lg:gap-14" }
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
    paddingX: "px-0",
    paddingY: "py-0",
    gap: "gap-0",
    zoneCount: 3
  },

  render: ({ paddingX, paddingY, gap, id, zoneCount }) => (
    <div className="mt-14 h-screen overflow-y-auto snap-y snap-proximity pb-12">
      <div className={`flex flex-col ${paddingX} ${paddingY} ${gap}`}>
        {Array.from({ length: zoneCount }).map((_, index) => (
          <div 
            key={`${id}-${index}`}
            className="snap-start scroll-mt-4"
          >
            <DropZone zone={`zone-${id}-${index}`} />
          </div>
        ))}
      </div>
    </div>
  )
};