import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentConfig } from "@measured/puck";
import React, { useEffect, useState, ReactElement } from "react";
import { Half2Icon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { clsx } from "clsx";

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactElement>>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);
  return { ...acc, [iconName]: <El /> };
}, {});

export interface ThemeSwitcherProps {
  themes: {
    key: string;
    label: string;
    icon: string;
  }[];
  triggerClassName: string;
  contentClassName: string;
  itemClassName: string;
  iconClassName: string;
}

export const ThemeSwitcher: ComponentConfig<ThemeSwitcherProps> = {
  fields: {
    themes: {
      type: "array",
      arrayFields: {
        key: { type: "text" },
        label: { type: "text" },
        icon: { 
          type: "select",
          options: Object.keys(dynamicIconImports).map(name => ({
            label: name,
            value: name
          }))
        }
      }
    },
    triggerClassName: { type: "text" },
    contentClassName: { type: "text" },
    itemClassName: { type: "text" },
    iconClassName: { type: "text" }
  },

  defaultProps: {
    themes: [
      { key: "light", label: "Light", icon: "Sun" },
      { key: "dark", label: "Dark", icon: "Moon" },
      { key: "system", label: "System", icon: "MonitorSmartphone" }
    ],
    triggerClassName: "inline-flex select-none justify-center rounded-md px-2.5 py-2 text-sm font-medium bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 hover:dark:bg-gray-800 border border-gray-300 dark:border-transparent focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
    contentClassName: "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56 bg-gray-50 dark:bg-gray-800",
    itemClassName: "flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none text-gray-500 focus:bg-gray-200 dark:text-gray-400 dark:focus:bg-gray-700",
    iconClassName: "w-5 h-5 mr-2 text-gray-700 dark:text-gray-300"
  },

  render: ({ themes, triggerClassName, contentClassName, itemClassName, iconClassName }) => {
    const [preferredTheme, setPreferredTheme] = React.useState<string>("system");

    React.useEffect(() => {
      try {
        const stored = localStorage.getItem("theme");
        if (stored) setPreferredTheme(stored);
      } catch (error) {}
    }, []);

    const currentIcon = icons[themes.find(t => t.key === preferredTheme)?.icon || "MonitorSmartphone"];

    return (
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger className={triggerClassName}>
          {React.cloneElement(currentIcon, { className: iconClassName })}
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content align="end" sideOffset={5} className={contentClassName}>
            {themes.map(({ key, label, icon }) => (
              <DropdownMenuPrimitive.Item
                key={key}
                className={itemClassName}
                onClick={() => {
                  localStorage.setItem("theme", key);
                  setPreferredTheme(key);
                  document.documentElement.classList.toggle("dark", key === "dark");
                }}
              >
                {icons[icon] && React.cloneElement(icons[icon], { className: iconClassName })}
                <span className="flex-grow">{label}</span>
              </DropdownMenuPrimitive.Item>
            ))}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
  }
};
