import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";
import { Button as ButtonConfig } from "./button";
const Button = ButtonConfig.render;
export interface TooltipProps {
  triggerText: string;
  content: string;
  sideOffset: number;
  contentClassName: string;
  arrowClassName: string;
  textClassName: string;
}

export const Tooltip: ComponentConfig<TooltipProps> = {
  fields: {
    triggerText: { type: "text" },
    content: { type: "textarea" },
    sideOffset: { type: "number" },
    contentClassName: { type: "text" },
    arrowClassName: { type: "text" },
    textClassName: { type: "text" }
  },

  defaultProps: {
    triggerText: "Hover me",
    content: "Tooltip content goes here",
    sideOffset: 4,
    contentClassName: clsx(
      "radix-side-top:animate-slide-down-fade",
      "radix-side-right:animate-slide-left-fade",
      "radix-side-bottom:animate-slide-up-fade",
      "radix-side-left:animate-slide-right-fade",
      "inline-flex items-center rounded-md px-4 py-2.5",
      "bg-white dark:bg-gray-800"
    ),
    arrowClassName: "fill-current text-white dark:text-gray-800",
    textClassName: "block text-xs leading-none text-gray-700 dark:text-gray-100"
  },

  render: ({ triggerText, content, sideOffset, contentClassName, arrowClassName, textClassName }) => (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <Button>{triggerText}</Button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          sideOffset={sideOffset}
          className={contentClassName}
        >
          <TooltipPrimitive.Arrow className={arrowClassName} />
          <span className={textClassName}>{content}</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
};