import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { ComponentConfig } from "@measured/puck";
import { FontBoldIcon, FontItalicIcon, UnderlineIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";

const dynamicIconImports = {
  bold: FontBoldIcon,
  italic: FontItalicIcon,
  underline: UnderlineIcon,
  alignLeft: TextAlignLeftIcon,
  alignCenter: TextAlignCenterIcon,
  alignRight: TextAlignRightIcon
};
export interface ToggleGroupProps {
  items: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  defaultValue?: string[];
  className?: string;
}

export const ToggleGroup: ComponentConfig<ToggleGroupProps> = {
  fields: {
    items: {
      type: "array",
      arrayFields: {
        label: { type: "text" },
        value: { type: "text" },
        icon: { type: "select", options: Object.keys(dynamicIconImports).map(name => ({ label: name, value: name })) },
      }
    },
    defaultValue: { type: "text" },
    className: { type: "text" }
  },

  defaultProps: {
    items: [
      { label: "Bold", value: "bold", icon: "bold" },
      { label: "Italic", value: "italic", icon: "italic" },
      { label: "Underline", value: "underline", icon: "underline" },
      { label: "AlignLeft", value: "alignLeft", icon: "alignLeft" },
      { label: "AlignCenter", value: "alignCenter", icon: "alignCenter" },
      { label: "AlignRight", value: "alignRight", icon: "alignRight" }
    ],
    defaultValue: ["bold"],
    className: "inline-flex rounded-md shadow-sm"
  },

  render: ({ items, defaultValue, className }) => {
    return (
      <ToggleGroupPrimitive.Root
        type="multiple"
        defaultValue={defaultValue}
        className={clsx("inline-flex rounded-md shadow-sm", className)}
      >
        {items.map((item) => (
          <ToggleGroupPrimitive.Item
            key={item.value}
            value={item.value}
            className={clsx(
              "group radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
              "bg-white dark:bg-gray-800",
              "border-y px-2.5 py-2 first:rounded-l-md first:border-x last:rounded-r-md last:border-x",
              "border-gray-200 radix-state-on:border-transparent dark:border-gray-600 dark:radix-state-on:border-transparent",
              "focus:relative focus:outline-none focus-visible:z-20 focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
            )}
          >
            {item.icon}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }
};

export default ToggleGroup;