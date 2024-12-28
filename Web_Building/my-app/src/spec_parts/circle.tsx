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
    <section className="relative w-full max-w-3xl mx-auto aspect-[2/1] overflow-hidden">
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 
          w-[200%] aspect-square rounded-[50%] bg-gray-800"
      >
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 
            text-center w-full max-w-xl px-4"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {blurb}
          </p>
          <span className="text-2xl font-serif italic">{subtitle}</span>
        </div>
      </div>
    </section>
  )
};