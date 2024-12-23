import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { ComponentConfig } from "@measured/puck";
import React from "react";
import { ChevronRightIcon, CheckIcon, DotFilledIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";

export interface MenubarProps {
  menus: {
    label: string;
    items: Array<{
      type: 'item' | 'submenu' | 'separator' | 'checkbox' | 'radio';
      label?: string;
      shortcut?: string;
      disabled?: boolean;
      items?: Array<{
        label: string;
        shortcut?: string;
        disabled?: boolean;
      }>;
    }>;
  }[];
  menuGroup?: {
    name: string;
    values: string[];
    defaultValue?: string;
  };
  styles: {
    root: string;
    trigger: string;
    content: string;
    item: string;
    separator: string;
    submenuContent: string;
    submenuTrigger: string;
    shortcut: string;
    indicator: string;
  };
}

export const Menubar: ComponentConfig<MenubarProps> = {
  fields: {
    menus: {
      type: "array",
      getItemSummary: (menu) => menu.label,
      arrayFields: {
        label: { type: "text" },
        items: {
          type: "array",
          arrayFields: {
            type: {
              type: "select",
              options: [
                { label: "Menu Item", value: "item" },
                { label: "Submenu", value: "submenu" },
                { label: "Separator", value: "separator" },
                { label: "Checkbox", value: "checkbox" },
                { label: "Radio", value: "radio" }
              ]
            },
            label: { type: "text" },
            shortcut: { type: "text" },
            disabled: { 
              type: "radio",
              options: [
                { label: "Enabled", value: false },
                { label: "Disabled", value: true }
              ]
            },
            items: {
              type: "array",
              arrayFields: {
                label: { type: "text" },
                shortcut: { type: "text" },
                disabled: {
                  type: "radio",
                  options: [
                    { label: "Enabled", value: false },
                    { label: "Disabled", value: true }
                  ]
                }
              }
            }
          }
        }
      }
    },
    menuGroup: {
      type: "object",
      objectFields: {
        name: { type: "text" },
        values: { 
          type: "array",
          arrayFields: {
            value: { type: "text" }
          }
        },
        defaultValue: { type: "text" }
      }
    },
    styles: {
      type: "object",
      objectFields: {
        root: { type: "text" },
        trigger: { type: "text" },
        content: { type: "text" },
        item: { type: "text" },
        separator: { type: "text" },
        submenuContent: { type: "text" },
        submenuTrigger: { type: "text" },
        shortcut: { type: "text" },
        indicator: { type: "text" }
      }
    }
  },

  defaultProps: {
    menus: [{
      label: "File",
      items: [
        { type: "item", label: "New", shortcut: "⌘N" },
        { type: "separator" },
        { 
          type: "submenu",
          label: "Share",
          items: [
            { label: "Email", shortcut: "⌘E" },
            { label: "Message", shortcut: "⌘M" }
          ]
        }
      ]
    }],
    menuGroup: {
      name: "view",
      values: ["compact", "default", "expanded"],
      defaultValue: "default"
    },
    styles: {
      root: "relative flex flex-row rounded-lg bg-white dark:bg-gray-800 p-1 space-x-1",
      trigger: "px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
      content: "min-w-[220px] bg-white dark:bg-gray-800 rounded-md p-1 shadow-lg",
      item: "flex w-full items-center px-2 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none",
      separator: "my-1 h-px bg-gray-200 dark:bg-gray-700",
      submenuContent: "min-w-[220px] bg-white dark:bg-gray-800 rounded-md p-1 shadow-lg",
      submenuTrigger: "flex w-full items-center justify-between px-2 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none",
      shortcut: "ml-auto pl-4 text-xs text-gray-500",
      indicator: "h-4 w-4 text-gray-700 dark:text-gray-200"
    }
  },

  render: ({ menus, menuGroup, styles }) => {
    const [radioValue, setRadioValue] = React.useState(menuGroup?.defaultValue || "");
    const [checkboxStates, setCheckboxStates] = React.useState<Record<string, boolean>>({});

    const renderMenuItems = (items: MenubarProps["menus"][0]["items"]) => {
      return items.map((item, index) => {
        if (item.type === "separator") {
          return <MenubarPrimitive.Separator key={index} className={styles.separator} />;
        }

        if (item.type === "checkbox") {
          return (
            <MenubarPrimitive.CheckboxItem
              key={index}
              checked={checkboxStates[item.label || ""]}
              onCheckedChange={(checked) => {
                setCheckboxStates(prev => ({ ...prev, [item.label || ""]: checked }));
              }}
              disabled={item.disabled}
              className={styles.item}
            >
              <MenubarPrimitive.ItemIndicator>
                <CheckIcon className={styles.indicator} />
              </MenubarPrimitive.ItemIndicator>
              {item.label}
              {item.shortcut && <div className={styles.shortcut}>{item.shortcut}</div>}
            </MenubarPrimitive.CheckboxItem>
          );
        }

        if (item.type === "radio") {
          return (
            <MenubarPrimitive.RadioItem
              key={index}
              value={item.label || ""}
              disabled={item.disabled}
              className={styles.item}
            >
              <MenubarPrimitive.ItemIndicator>
                <DotFilledIcon className={styles.indicator} />
              </MenubarPrimitive.ItemIndicator>
              {item.label}
              {item.shortcut && <div className={styles.shortcut}>{item.shortcut}</div>}
            </MenubarPrimitive.RadioItem>
          );
        }

        if (item.type === "submenu" && item.items) {
          return (
            <MenubarPrimitive.Sub key={index}>
              <MenubarPrimitive.SubTrigger disabled={item.disabled} className={styles.submenuTrigger}>
                {item.label}
                <ChevronRightIcon className={styles.indicator} />
              </MenubarPrimitive.SubTrigger>
              <MenubarPrimitive.Portal>
                <MenubarPrimitive.SubContent className={styles.submenuContent}>
                  {item.items.map((subItem, subIndex) => (
                    <MenubarPrimitive.Item
                      key={subIndex}
                      disabled={subItem.disabled}
                      className={styles.item}
                    >
                      {subItem.label}
                      {subItem.shortcut && <div className={styles.shortcut}>{subItem.shortcut}</div>}
                    </MenubarPrimitive.Item>
                  ))}
                </MenubarPrimitive.SubContent>
              </MenubarPrimitive.Portal>
            </MenubarPrimitive.Sub>
          );
        }

        return (
          <MenubarPrimitive.Item
            key={index}
            disabled={item.disabled}
            className={styles.item}
          >
            {item.label}
            {item.shortcut && <div className={styles.shortcut}>{item.shortcut}</div>}
          </MenubarPrimitive.Item>
        );
      });
    };

    return (
      <MenubarPrimitive.Root className={styles.root}>
        {menus.map((menu, index) => (
          <MenubarPrimitive.Menu key={index}>
            <MenubarPrimitive.Trigger className={styles.trigger}>
              {menu.label}
            </MenubarPrimitive.Trigger>
            <MenubarPrimitive.Portal>
              <MenubarPrimitive.Content
                align="start"
                sideOffset={5}
                alignOffset={-3}
                className={styles.content}
              >
                {menuGroup && menu.items.some(item => item.type === "radio") ? (
                  <MenubarPrimitive.RadioGroup value={radioValue} onValueChange={setRadioValue}>
                    {renderMenuItems(menu.items)}
                  </MenubarPrimitive.RadioGroup>
                ) : (
                  renderMenuItems(menu.items)
                )}
              </MenubarPrimitive.Content>
            </MenubarPrimitive.Portal>
          </MenubarPrimitive.Menu>
        ))}
      </MenubarPrimitive.Root>
    );
  }
};
