import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { ComponentConfig } from "@measured/puck";
import { CheckIcon } from "@radix-ui/react-icons";
import * as LabelPrimitive from "@radix-ui/react-label";
import { clsx } from "clsx";
import React from "react";

export interface CheckboxProps {
  label: string;
  defaultChecked: boolean;
  checkboxClassName: string;
  labelClassName: string;
  iconClassName: string;
  formClassName: string;
}

export const Checkbox: ComponentConfig<CheckboxProps> = {
  fields: {
    label: { type: "text" },
    defaultChecked: { 
      type: "radio",
      options: [
        { label: "Checked", value: true },
        { label: "Unchecked", value: false }
      ]
    },
    checkboxClassName: { type: "text" },
    labelClassName: { type: "text" },
    iconClassName: { type: "text" },
    formClassName: { type: "text" }
  },

  defaultProps: {
    label: "Accept terms and conditions",
    defaultChecked: true,
    checkboxClassName: clsx(
      "flex h-5 w-5 items-center justify-center rounded",
      "radix-state-checked:bg-purple-600",
      "radix-state-unchecked:bg-gray-100 dark:radix-state-unchecked:bg-gray-900",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    labelClassName: "ml-3 select-none text-sm font-medium text-gray-900 dark:text-gray-100",
    iconClassName: "h-4 w-4 self-center text-white",
    formClassName: "flex items-center"
  },

  render: ({ label, defaultChecked, checkboxClassName, labelClassName, iconClassName, formClassName }) => (
    <form className={formClassName}>
      <CheckboxPrimitive.Root
        id="c1"
        defaultChecked={defaultChecked}
        className={checkboxClassName}
      >
        <CheckboxPrimitive.Indicator>
          <CheckIcon className={iconClassName} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <LabelPrimitive.Label
        htmlFor="c1"
        className={labelClassName}
      >
        {label}
      </LabelPrimitive.Label>
    </form>
  )
};