import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ComponentConfig } from "@measured/puck";
import React from "react";
import { clsx } from "clsx";

export interface NavigationMenuProps {
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

export const NavigationMenu: ComponentConfig<NavigationMenuProps> = {
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
        columns: 2,
        items: [{ title: "About", description: "Learn about us", href: "#" }]
      }
    }],
    styles: {
      menu: "relative",
      list: "flex flex-row rounded-lg bg-white dark:bg-gray-800 p-2 space-x-2",
      trigger: "px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-100 focus:outline-none focus-visible:ring",
      link: "px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-100",
      content: "absolute w-auto top-0 left-0 rounded-lg radix-motion-from-start:animate-enter-from-left radix-motion-from-end:animate-enter-from-right radix-motion-to-start:animate-exit-to-left radix-motion-to-end:animate-exit-to-right",
      viewportWrapper: "absolute flex justify-center w-[140%] left-[-20%] top-[100%]",
      viewport: "relative mt-2 shadow-lg rounded-md bg-white dark:bg-gray-800 overflow-hidden w-radix-navigation-menu-viewport h-radix-navigation-menu-viewport radix-state-open:animate-scale-in-content radix-state-closed:animate-scale-out-content origin-[top_center] transition-[width_height] duration-300 ease-[ease]",
      indicator:"z-10 top-[100%] flex items-end justify-center h-2 overflow-hidden radix-state-visible:animate-fade-in radix-state-hidden:animate-fade-out transition-[width_transform] duration-[250ms] ease-[ease]",
    }
  },

  render: ({ items, styles }) => (
    <NavigationMenuPrimitive.Root className={styles.menu}>
      <NavigationMenuPrimitive.List className={styles.list}>
        {items.map((item, i) => (
          <NavigationMenuPrimitive.Item key={i}>
            {item.type === 'trigger' ? (
              <>
                <NavigationMenuPrimitive.Trigger className={styles.trigger}>
                  {item.label}
                </NavigationMenuPrimitive.Trigger>
                {item.content && (
                  <NavigationMenuPrimitive.Content className={styles.content}>
                    <div className="p-3 grid" style={{ gridTemplateColumns: `repeat(${item.content.columns}, 1fr)` }}>
                      {item.content.items.map((contentItem, j) => (
                        <NavigationMenuPrimitive.Link key={j} href={contentItem.href} className="p-3">
                          {contentItem.title && <div className="font-medium">{contentItem.title}</div>}
                          {contentItem.description && <div className="mt-1 text-sm">{contentItem.description}</div>}
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
          <div className="top-1 relative bg-white dark:bg-gray-800 w-2 h-2 rotate-45" />
        </NavigationMenuPrimitive.Indicator>
      </NavigationMenuPrimitive.List>

      <div className={styles.viewportWrapper} style={{ perspective: "2000px" }}>
        <NavigationMenuPrimitive.Viewport className={styles.viewport} />
      </div>
    </NavigationMenuPrimitive.Root>
  )
};
