import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { ComponentConfig } from "@measured/puck";
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";

interface ToggleItem {
  value: string;
  label: string;
  icon: string;
}

export interface ToggleGroupProps {
  items: ToggleItem[];
  type: "single" | "multiple";
  defaultValue?: string | string[];
  ariaLabel: string;
  itemClassName: string;
  iconClassName: string;
}

export const ToggleGroup: ComponentConfig<ToggleGroupProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item: ToggleItem) => item.label,
      arrayFields: {
        value: { type: "text" },
        label: { type: "text" },
        icon: { 
          type: "select",
          options: [
            { label: "Bold", value: "bold" },
            { label: "Italic", value: "italic" },
            { label: "Underline", value: "underline" }
          ]
        }
      }
    },
    type: {
      type: "select",
      options: [
        { label: "Single", value: "single" },
        { label: "Multiple", value: "multiple" }
      ]
    },
    defaultValue: { type: "text" },
    ariaLabel: { type: "text" },
    itemClassName: { type: "text" },
    iconClassName: { type: "text" }
  },

  defaultProps: {
    items: [
      { value: "bold", label: "Bold", icon: "bold" },
      { value: "italic", label: "Italic", icon: "italic" },
      { value: "underline", label: "Underline", icon: "underline" }
    ],
    type: "multiple",
    ariaLabel: "Text formatting",
    itemClassName: clsx(
      "group radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
      "bg-white dark:bg-gray-800",
      "border-y px-2.5 py-2 first:rounded-l-md first:border-x last:rounded-r-md last:border-x",
      "border-gray-200 radix-state-on:border-transparent dark:border-gray-600",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    iconClassName: "w-5 h-5 text-gray-700 dark:text-gray-100"
  },

  render: ({ items, type, defaultValue, ariaLabel, itemClassName, iconClassName }) => {
    const getIcon = (iconName: string) => {
      const icons = {
        bold: <FontBoldIcon />,
        italic: <FontItalicIcon />,
        underline: <UnderlineIcon />
      };
      return icons[iconName as keyof typeof icons];
    };

    return (
      <ToggleGroupPrimitive.Root
        type={type}
        defaultValue={defaultValue}
        aria-label={ariaLabel}
      >
        {items.map(({ value, label, icon }) => (
          <ToggleGroupPrimitive.Item
            key={value}
            value={value}
            aria-label={label}
            className={itemClassName}
          >
            {React.cloneElement(getIcon(icon), {
              className: iconClassName
            })}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }
};