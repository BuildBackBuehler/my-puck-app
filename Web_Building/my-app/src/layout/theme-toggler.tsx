import { ComponentConfig } from "@measured/puck";
import * as Toggle from "@radix-ui/react-toggle";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export type ThemeTogglerProps = {
  defaultTheme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  position?: "left" | "right";
  persistent?: boolean;
};

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12"
};

export const ThemeToggler: ComponentConfig<ThemeTogglerProps> = {
  fields: {
    defaultTheme: {
      type: "select",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" }
      ]
    },
    size: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" }
      ]
    },
    position: {
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" }
      ]
    },
    persistent: {
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false }
      ]
    }
  },

  defaultProps: {
    defaultTheme: "light",
    size: "md",
    position: "right",
    persistent: true
  },

  render: ({ defaultTheme, size = "md", position = "right", persistent }) => {
    const [theme, setTheme] = useState(defaultTheme);

    useEffect(() => {
      if (persistent) {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) setTheme(savedTheme as "light" | "dark");
      }
    }, [persistent]);

    useEffect(() => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      if (persistent) {
        localStorage.setItem("theme", theme);
      }
    }, [theme, persistent]);

    return (
      <div className={`fixed ${position}-4 top-4 z-50`}>
        <Toggle.Root
          defaultPressed={theme === "dark"}
          onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
          className={`
            ${sizeMap[size]}
            rounded-full 
            bg-white dark:bg-gray-800 
            shadow-md hover:shadow-lg 
            transition-all duration-200 
            flex items-center justify-center
            ring-1 ring-black/5 hover:ring-black/10
            dark:ring-white/10 dark:hover:ring-white/20
          `}
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5">
            <span
              className={`
                absolute inset-0 
                transition-transform duration-500
                ${theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}
              `}
            >
              <Moon className="w-5 h-5 text-blue-400" />
            </span>
            <span
              className={`
                absolute inset-0 
                transition-transform duration-500
                ${theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}
              `}
            >
              <Sun className="w-5 h-5 text-yellow-500" />
            </span>
          </div>
        </Toggle.Root>
      </div>
    );
  }
};