import { ComponentConfig } from "@measured/puck";
import { CSSProperties, ReactNode } from "react";
import { clsx } from "clsx";

export interface SectionProps {
  className?: string;
  children: ReactNode;
  padding?: string;
  maxWidth?: string;
  style?: CSSProperties;
}

export const Section: ComponentConfig<SectionProps> = {
  fields: {
    padding: { type: "text" },
    maxWidth: { type: "text" },
    className: { type: "text" },
    children: { type: "node" }
  },

  defaultProps: {
    padding: "0px",
    maxWidth: "1280px",
    className: "",
    children: null
  },

  render: ({ children, className, padding, maxWidth, style = {} }) => (
    <div
      className={clsx(
        "px-4 md:px-6 not-[.Section_.Section]",
        className
      )}
      style={{
        ...style,
        paddingTop: padding,
        paddingBottom: padding
      }}
    >
      <div 
        className="w-full mx-auto"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  )
};