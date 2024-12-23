import * as ProgressPrimitive from "@radix-ui/react-progress";
import { ComponentConfig } from "@measured/puck";
import React from "react";

export interface ProgressProps {
  progress: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  rootClassName: string;
  indicatorClassName: string;
}

export const Progress: ComponentConfig<ProgressProps> = {
  fields: {
    progress: { type: "number" },
    autoAnimate: { 
      type: "radio",
      options: [
        { label: "On", value: true },
        { label: "Off", value: false }
      ]
    },
    animationInterval: { type: "number" },
    rootClassName: { type: "text" },
    indicatorClassName: { type: "text" }
  },

  defaultProps: {
    progress: 60,
    autoAnimate: false,
    animationInterval: 5000,
    rootClassName: "h-3 w-full overflow-hidden rounded-full bg-white dark:bg-gray-900",
    indicatorClassName: "h-full bg-purple-500 duration-300 ease-in-out dark:bg-white"
  },

  render: ({ progress: initialProgress, autoAnimate, animationInterval, rootClassName, indicatorClassName }) => {
    const [progress, setProgress] = React.useState(initialProgress);

    React.useEffect(() => {
      if (!autoAnimate) {
        setProgress(initialProgress);
        return;
      }

      const timer = setInterval(() => {
        setProgress(Math.ceil(Math.random() * 100));
      }, animationInterval);

      return () => clearInterval(timer);
    }, [autoAnimate, animationInterval, initialProgress]);

    return (
      <ProgressPrimitive.Root value={progress} className={rootClassName}>
        <ProgressPrimitive.Indicator 
          style={{ width: `${progress}%` }}
          className={indicatorClassName}
        />
      </ProgressPrimitive.Root>
    );
  }
};
