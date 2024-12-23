import * as SliderPrimitive from "@radix-ui/react-slider";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";

export interface SliderProps {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  rootClassName: string;
  trackClassName: string;
  rangeClassName: string;
  thumbClassName: string;
  ariaLabel: string;
}

export const Slider: ComponentConfig<SliderProps> = {
  fields: {
    defaultValue: { type: "number" },
    min: { type: "number" },
    max: { type: "number" },
    step: { type: "number" },
    rootClassName: { type: "text" },
    trackClassName: { type: "text" },
    rangeClassName: { type: "text" },
    thumbClassName: { type: "text" },
    ariaLabel: { type: "text" }
  },

  defaultProps: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    ariaLabel: "Slider",
    rootClassName: "relative flex h-5 w-64 touch-none items-center",
    trackClassName: "relative h-1 w-full grow rounded-full bg-white dark:bg-gray-800",
    rangeClassName: "absolute h-full rounded-full bg-purple-600 dark:bg-white",
    thumbClassName: clsx(
      "block h-5 w-5 rounded-full bg-purple-600 dark:bg-white",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    )
  },

  render: ({ defaultValue, min, max, step, ariaLabel, rootClassName, trackClassName, rangeClassName, thumbClassName }) => (
    <SliderPrimitive.Root
      defaultValue={[defaultValue]}
      min={min}
      max={max}
      step={step}
      aria-label={ariaLabel}
      className={rootClassName}
    >
      <SliderPrimitive.Track className={trackClassName}>
        <SliderPrimitive.Range className={rangeClassName} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={thumbClassName} />
    </SliderPrimitive.Root>
  )
};