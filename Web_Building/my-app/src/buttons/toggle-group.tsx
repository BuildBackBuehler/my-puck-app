import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { ComponentConfig } from "@measured/puck";
import { FontBoldIcon, FontItalicIcon, UnderlineIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";
import { Toggle as ToggleConfig, ToggleProps } from "./toggle";
const Toggle = ToggleConfig.render;

// interface ToggleOption {
//   value: string;
//   label: string;
// }

export interface ToggleGroupProps {
  Toggle: ToggleProps[];
  defaultValue?: string;
  className?: string;
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupPrimitive.ToggleGroupItemProps
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={clsx(
      'inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-white first:rounded-l-md last:rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
      className
    )}
    {...props}
  />
));

ToggleGroupItem.displayName = 'ToggleGroupItem';

export const ToggleGroup: ComponentConfig<ToggleGroupProps> = {
  fields: {
    Toggle: { type: "array", arrayFields: {
      type: "object",
      objectFields: {
        defaultPressed: { type: "boolean" },
        activeText: { type: "text" },
        inactiveText: { type: "text" },
        buttonClassName: { type: "text" },
        iconClassName: { type: "text" },
        textClassName: { type: "text" },
        showIcon: { type: "boolean" }
      }
    }},
    defaultValue: { type: "text" },
    className: { type: "text" }
  },

  defaultProps: {
    Toggle: [
      {
        defaultPressed: false,
        activeText: "Bold",
        inactiveText: "Bold",
        buttonClassName: "inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        iconClassName: "h-4 w-4",
        textClassName: "ml-2 leading-5",
        showIcon: true
      },
      {
        defaultPressed: false,
        activeText: "Italic",
        inactiveText: "Italic",
        buttonClassName: "inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        iconClassName: "h-4 w-4",
        textClassName: "ml-2 leading-5",
        showIcon: true
      },
      {
        defaultPressed: false,
        activeText: "Underline",
        inactiveText: "Underline",
        buttonClassName: "inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        iconClassName: "h-4 w-4",
        textClassName: "ml-2 leading-5",
        showIcon: true
      }
    ],
    defaultValue: "bold",
    className: "inline-flex rounded-md shadow-sm"
  },
  render: ({ Toggle, defaultValue, className }) => {
    return (
      <ToggleGroupPrimitive.Root
        type="single"
        className={clsx('inline-flex rounded-md shadow-sm', className)}
      >
        {Toggle.map((toggles) => (
          <ToggleGroupItem
            key={toggles.activeText}
            value={toggles.activeText}
          >
            {toggles.activeText}
          </ToggleGroupItem>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }
};