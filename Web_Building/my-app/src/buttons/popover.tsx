import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ComponentConfig } from "@measured/puck";
import { Cross1Icon } from "@radix-ui/react-icons";
import React from "react";
import { clsx } from "clsx";

export interface PopoverProps {
  buttonText: string;
  title: string;
  items: {
    id: string;
    label: string;
    defaultValue: string;
  }[];
  styles: {
    content: string;
    arrow: string;
    title: string;
    field: string;
    label: string;
    input: string;
    close: string;
  };
}

export const Popover: ComponentConfig<PopoverProps> = {
  fields: {
    buttonText: { type: "text" },
    title: { type: "text" },
    items: {
      type: "array",
      arrayFields: {
        id: { type: "text" },
        label: { type: "text" },
        defaultValue: { type: "text" }
      }
    },
    styles: {
      type: "object",
      objectFields: {
        content: { type: "text" },
        arrow: { type: "text" },
        title: { type: "text" },
        field: { type: "text" },
        label: { type: "text" },
        input: { type: "text" },
        close: { type: "text" }
      }
    }
  },

  defaultProps: {
    buttonText: "Open",
    title: "Settings",
    items: [
      { id: "width", label: "Width", defaultValue: "100%" },
      { id: "height", label: "Height", defaultValue: "25px" }
    ],
    styles: {
      content:clsx ("radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
        "z-50 w-48 rounded-lg p-4 shadow-md md:w-56",
        "bg-white dark:bg-gray-800"),
      arrow: "fill-current text-white dark:text-gray-800",
      title: "text-sm font-medium text-gray-900 dark:text-gray-100",
      field: "flex items-center",
      label: "shrink-0 grow text-xs font-medium text-gray-700 dark:text-gray-400",
      input:clsx ("block w-1/2 rounded-md",
      "text-xs text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
      "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"),
      close: clsx ("absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1",
        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75")
    }
  },

  render: ({ buttonText, title, items, styles }) => (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger className="px-4 py-2 rounded-md bg-white text-gray-900">
        {buttonText}
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Content align="center" sideOffset={4} className={styles.content}>
        <PopoverPrimitive.Arrow className={styles.arrow} />
        <h3 className={styles.title}>{title}</h3>

        <form className="mt-4 space-y-2">
          {items.map(({ id, label, defaultValue }) => (
            <fieldset key={id} className={styles.field}>
              <label htmlFor={id} className={styles.label}>{label}</label>
              <input
                id={id}
                type="text"
                defaultValue={defaultValue}
                className={styles.input}
              />
            </fieldset>
          ))}
        </form>

        <PopoverPrimitive.Close className={styles.close}>
          <Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </PopoverPrimitive.Close>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  )
};
