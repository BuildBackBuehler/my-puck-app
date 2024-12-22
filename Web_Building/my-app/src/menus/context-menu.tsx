import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { ComponentConfig } from "@measured/puck";
import React, { ReactElement } from "react";
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

export interface ContextMenuProps {
  buttonText: string;
  menuClassName: string;
  items: {
    label: string;
    icon?: string;
    shortcut?: string;
    itemClassName: string;
    type: 'item' | 'separator' | 'checkbox' | 'submenu';
    checkboxProps?: {
      stateIcon: string;
      defaultChecked: boolean;
    };
    submenuProps?: {
      items: {
        label: string;
        icon?: string;
        itemClassName: string;
      }[];
    };
  }[];
}

export const ContextMenu: ComponentConfig<ContextMenuProps> = {
  fields: {
    buttonText: { type: "text" },
    menuClassName: { type: "text" },
    items: {
      type: "array",
      getItemSummary: (item) => item.label || item.type,
      arrayFields: {
        label: { type: "text" },
        icon: { 
          type: "select",
          options: iconOptions 
        },
        shortcut: { type: "text" },
        itemClassName: { type: "text" },
        type: {
          type: "select",
          options: [
            { label: "Menu Item", value: "item" },
            { label: "Separator", value: "separator" },
            { label: "Checkbox", value: "checkbox" },
            { label: "Submenu", value: "submenu" }
          ]
        },
        checkboxProps: {
          type: "object",
          objectFields: {
            stateIcon: {
              type: "select",
              options: iconOptions
            },
            defaultChecked: { type: "radio", options: [
              { label: "Checked", value: true },
              { label: "Unchecked", value: false }
            ]}
          }
        },
        submenuProps: {
          type: "object",
          objectFields: {
            items: {
              type: "array",
              arrayFields: {
                label: { type: "text" },
                icon: { 
                  type: "select",
                  options: iconOptions 
                },
                itemClassName: { type: "text" }
              }
            }
          }
        }
      }
    }
  },

  defaultProps: {
    buttonText: "Right Click",
    menuClassName: "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56 bg-white dark:bg-gray-800",
    items: [{
      label: "New File",
      icon: "File",
      shortcut: "⌘+N",
      itemClassName: "flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900",
      type: "item"
    }]
  },

  render: function ContextMenuComponent({ buttonText, menuClassName, items }) {
    const [checkboxStates, setCheckboxStates] = React.useState<Record<number, boolean>>({});

    const renderMenuItem = (item: ContextMenuProps["items"][0], index: number) => {
      if (item.type === "separator") {
        return <ContextMenuPrimitive.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />;
      }

      if (item.type === "checkbox") {
        return (
          <ContextMenuPrimitive.CheckboxItem
            checked={checkboxStates[index]}
            onCheckedChange={(state) => {
              if (typeof state === "boolean") {
                setCheckboxStates(prev => ({...prev, [index]: state}));
              }
            }}
            className={item.itemClassName}
          >
            {item.icon && icons[item.icon] && 
              <div className="mr-2 h-3.5 w-3.5">{icons[item.icon]}</div>
            }
            <span className="flex-grow">{item.label}</span>
            {item.shortcut && <span className="text-xs">{item.shortcut}</span>}
          </ContextMenuPrimitive.CheckboxItem>
        );
      }

      if (item.type === "submenu" && item.submenuProps) {
        return (
          <ContextMenuPrimitive.Sub>
            <ContextMenuPrimitive.SubTrigger className={item.itemClassName}>
              {item.icon && icons[item.icon] && 
                <div className="mr-2 h-3.5 w-3.5">{icons[item.icon]}</div>
              }
              <span className="flex-grow">{item.label}</span>
              {icons["ChevronRight"]}
            </ContextMenuPrimitive.SubTrigger>
            <ContextMenuPrimitive.Portal>
              <ContextMenuPrimitive.SubContent className={menuClassName}>
                {item.submenuProps.items.map((subItem, i) => (
                  <ContextMenuPrimitive.Item key={i} className={subItem.itemClassName}>
                    {subItem.icon && icons[subItem.icon] && 
                      <div className="mr-2 h-3.5 w-3.5">{icons[subItem.icon]}</div>
                    }
                    <span className="flex-grow">{subItem.label}</span>
                  </ContextMenuPrimitive.Item>
                ))}
              </ContextMenuPrimitive.SubContent>
            </ContextMenuPrimitive.Portal>
          </ContextMenuPrimitive.Sub>
        );
      }

      return (
        <ContextMenuPrimitive.Item className={item.itemClassName}>
          {item.icon && icons[item.icon] && 
            <div className="mr-2 h-3.5 w-3.5">{icons[item.icon]}</div>
          }
          <span className="flex-grow">{item.label}</span>
          {item.shortcut && <span className="text-xs">{item.shortcut}</span>}
        </ContextMenuPrimitive.Item>
      );
    };

    return (
      <ContextMenuPrimitive.Root>
        <ContextMenuPrimitive.Trigger asChild>
          <Button>{buttonText}</Button>
        </ContextMenuPrimitive.Trigger>

        <ContextMenuPrimitive.Portal>
          <ContextMenuPrimitive.Content className={menuClassName}>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {renderMenuItem(item, index)}
              </React.Fragment>
            ))}
          </ContextMenuPrimitive.Content>
        </ContextMenuPrimitive.Portal>
      </ContextMenuPrimitive.Root>
    );
  }
};
