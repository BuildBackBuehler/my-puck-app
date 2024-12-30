import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { ComponentConfig } from "@measured/puck";
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { clsx } from "clsx";

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactNode>>((acc, name) => ({
  ...acc, [name]: React.createElement(dynamic(() => (dynamicIconImports as any)[name]))
}), {});

export interface HoverCardProps {
  trigger: {
    icon: string;
    className: string;
  };
  content: {
    title: string;
    description: string;
    icon: string;
    className: string;
    containerClassName: string;
    iconWrapperClassName: string;
  };
  arrowClassName: string;
}

export const HoverCard: ComponentConfig<HoverCardProps> = {
  fields: {
    trigger: {
      type: "object",
      objectFields: {
        icon: { type: "select", options: Object.keys(dynamicIconImports).map(name => ({ label: name, value: name })) },
        className: { type: "text" }
      }
    },
    content: {
      type: "object",
      objectFields: {
        title: { type: "text" },
        description: { type: "textarea" },
        icon: { type: "select", options: Object.keys(dynamicIconImports).map(name => ({ label: name, value: name })) },
        className: { type: "text" },
        containerClassName: { type: "text" },
        iconWrapperClassName: { type: "text" }
      }
    },
    arrowClassName: { type: "text" }
  },

  defaultProps: {
    trigger: {
      icon: "Code",
      className: "inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-2.5 dark:bg-gray-900"
    },
    content: {
      title: "Title",
      description: "Description",
      icon: "Code",
      className: clsx("radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
        "max-w-md rounded-lg p-4 md:w-full",
        "bg-white dark:bg-gray-800",
        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"),
      containerClassName: "flex h-full w-full space-x-4",
      iconWrapperClassName: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-inner bg-gray-50/60 p-2.5 dark:bg-gray-900"
    },
    arrowClassName: "fill-current text-white dark:text-gray-800"
  },

  render: ({ trigger, content, arrowClassName }) => (
    <HoverCardPrimitive.Root>
      <HoverCardPrimitive.Trigger asChild>
        <div className={trigger.className}>
          {icons[trigger.icon]}
        </div>
      </HoverCardPrimitive.Trigger>
      
      <HoverCardPrimitive.Content align="center" sideOffset={4} className={content.className}>
        <HoverCardPrimitive.Arrow className={arrowClassName} />
        
        <div className={content.containerClassName}>
          <div className={content.iconWrapperClassName}>
            {icons[content.icon]}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {content.title}
            </h3>
            <p className="mt-1 text-sm font-normal text-gray-700 dark:text-gray-400">
              {content.description}
            </p>
          </div>
        </div>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  )
};
