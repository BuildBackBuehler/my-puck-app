import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { ComponentConfig } from "@measured/puck";
import { FontBoldIcon, FontItalicIcon, UnderlineIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";

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
        value: { type: "text" }
      }
    },
    defaultValue: { type: "text" },
    className: { type: "text" }
  },

  defaultProps: {
    items: [
      { label: "Bold", value: "bold" },
      { label: "Italic", value: "italic" },
      { label: "Underline", value: "underline" },
      { label: "AlignLeft", value: "alignLeft" },
      { label: "AlignCenter", value: "alignCenter" },
      { label: "AlignRight", value: "alignRight" }
    ],
    defaultValue: ["bold","italic", "underline"],
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
              "inline-flex items-center justify-center px-3 py-2 text-sm font-medium",
              "bg-white first:rounded-l-md last:rounded-r-md hover:bg-gray-50",
              "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500"
            )}
          >
            {item.label}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }
};

export default ToggleGroup;