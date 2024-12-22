import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentConfig } from "@measured/puck";
import React, { ReactElement, useState } from "react";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { clsx } from "clsx";
import Button from "../buttons/button";

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactElement>>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);
  return { ...acc, [iconName]: <El /> };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export interface DropdownMenuProps {
  buttonText: string;
  contentClassName: string;
  separatorClassName: string;
  items: {
    type: 'item' | 'checkbox' | 'separator' | 'submenu';
    label?: string;
    shortcut?: string;
    icon?: string;
    itemClassName: string;
    checkboxProps?: {
      icon: string;
      uncheckedIcon: string;
      defaultChecked: boolean;
    };
    submenuItems?: {
      label: string;
      icon?: string;
      itemClassName: string;
      url?: string;
    }[];
  }[];
}

export const DropdownMenu: ComponentConfig<DropdownMenuProps> = {
  fields: {
    buttonText: { type: "text" },
    contentClassName: { type: "text" },
    separatorClassName: { type: "text" },
    items: {
      type: "array",
      getItemSummary: (item) => item.label || item.type,
      arrayFields: {
        type: {
          type: "select",
          options: [
            { label: "Menu Item", value: "item" },
            { label: "Checkbox", value: "checkbox" },
            { label: "Separator", value: "separator" },
            { label: "Submenu", value: "submenu" }
          ]
        },
        label: { type: "text" },
        shortcut: { type: "text" },
        icon: { 
          type: "select",
          options: iconOptions 
        },
        itemClassName: { type: "text" },
        checkboxProps: {
          type: "object",
          objectFields: {
            icon: { type: "select", options: iconOptions },
            uncheckedIcon: { type: "select", options: iconOptions },
            defaultChecked: { type: "radio", options: [
              { label: "Checked", value: true },
              { label: "Unchecked", value: false }
            ]}
          }
        },
        submenuItems: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            icon: { type: "select", options: iconOptions },
            itemClassName: { type: "text" },
            url: { type: "text" }
          }
        }
      }
    }
  },

  defaultProps: {
    buttonText: "Menu",
    contentClassName: "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56 bg-white dark:bg-gray-800",
    separatorClassName: "my-1 h-px bg-gray-200 dark:bg-gray-700",
    items: [{
      type: "item",
      label: "New Item",
      icon: "File",
      shortcut: "⌘+N",
      itemClassName: "flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900"
    }]
  },

  render: ({ buttonText, contentClassName, separatorClassName, items }) => {
    const [checkboxStates, setCheckboxStates] = useState<Record<number, boolean>>({});

    const renderItem = (item: DropdownMenuProps["items"][0], index: number) => {
      if (item.type === "separator") {
        return <DropdownMenuPrimitive.Separator className={separatorClassName} />;
      }

      if (item.type === "checkbox" && item.checkboxProps) {
        return (
          <DropdownMenuPrimitive.CheckboxItem
            checked={checkboxStates[index]}
            onCheckedChange={(state) => {
              if (typeof state === "boolean") {
                setCheckboxStates(prev => ({...prev, [index]: state}));
              }
            }}
            className={item.itemClassName}
          >
            {icons[state ? item.checkboxProps.icon : item.checkboxProps.uncheckedIcon]}
            <span className="flex-grow">{item.label}</span>
            <DropdownMenuPrimitive.ItemIndicator>
              {icons["Check"]}
            </DropdownMenuPrimitive.ItemIndicator>
          </DropdownMenuPrimitive.CheckboxItem>
        );
      }

      if (item.type === "submenu" && item.submenuItems) {
        return (
          <DropdownMenuPrimitive.Sub>
            <DropdownMenuPrimitive.SubTrigger className={item.itemClassName}>
              {item.icon && icons[item.icon]}
              <span className="flex-grow">{item.label}</span>
              {icons["ChevronRight"]}
            </DropdownMenuPrimitive.SubTrigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.SubContent className={contentClassName}>
                {item.submenuItems.map((subItem, i) => (
                  <DropdownMenuPrimitive.Item key={i} className={subItem.itemClassName}>
                    {subItem.icon && icons[subItem.icon]}
                    {subItem.url && (
                      <img className="mr-2.5 h-6 w-6 rounded-full" src={subItem.url} alt={subItem.label} />
                    )}
                    <span>{subItem.label}</span>
                  </DropdownMenuPrimitive.Item>
                ))}
              </DropdownMenuPrimitive.SubContent>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Sub>
        );
      }

      return (
        <DropdownMenuPrimitive.Item className={item.itemClassName}>
          {item.icon && icons[item.icon]}
          <span className="flex-grow">{item.label}</span>
          {item.shortcut && <span className="text-xs">{item.shortcut}</span>}
        </DropdownMenuPrimitive.Item>
      );
    };

    return (
      <div className="relative inline-block text-left">
        <DropdownMenuPrimitive.Root>
          <DropdownMenuPrimitive.Trigger asChild>
            <Button>{buttonText}</Button>
          </DropdownMenuPrimitive.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              align="end"
              sideOffset={5}
              className={contentClassName}
            >
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {renderItem(item, index)}
                </React.Fragment>
              ))}
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
      </div>
    );
  }
};
