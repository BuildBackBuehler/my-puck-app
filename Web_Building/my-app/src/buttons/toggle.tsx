import * as TogglePrimitive from "@radix-ui/react-toggle";
import { ComponentConfig } from "@measured/puck";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import React from "react";

export interface ToggleProps {
  defaultPressed: radio;
  activeText: string;
  inactiveText: string;
  buttonClassName: string;
  iconClassName: string;
  textClassName: string;
  showIcon: radio;
}

export const Toggle: ComponentConfig<ToggleProps> = {
  fields: {
    defaultPressed: { type: "radio" },
    activeText: { type: "text" },
    inactiveText: { type: "text" },
    buttonClassName: { type: "text" },
    iconClassName: { type: "text" },
    textClassName: { type: "text" },
    showIcon: { type: "radio" }
  },

  defaultProps: {
    defaultPressed: false,
    activeText: "Starred",
    inactiveText: "Star",
    buttonClassName: "inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    iconClassName: "h-4 w-4",
    textClassName: "ml-2 leading-5",
    showIcon: true
  },

  render: ({ defaultPressed, activeText, inactiveText, buttonClassName, iconClassName, textClassName, showIcon }) => {
    const [pressed, setPressed] = React.useState(defaultPressed);

    return (
      <TogglePrimitive.Root
        pressed={pressed}
        onPressedChange={setPressed}
        className={buttonClassName}
      >
        {showIcon && (
          pressed ? 
            <StarFilledIcon className={`${iconClassName} text-yellow-400`} /> : 
            <StarIcon className={iconClassName} />
        )}
        <span className={textClassName}>
          {pressed ? activeText : inactiveText}
        </span>
      </TogglePrimitive.Root>
    );
  }
};