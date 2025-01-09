import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";

interface RadioOption {
  id: string;
  title: string;
}

export interface RadioGroupProps {
  legend: string;
  options: RadioOption[];
  defaultSelected: string;
  legendClassName: string;
  radioClassName: string;
  labelClassName: string;
  indicatorClassName: string;
}

export const RadioGroup: ComponentConfig<RadioGroupProps> = {
  fields: {
    legend: { type: "text" },
    options: {
      type: "array",
      getItemSummary: (item: RadioOption) => item.title,
      arrayFields: {
        id: { type: "text" },
        title: { type: "text" }
      }
    },
    defaultSelected: { type: "text" },
    legendClassName: { type: "text" },
    radioClassName: { type: "text" },
    labelClassName: { type: "text" },
    indicatorClassName: { type: "text" }
  },

  defaultProps: {
    legend: "Choose an option",
    options: [
      { id: "option1", title: "Option 1" },
      { id: "option2", title: "Option 2" }
    ],
    defaultSelected: "option1",
    legendClassName: "text-sm font-medium leading-4 text-gray-900 dark:text-gray-100",
    radioClassName: clsx(
      "peer relative w-4 h-4 rounded-full",
      "border border-transparent text-white",
      "radix-state-checked:bg-purple-600",
      "radix-state-unchecked:bg-gray-100 dark:radix-state-unchecked:bg-gray-900",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    labelClassName: "ml-2 block text-sm font-medium text-gray-700 dark:text-gray-400",
    indicatorClassName: "absolute inset-0 flex items-center justify-center leading-0"
  },

  render: ({ legend, options, defaultSelected, legendClassName, radioClassName, labelClassName, indicatorClassName }) => (
    <form>
      <legend className={legendClassName}>{legend}</legend>
      <RadioGroupPrimitive.Root defaultValue={defaultSelected}>
        <div className="mt-3 space-y-3">
          {options.map(({ id, title }) => (
            <div key={id} className="flex items-center">
              <RadioGroupPrimitive.Item
                id={id}
                value={title}
                className={radioClassName}
              >
                <RadioGroupPrimitive.Indicator className={indicatorClassName}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
              <label htmlFor={id} className={labelClassName}>
                {title}
              </label>
            </div>
          ))}
        </div>
      </RadioGroupPrimitive.Root>
    </form>
  )
};