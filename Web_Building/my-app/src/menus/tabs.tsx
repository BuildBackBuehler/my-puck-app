import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";

interface Tab {
  title: string;
  value: string;
  content: string;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab: string;
  listClassName: string;
  triggerClassName: string;
  contentClassName: string;
  titleClassName: string;
  textClassName: string;
}

export const Tabs: ComponentConfig<TabsProps> = {
  fields: {
    tabs: {
      type: "array",
      getItemSummary: (item: Tab) => item.title,
      arrayFields: {
        title: { type: "text" },
        value: { type: "text" },
        content: { type: "textarea" }
      }
    },
    defaultTab: { type: "text" },
    listClassName: { type: "text" },
    triggerClassName: { type: "text" },
    contentClassName: { type: "text" },
    titleClassName: { type: "text" },
    textClassName: { type: "text" }
  },

  defaultProps: {
    tabs: [
      { title: "Tab 1", value: "tab1", content: "Tab 1 content" },
      { title: "Tab 2", value: "tab2", content: "Tab 2 content" }
    ],
    defaultTab: "tab1",
    listClassName: clsx("flex w-full rounded-t-lg bg-white dark:bg-gray-800"),
    triggerClassName: clsx(
      "group",
      "first:rounded-tl-lg last:rounded-tr-lg",
      "border-b first:border-r last:border-l",
      "border-gray-300 dark:border-gray-600",
      "radix-state-active:border-b-gray-700 radix-state-inactive:bg-gray-50",
      "dark:radix-state-active:border-b-gray-100 dark:radix-state-active:bg-gray-900 dark:radix-state-inactive:bg-gray-800",
      "flex-1 px-3 py-2.5",
      "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    contentClassName: clsx("rounded-b-lg bg-white px-6 py-4 dark:bg-gray-800"),
    titleClassName: clsx("text-sm font-medium", "text-gray-700 dark:text-gray-100"),
    textClassName: "text-sm text-gray-700 dark:text-gray-100"
  },

  render: ({ tabs, defaultTab, listClassName, triggerClassName, contentClassName, titleClassName, textClassName }) => (
    <TabsPrimitive.Root defaultValue={defaultTab}>
      <TabsPrimitive.List className={listClassName}>
        {tabs.map(({ title, value }) => (
          <TabsPrimitive.Trigger
            key={value}
            value={value}
            className={triggerClassName}
          >
            <span className={titleClassName}>{title}</span>
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map(({ value, content }) => (
        <TabsPrimitive.Content
          key={value}
          value={value}
          className={contentClassName}
        >
          <span className={textClassName}>{content}</span>
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
};