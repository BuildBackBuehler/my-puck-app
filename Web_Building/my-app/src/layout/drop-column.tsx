import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";
import { useLayoutState } from '../../lib/layout-state'

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

  render: ({ padding, gap, id, zoneCount }) => {
    const { isRightSidebarOpen, setRightSidebarOpen } = useLayoutState()

    return (
      <div className={`relative transition-all duration-300 ${isRightSidebarOpen ? 'w-full' : 'w-16'} ml-auto`}>
        <div className={`absolute left-0 top-40 w-px h-full bg-adaptive-secondaryAlt ${isRightSidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}/>
        <button 
          onClick={() => setRightSidebarOpen(!isRightSidebarOpen)}
          className="absolute -left-3 top-1/2 w-6 h-6 border border-adaptive-secondary text-adaptive-secondary hover:text-adaptive-accent hover:border-adaptive-accent rounded-full flex items-center justify-center cursor-pointer z-50"
        >
          {isRightSidebarOpen ? '→' : '←'}
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${isRightSidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}>
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
        </div>
      </div>
    );
  }
};
