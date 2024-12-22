import { ComponentConfig } from "@measured/puck";
import React from "react";
import { clsx } from "clsx";

export interface DemoCardProps {
  title: string;
  link: string;
  isNew?: boolean;
  cardClassName: string;
  headerClassName: string;
  titleClassName: string;
  badgeClassName: string;
  buttonClassName: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  darkGradientFrom: string;
  darkGradientVia: string;
  darkGradientTo: string;
  variant: "default" | "itemsCenter" | "justifyCenter";
}

export const DemoCard: ComponentConfig<DemoCardProps> = {
  fields: {
    title: { type: "text" },
    link: { type: "text" },
    isNew: { 
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false }
      ]
    },
    variant: {
      type: "radio",
      options: [
        { label: "Default", value: "default" },
        { label: "Items Center", value: "itemsCenter" },
        { label: "Justify Center", value: "justifyCenter" }
      ]
    },
    cardClassName: { type: "text" },
    headerClassName: { type: "text" },
    titleClassName: { type: "text" },
    badgeClassName: { type: "text" },
    buttonClassName: { type: "text" },
    gradientFrom: { type: "text" },
    gradientVia: { type: "text" },
    gradientTo: { type: "text" },
    darkGradientFrom: { type: "text" },
    darkGradientVia: { type: "text" },
    darkGradientTo: { type: "text" }
  },

  defaultProps: {
    title: "Demo Card",
    link: "#",
    isNew: false,
    variant: "default",
    cardClassName: "h-[550px] w-full scroll-mt-6",
    headerClassName: "absolute inset-x-0 top-0 rounded-t-xl flex items-center justify-between bg-black/50 px-4 py-2.5 dark:bg-black/30",
    titleClassName: "dark:text-gray-300 select-none text-sm font-medium text-white",
    badgeClassName: "px-1.5 py-0.5 rounded-full select-none text-[0.6rem] font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-800",
    buttonClassName: "select-none rounded bg-white/25 px-2 py-1.5 text-xs font-medium text-white hover:bg-white/30 dark:text-gray-100",
    gradientFrom: "pink-300",
    gradientVia: "fuchsia-200", 
    gradientTo: "purple-300",
    darkGradientFrom: "pink-800",
    darkGradientVia: "fuchsia-900",
    darkGradientTo: "purple-800"
  },

  render: ({ 
    title, 
    link,
    isNew,
    variant,
    cardClassName,
    headerClassName,
    titleClassName,
    badgeClassName,
    buttonClassName,
    gradientFrom,
    gradientVia,
    gradientTo,
    darkGradientFrom,
    darkGradientVia,
    darkGradientTo
  }) => {
    const id = title.replace(" ", "_").toLowerCase();

    const variantClasses = {
      default: "items-center justify-center",
      itemsCenter: "items-center",
      justifyCenter: "justify-center pt-24"
    };

    return (
      <section id={id} className={cardClassName}>
        <div className={clsx(
          "relative flex h-full w-full p-6 rounded-xl shadow",
          `bg-gradient-to-br from-${gradientFrom} via-${gradientVia} to-${gradientTo}`,
          `dark:from-${darkGradientFrom} dark:via-${darkGradientVia} dark:to-${darkGradientTo}`,
          variantClasses[variant]
        )}>
          <div className={headerClassName}>
            <div className="flex items-center space-x-2">
              <a href={`#${id}`} className={titleClassName}>{title}</a>
              {isNew && (
                <span className={badgeClassName}>NEW</span>
              )}
            </div>
            <a href={link} rel="noreferrer" target="_blank" className={buttonClassName}>
              Code
            </a>
          </div>
        </div>
      </section>
    );
  }
};
