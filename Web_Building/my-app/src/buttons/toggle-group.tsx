import { ComponentConfig } from "@measured/puck";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { clsx } from "clsx";
import React from "react";

interface ToggleItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  items: ToggleItem[];
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  itemClassName?: string;
  iconClassName?: string;
}

render: ({
  items,
  type = "multiple",
  defaultValue,
  itemClassName,
  iconClassName = "w-5 h-5 text-gray-700 dark:text-gray-100",
}) => (
  <ToggleGroupPrimitive.Root
    type={type}
    defaultValue={defaultValue}
    aria-label="Toggle options"
  >
    {items.map(({ value, label, icon }) => (
      <ToggleGroupPrimitive.Item
        key={value}
        value={value}
        aria-label={label}
        className={itemClassName || clsx(
          "group radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
          "bg-white dark:bg-gray-800",
          "border-y px-2.5 py-2 first:rounded-l-md first:border-x last:rounded-r-md last:border-x",
          "border-gray-200 radix-state-on:border-transparent dark:border-gray-600",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
        )}
      >
        {icon && React.cloneElement(icon as React.ReactElement, {
          className: iconClassName,
        })}
      </ToggleGroupPrimitive.Item>
    ))}
  </ToggleGroupPrimitive.Root>
);

export const config: ComponentConfig<Props> = {
  fields: {
    items: {
      type: "array",
      label: "Toggle Items",
      itemFields: {
        value: { type: "text", label: "Value" },
        label: { type: "text", label: "Label" },
      },
      defaultValue: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ],
    },
    type: {
      type: "select",
      label: "Selection Type",
      options: [
        { label: "Single", value: "single" },
        { label: "Multiple", value: "multiple" },
      ],
    },
    itemClassName: { type: "text", label: "Item Class" },
    iconClassName: { type: "text", label: "Icon Class" },
  },
};

export default ToggleGroup;