import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { ComponentConfig } from "@measured/puck";
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";

interface ToggleOption {
  value: string;
  label: string;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  defaultValue?: string;
  className?: string;
  type?: 'single' | 'multiple';
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
    options: {
      type: 'array',
      arrayFields: {
        label: { type: 'text' },
        value: { type: 'text' }
      },
      defaultValue: [
        { label: "Bold", value: "bold" },
        { label: "Italic", value: "italic" },
        { label: "Underline", value: "underline" }
      ]
    },
    type: {
      type: 'select',
      options: [
        { label: 'Single', value: 'single' },
        { label: 'Multiple', value: 'multiple' }
      ],
      defaultValue: 'single'
    }
  },

  render: ({ options, type = 'single', className }) => {
    if (!options || !Array.isArray(options)) {
      return null;
    }

    return (
      <ToggleGroupPrimitive.Root
        type={type}
        className={clsx('inline-flex rounded-md shadow-sm', className)}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }
};

export default ToggleGroup;