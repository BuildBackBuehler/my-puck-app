import * as SelectPrimitive from "@radix-ui/react-select";
import { ComponentConfig } from "@measured/puck";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  defaultValue: string;
  triggerClassName: string;
  contentClassName: string;
  itemClassName: string;
  scrollButtonClassName: string;
  ariaLabel: string;
}

export const Select: ComponentConfig<SelectProps> = {
  fields: {
    options: {
      type: "array",
      getItemSummary: (item: SelectOption) => item.label,
      arrayFields: {
        value: { type: "text" },
        label: { type: "text" },
        disabled: { type: "radio" }
      }
    },
    defaultValue: { type: "text" },
    triggerClassName: { type: "text" },
    contentClassName: { type: "text" },
    itemClassName: { type: "text" },
    scrollButtonClassName: { type: "text" },
    ariaLabel: { type: "text" }
  },

  defaultProps: {
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2", disabled: true }
    ],
    defaultValue: "option1",
    ariaLabel: "Select option",
    triggerClassName: "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900",
    contentClassName: "bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg",
    itemClassName: clsx(
      "relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium",
      "radix-disabled:opacity-50",
      "focus:bg-gray-100 dark:focus:bg-gray-900",
      "focus:outline-none select-none"
    ),
    scrollButtonClassName: "flex items-center justify-center text-gray-700 dark:text-gray-300"
  },

  render: ({ options, defaultValue, ariaLabel, triggerClassName, contentClassName, itemClassName, scrollButtonClassName }) => (
    <SelectPrimitive.Root defaultValue={defaultValue}>
      <SelectPrimitive.Trigger className={triggerClassName} aria-label={ariaLabel}>
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon className="ml-2">
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content className={contentClassName}>
        <SelectPrimitive.ScrollUpButton className={scrollButtonClassName}>
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport>
          <SelectPrimitive.Group>
            {options.map(({ value, label, disabled }) => (
              <SelectPrimitive.Item
                key={value}
                value={value}
                disabled={disabled}
                className={itemClassName}
              >
                <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <CheckIcon />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className={scrollButtonClassName}>
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  )
};