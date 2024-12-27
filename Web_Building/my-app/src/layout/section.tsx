import { ComponentConfig, DropZone } from "@measured/puck";
import { CSSProperties, ReactNode } from "react";
import { clsx } from "clsx";

export interface SectionProps {
  className?: string;
  children: ReactNode;
  padding?: string;
  maxWidth?: string;
  height?: string;
}

export const Section: ComponentConfig<SectionProps> = {
  fields: {
    padding: { type: "text" },
    maxWidth: { type: "text" },
    height: { type: "text" },
    className: { type: "text" },
    children: { type: "custom" }
  },

  defaultProps: {
    padding: "0px",
    maxWidth: "1280px",
    height: "auto",
    className: "",
    children: []
  },

  render: ({ children, className, padding, maxWidth, height }) => (
    <div
      className={clsx(
        "px-4 md:px-6 not-[.Section_.Section]",
        className
      )}
      style={{
        paddingTop: padding,
        paddingBottom: padding,
        height: height || 'auto'
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