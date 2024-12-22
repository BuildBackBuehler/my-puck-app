import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ComponentConfig } from "@measured/puck";
import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { clsx } from "clsx";

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactElement>>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);
  return { ...acc, [iconName]: <El /> };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export interface CollapsibleProps {
  headerText: string;
  headerClassName: string;
  triggerIcon: string;
  triggerIconClassName: string;
  items: {
    title: string;
    className: string;
    shareIcon: string;
    actionIcon: string;
    iconClassName: string;
  }[];
  defaultOpen?: boolean;
}

export const Collapsible: ComponentConfig<CollapsibleProps> = {
  fields: {
    headerText: {
      type: "text",
      label: "Header Text"
    },
    headerClassName: {
      type: "text",
      label: "Header Style Classes"
    },
    triggerIcon: {
      type: "select",
      options: iconOptions
    },
    triggerIconClassName: {
      type: "text",
      label: "Trigger Icon Classes"
    },
    defaultOpen: {
      type: "radio",
      options: [
        { label: "Open", value: true },
        { label: "Closed", value: false }
      ]
    },
    items: {
      type: "array",
      getItemSummary: (item) => item.title,
      arrayFields: {
        title: { 
          type: "text" 
        },
        className: { 
          type: "text",
          label: "Item Style Classes"
        },
        shareIcon: {
          type: "select",
          options: iconOptions
        },
        actionIcon: {
          type: "select",
          options: iconOptions
        },
        iconClassName: {
          type: "text",
          label: "Icons Style Classes"
        }
      }
    }
  },

  defaultProps: {
    headerText: "My Playlists",
    headerClassName: "text-left text-sm font-medium",
    triggerIcon: "ChevronRight",
    triggerIconClassName: "transform duration-300 ease-in-out group-radix-state-open:rotate-90",
    defaultOpen: true,
    items: [{
      title: "Example Playlist",
      className: "ml-12 flex select-none items-center justify-between rounded-md px-4 py-2 text-left text-sm font-medium bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900",
      shareIcon: "Share2",
      actionIcon: "Play",
      iconClassName: "cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    }]
  },

  render: ({ headerText, headerClassName, triggerIcon, triggerIconClassName, items, defaultOpen }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
      <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <CollapsiblePrimitive.Trigger
          className={clsx(
            "group flex w-full select-none items-center justify-between rounded-md px-4 py-2",
            "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100",
            "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
            headerClassName
          )}
        >
          <div>{headerText}</div>
          {triggerIcon && icons[triggerIcon] && 
            <div className={triggerIconClassName}>
              {icons[triggerIcon]}
            </div>
          }
        </CollapsiblePrimitive.Trigger>
        
        <CollapsiblePrimitive.Content className="mt-4 flex flex-col space-y-4">
          {items.map((item, i) => (
            <div key={`collapsible-item-${i}`} className={clsx("group", item.className)}>
              {item.title}
              <div className="hidden items-center space-x-3 group-hover:flex">
                {item.shareIcon && icons[item.shareIcon] && 
                  <div className={item.iconClassName}>
                    {icons[item.shareIcon]}
                  </div>
                }
                {item.actionIcon && icons[item.actionIcon] && 
                  <div className={item.iconClassName}>
                    {icons[item.actionIcon]}
                  </div>
                }
              </div>
            </div>
          ))}
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    );
  }
};
