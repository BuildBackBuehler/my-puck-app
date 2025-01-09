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
  sm: "lg:h-6 lg:w-6 md:h-4 md:w-4 h-2 w-2",
  md: "lg:h-8 lg:w-8 md:h-6 md:w-6 h-4 w-4",
  lg: "lg:h-10 lg:w-10 md:h-8 md:w-8 h-6 w-6"
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
    size: "lg",
    position: "left",
    persistent: true
  },

  render: ({ defaultTheme, size = "md", position = "left", persistent }) => {
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
            bg-white dark:bg-black
            shadow-md hover:shadow-lg 
            transition-all duration-200 
            flex items-center justify-center
            ring-1 ring-black/10 hover:ring-black/20
            dark:ring-gold/15 dark:hover:ring-gold/40
            group
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
              <Moon className="w-5 h-5 text-adaptive-accent group-hover:fill-adaptive-accent3 group-hover:text-adaptive-accent3 hover:fill-adaptive-accent3 hover:text-adaptive-accent3" />
            </span>
            <span
              className={`
                absolute inset-0 
                transition-transform duration-500
                ${theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}
              `}
            >
              <Sun className="w-5 h-5 text-adaptive-accent group-hover:text-purple hover:text-purple" />
            </span>
          </div>
        </Toggle.Root>
      </div>
    );
  }
};