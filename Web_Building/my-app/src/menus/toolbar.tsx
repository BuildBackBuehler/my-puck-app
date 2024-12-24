import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { ComponentConfig } from "@measured/puck";
import { FontBoldIcon, FontItalicIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import React from "react";

interface ToolbarGroup {
  type: "single" | "multiple";
  label: string;
  defaultValue?: string | string[];
  items: {
    value: string;
    label: string;
    icon: string;
  }[];
}

export interface ToolbarProps {
  groups: ToolbarGroup[];
  rootClassName: string;
  itemClassName: string;
  iconClassName: string;
  separatorClassName: string;
}

export const Toolbar: ComponentConfig<ToolbarProps> = {
  fields: {
    groups: {
      type: "array",
      getItemSummary: (item: ToolbarGroup) => item.label,
      arrayFields: {
        type: {
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Multiple", value: "multiple" }
          ]
        },
        label: { type: "text" },
        defaultValue: { type: "text" },
        items: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" },
            icon: { 
              type: "select", 
              options: [
                { label: "Bold", value: "bold" },
                { label: "Italic", value: "italic" },
                { label: "AlignLeft", value: "alignLeft" },
                { label: "AlignCenter", value: "alignCenter" },
                { label: "AlignRight", value: "alignRight" }
              ]
            }
          }
        }
      }
    },
    rootClassName: { type: "text" },
    itemClassName: { type: "text" },
    iconClassName: { type: "text" },
    separatorClassName: { type: "text" }
  },

  defaultProps: {
    groups: [
      {
        type: "multiple",
        label: "Text Style",
        items: [
          { value: "bold", label: "Bold", icon: "bold" },
          { value: "italic", label: "Italic", icon: "italic" }
        ]
      },
      {
        type: "single",
        label: "Text Align",
        defaultValue: "left",
        items: [
          { value: "left", label: "Left", icon: "alignLeft" },
          { value: "center", label: "Center", icon: "alignCenter" },
          { value: "right", label: "Right", icon: "alignRight" }
        ]
      }
    ],
    rootClassName: "flex space-x-4 rounded-lg bg-white px-2.5 py-2 dark:bg-gray-800",
    itemClassName: clsx(
      "radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
      "bg-white dark:bg-gray-800",
      "border-y px-2.5 py-2 first:rounded-l-md first:border-x last:rounded-r-md last:border-x",
      "border-gray-200 radix-state-on:border-transparent dark:border-gray-600",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    iconClassName: "w-5 h-5 text-gray-700 dark:text-gray-100",
    separatorClassName: "mx-4 my-0.5 h-auto w-px dark:bg-gray-600"
  },

  render: ({ groups, rootClassName, itemClassName, iconClassName, separatorClassName }) => {
    const getIcon = (iconName: string) => {
      const icons = {
        bold: <FontBoldIcon />,
        italic: <FontItalicIcon />,
        alignLeft: <TextAlignLeftIcon />,
        alignCenter: <TextAlignCenterIcon />,
        alignRight: <TextAlignRightIcon />
      };
      return icons[iconName as keyof typeof icons];
    };

    return (
      <ToolbarPrimitive.Root className={rootClassName}>
        {groups.map((group, index) => (
          <React.Fragment key={group.label}>
            {group.type === "single" ? (
              <ToolbarPrimitive.ToggleGroup
                type="single"
                defaultValue={group.defaultValue as string}
                aria-label={group.label}
              >
                {group.items.map(item => (
                  <ToolbarPrimitive.ToggleItem
                    key={item.value}
                    value={item.value}
                    aria-label={item.label}
                    className={itemClassName}
                  >
                    {React.cloneElement(getIcon(item.icon), {
                      className: iconClassName
                    })}
                  </ToolbarPrimitive.ToggleItem>
                ))}
              </ToolbarPrimitive.ToggleGroup>
            ) : (
              <ToolbarPrimitive.ToggleGroup
                type="multiple"
                defaultValue={group.defaultValue as string[]}
                aria-label={group.label}
              >
                {group.items.map(item => (
                  <ToolbarPrimitive.ToggleItem
                    key={item.value}
                    value={item.value}
                    aria-label={item.label}
                    className={itemClassName}
                  >
                    {React.cloneElement(getIcon(item.icon), {
                      className: iconClassName
                    })}
                  </ToolbarPrimitive.ToggleItem>
                ))}
              </ToolbarPrimitive.ToggleGroup>
            )}
            {index < groups.length - 1 && (
              <ToolbarPrimitive.Separator className={separatorClassName} />
            )}
          </React.Fragment>
        ))}
      </ToolbarPrimitive.Root>
    );
  }
};