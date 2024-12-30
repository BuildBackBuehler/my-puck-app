import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ComponentConfig } from "@measured/puck";
import React from "react";
import { clsx } from "clsx";

export interface VertNavMenuProps {
  items: {
    label: string;
    type: 'link' | 'trigger';
    href?: string;
    content?: {
      columns: number;
      items: {
        title?: string;
        description?: string;
        href?: string;
      }[];
    };
  }[];
  styles: {
    menu: string;
    list: string;
    trigger: string;
    link: string;
    content: string;
    viewportWrapper: string;
    viewport: string;
    indicator: string;
  };
}

export const VertNavMenu: ComponentConfig<VertNavMenuProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item) => item.label,
      arrayFields: {
        label: { type: "text" },
        type: { 
          type: "radio",
          options: [
            { label: "Link", value: "link" },
            { label: "Trigger", value: "trigger" }
          ]
        },
        href: { type: "text" },
        content: {
          type: "object",
          objectFields: {
            columns: { type: "number" },
            items: {
              type: "array",
              arrayFields: {
                title: { type: "text" },
                description: { type: "text" },
                href: { type: "text" }
              }
            }
          }
        }
      }
    },
    styles: {
      type: "object",
      objectFields: {
        menu: { type: "text" },
        list: { type: "text" },
        trigger: { type: "text" },
        link: { type: "text" },
        content: { type: "text" },
        viewportWrapper: { type: "text" },
        viewport: { type: "text" },
        indicator: { type: "text" }
      }
    }
  },

  defaultProps: {
    items: [{
      type: "trigger",
      label: "Overview",
      content: {
        columns: 1,
        items: [{ title: "About", description: "Learn about us", href: "#" }]
      }
    }],
    styles: {
      menu: "relative w-64",
      list: "flex flex-col rounded-lg bg-white dark:bg-gray-800 p-2 space-y-2",
      trigger: "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-100 focus:outline-none focus-visible:ring",
      link: "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-100",
      content: "absolute w-64 left-full top-0 ml-2 rounded-lg",
      viewportWrapper: "absolute left-full top-0 ml-2 w-64",
      viewport: "relative shadow-lg rounded-md bg-white dark:bg-gray-800 overflow-hidden",
      indicator: "z-10 left-full flex items-center justify-center w-2 overflow-hidden"
    }
  },

  render: ({ items, styles }) => (
    <NavigationMenuPrimitive.Root className={styles.menu}>
      <NavigationMenuPrimitive.List className={styles.list}>
        {items.map((item, i) => (
          <NavigationMenuPrimitive.Item key={i} className="relative">
            {item.type === 'trigger' ? (
              <>
                <NavigationMenuPrimitive.Trigger className={styles.trigger}>
                  {item.label}
                </NavigationMenuPrimitive.Trigger>
                {item.content && (
                  <NavigationMenuPrimitive.Content className={styles.content}>
                    <div className="p-3">
                      {item.content.items.map((contentItem, j) => (
                        <NavigationMenuPrimitive.Link key={j} href={contentItem.href} className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">
                          {contentItem.title && <div className="font-medium">{contentItem.title}</div>}
                          {contentItem.description && <div className="mt-1 text-sm text-gray-500">{contentItem.description}</div>}
                        </NavigationMenuPrimitive.Link>
                      ))}
                    </div>
                  </NavigationMenuPrimitive.Content>
                )}
              </>
            ) : (
              <NavigationMenuPrimitive.Link href={item.href} className={styles.link}>
                {item.label}
              </NavigationMenuPrimitive.Link>
            )}
          </NavigationMenuPrimitive.Item>
        ))}
        <NavigationMenuPrimitive.Indicator className={styles.indicator}>
          <div className="relative bg-white dark:bg-gray-800 w-2 h-2 rotate-45" />
        </NavigationMenuPrimitive.Indicator>
      </NavigationMenuPrimitive.List>

      <div className={styles.viewportWrapper}>
        <NavigationMenuPrimitive.Viewport className={styles.viewport} />
      </div>
    </NavigationMenuPrimitive.Root>
  )
};
