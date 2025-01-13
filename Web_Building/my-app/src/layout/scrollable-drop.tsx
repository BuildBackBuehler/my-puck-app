import { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { generateId } from "../../lib/generate-id";
import { useLayoutState } from '../../lib/layout-state'
import { useRef, useEffect } from 'react';

export interface ScrollColumnProps {
  padding: string;
  gap: string;
  id?: string;
  zoneCount: number;
}

export const ScrollColumn: ComponentConfig<ScrollColumnProps> = {

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
    zoneCount: 3
  },

  render: ({ padding, gap, id, zoneCount }) => {
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const section = entry.target as HTMLElement;
              section.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          });
        },
        {
          root: null,
          threshold: 0.5,
          rootMargin: '-20% 0px -20% 0px'
        }
      );

      sectionRefs.current.forEach((section) => {
        if (section) observer.observe(section);
      });

      return () => observer.disconnect();
    }, [zoneCount]);

    return (
      <div className="h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        <div className="relative min-h-full">
          <div className={`flex flex-col ${padding} ${gap}`}>
            {Array.from({ length: zoneCount }).map((_, index) => (
              <section 
                key={`${id}-${index}`} 
                ref={el => sectionRefs.current[index] = el}
                className="min-h-screen snap-center"
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