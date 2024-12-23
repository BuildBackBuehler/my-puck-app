import { ComponentConfig } from "@measured/puck";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import React from "react";
import Button from "./shared/button";

interface Props {
  defaultPressed?: boolean;
  activeIcon?: React.ReactNode;
  inactiveIcon?: React.ReactNode;
  activeText?: string;
  inactiveText?: string;
  buttonClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}

const Toggle: React.FC<Props> = ({
  defaultPressed = false,
  activeIcon = <StarFilledIcon className="h-4 w-4 text-yellow-400" />,
  inactiveIcon = <StarIcon className="h-4 w-4" />,
  activeText = "Starred",
  inactiveText = "Star",
  buttonClassName,
  iconClassName,
  textClassName = "ml-2 leading-5",
}) => {
  const [pressed, setPressed] = React.useState(defaultPressed);

  return (
    <TogglePrimitive.Root
      pressed={pressed}
      onPressedChange={setPressed}
      asChild
    >
      <Button className={buttonClassName}>
        <span className={iconClassName}>
          {pressed ? activeIcon : inactiveIcon}
        </span>
        <span className={textClassName}>
          {pressed ? activeText : inactiveText}
        </span>
      </Button>
    </TogglePrimitive.Root>
  );
};

export const config: ComponentConfig<Props> = {
  fields: {
    defaultPressed: { type: "boolean", label: "Initially Pressed" },
    activeText: { type: "text", label: "Active State Text" },
    inactiveText: { type: "text", label: "Inactive State Text" },
    buttonClassName: { type: "text", label: "Button Class" },
    iconClassName: { type: "text", label: "Icon Class" },
    textClassName: { type: "text", label: "Text Class" },
  },
};

export default Toggle;