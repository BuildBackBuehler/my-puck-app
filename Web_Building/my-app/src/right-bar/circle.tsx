//src/components/featured/Circle.tsx
import { ComponentConfig } from "@measured/puck";

export interface CircleProps {
  title: string;
  subtitle: string;
  blurb: string;
}

export const Circle: ComponentConfig<CircleProps> = {
  fields: {
    title: { type: "text" },
    subtitle: { type: "text" },
    blurb: { type: "textarea" }
  },
  defaultProps: {
    title: "Leave Your Old Life Behind",
    subtitle: "Explore",
    blurb: "Don't try to be like someone else, be yourself. Be secure with yourself."
  },
  render: ({ title, subtitle, blurb }) => (
    <section className="hidden lg:block mt-80 relative w-full max-w-3xl mx-auto aspect-[2/1]">
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 
          w-[95%] aspect-square rounded-[50%] bg-adaptive-secondary"
      >
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 
            text-center w-full max-w-xl px-4"
        >
          <h2 className="text-adaptive-primary text-sm lg:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-3xs lg:text-xl text-red mb-8 leading-relaxed">
            {blurb}
          </p>
          <span className="text-adaptive-primary text-xs lg:text-2xl font-serif italic pb-2">{subtitle}</span>
        </div>
      </div>
    </section>
  )
};