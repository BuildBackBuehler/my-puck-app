import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ComponentConfig } from "@measured/puck";
import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { clsx } from "clsx";

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactElement>>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);
  return {
    ...acc,
    [iconName]: <El />,
  };
}, {});

export interface AccordionProps {
  items: {
    header: string;
    content: string;
    defaultOpen?: boolean;
    headerClassName?: string;
    contentClassName?: string;
    iconClassName?: string;
  }[];
  type?: "single" | "multiple";
  className?: string;
}

export const Accordion: ComponentConfig<AccordionProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item) => item.header || "Accordion Item",
      arrayFields: {
        header: { 
          type: "text",
          label: "Header Text"
        },
        content: { 
          type: "textarea",
          label: "Content" 
        },
        defaultOpen: {
          type: "radio",
          label: "Initial State",
          options: [
            { label: "Open", value: true },
            { label: "Closed", value: false }
          ]
        },
        headerClassName: {
          type: "text",
          label: "Header Custom Class"
        },
        contentClassName: {
          type: "text",
          label: "Content Custom Class"
        },
        iconClassName: {
          type: "text",
          label: "Icon Custom Class"
        }
      }
    },
    type: {
      type: "radio",
      options: [
        { label: "Single Open", value: "single" },
        { label: "Multiple Open", value: "multiple" }
      ]
    },
    className: {
      type: "text",
      label: "Container Custom Class"
    }
  },

  defaultProps: {
    items: [{
      header: "Accordion Header",
      content: "Accordion Content",
      defaultOpen: false,
      headerClassName: "text-sm font-medium text-gray-900 dark:text-gray-100",
      contentClassName: "text-sm text-gray-700 dark:text-gray-400",
      iconClassName: "ml-2 h-5 w-5 shrink-0 text-gray-700 ease-in-out dark:text-gray-400"
    }],
    type: "single",
    className: "space-y-4 w-full"
  },

  render: ({ items, type, className }) => {
    return (
      <AccordionPrimitive.Root
        type={type}
        className={clsx("space-y-4 w-full", className)}
      >
        {items.map(({ header, content, defaultOpen, headerClassName, contentClassName, iconClassName }, i) => (
          <AccordionPrimitive.Item
            key={`accordion-item-${i}`}
            value={`item-${i}`}
            className="rounded-lg focus-within:ring focus-within:ring-purple-500 focus-within:ring-opacity-75 focus:outline-none"
          >
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger
                className={clsx(
                  "group",
                  "radix-state-open:rounded-t-lg radix-state-closed:rounded-lg",
                  "focus:outline-none",
                  "inline-flex w-full items-center justify-between bg-white px-4 py-2 text-left dark:bg-gray-800"
                )}
              >
                <span className={headerClassName}>{header}</span>
                <ChevronDownIcon
                  className={clsx(
                    iconClassName,
                    "group-radix-state-open:rotate-180 group-radix-state-open:duration-300"
                  )}
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content
              className="pt-1 w-full rounded-b-lg bg-white px-4 pb-3 dark:bg-gray-800"
            >
              <div className={contentClassName}>{content}</div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    );
  }
};
