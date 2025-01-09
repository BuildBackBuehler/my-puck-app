import * as SwitchPrimitive from "@radix-ui/react-switch";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";

export interface SwitchProps {
  defaultChecked: boolean;
  label: string;
  switchClassName: string;
  thumbClassName: string;
  labelClassName: string;
}

export const Switch: ComponentConfig<SwitchProps> = {
  fields: {
    defaultChecked: { 
      type: "radio",
      options: [ 
        { label: "True", value: true }, 
        { label: "False", value: false }
      ]
    },
    label: { type: "text" },
    switchClassName: { type: "text" },
    thumbClassName: { type: "text" },
    labelClassName: { type: "text" }
  },

  defaultProps: {
    defaultChecked: false,
    label: "Toggle switch",
    switchClassName: clsx(
      "group",
      "radix-state-checked:bg-purple-600",
      "radix-state-unchecked:bg-gray-200 dark:radix-state-unchecked:bg-gray-800",
      "relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    thumbClassName: clsx(
      "group-radix-state-checked:translate-x-5",
      "group-radix-state-unchecked:translate-x-0",
      "pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200"
    ),
    labelClassName: "ml-2 text-sm text-gray-900 dark:text-gray-100"
  },

  render: ({ defaultChecked, label, switchClassName, thumbClassName, labelClassName }) => (
    <div className="flex items-center">
      <SwitchPrimitive.Root
        defaultChecked={defaultChecked}
        className={switchClassName}
      >
        <SwitchPrimitive.Thumb className={thumbClassName} />
      </SwitchPrimitive.Root>
      {label && <span className={labelClassName}>{label}</span>}
    </div>
  )
};