import { clsx } from "clsx";
import React from "react";
import { ComponentConfig } from "@/core/types";

export interface ButtonProps {
  text: string;
  baseClass?: string;
  hoverClass?: string;
  focusClass?: string;
  stateClass?: string;
  disabled?: boolean;
}

export const Button: ComponentConfig<ButtonProps> = {
  fields: {
    text: { type: "text" },
    baseClass: { 
      type: "text",
      label: "Base Styles" 
    },
    hoverClass: {
      type: "text",
      label: "Hover Styles"
    },
    focusClass: {
      type: "text",
      label: "Focus Styles"
    },
    stateClass: {
      type: "text",
      label: "State Styles"
    },
    disabled: {
      type: "radio",
      options: [
        { label: "Enabled", value: false },
        { label: "Disabled", value: true }
      ]
    }
  },

  defaultProps: {
    text: "Button",
    baseClass: "inline-flex select-none items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-100",
    hoverClass: "hover:bg-gray-50 dark:hover:bg-gray-900",
    focusClass: "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
    stateClass: "group radix-state-open:bg-gray-50 dark:radix-state-open:bg-gray-900 radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
    disabled: false
  },

  render: React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ text, baseClass, hoverClass, focusClass, stateClass, disabled, ...props }, ref) => (
      <button
        ref={ref}
        className={clsx(baseClass, hoverClass, focusClass, stateClass)}
        disabled={disabled}
        {...props}
      >
        {text}
      </button>
    )
  )
};
