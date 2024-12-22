import { ComponentConfig } from "@measured/puck";
import React, { ReactElement } from "react";
import { Command } from "cmdk";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactElement>>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);
  return { ...acc, [iconName]: <El /> };
}, {});

export interface CommandMenuProps {
  items: {
    label: string;
    icon?: string;
    shortcut?: string;
    group?: string;
  }[];
  styles: {
    dialog: string;
    input: string;
    list: string;
    item: string;
    empty: string;
    separator: string;
    footer: string;
    shortcut: string;
  };
  ui: {
    placeholder: string;
    emptyText: string;
    searchIcon: string;
    footerIcon: string;
    showFooter: boolean;
    keyboardShortcut: string;
  };
}

export const CommandMenu: ComponentConfig<CommandMenuProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item) => item.label,
      arrayFields: {
        label: { type: "text" },
        icon: { 
          type: "select",
          options: Object.keys(dynamicIconImports).map(name => ({
            label: name, value: name
          }))
        },
        shortcut: { type: "text" },
        group: { type: "text" }
      }
    },
    styles: {
      type: "object",
      objectFields: {
        dialog: { type: "text" },
        input: { type: "text" },
        list: { type: "text" },
        item: { type: "text" },
        empty: { type: "text" },
        separator: { type: "text" },
        footer: { type: "text" },
        shortcut: { type: "text" }
      }
    },
    ui: {
      type: "object",
      objectFields: {
        placeholder: { type: "text" },
        emptyText: { type: "text" },
        searchIcon: {
          type: "select",
          options: Object.keys(dynamicIconImports).map(name => ({
            label: name, value: name
          }))
        },
        footerIcon: {
          type: "select", 
          options: Object.keys(dynamicIconImports).map(name => ({
            label: name, value: name
          }))
        },
        showFooter: {
          type: "radio",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false }
          ]
        },
        keyboardShortcut: { type: "text" }
      }
    }
  },

  defaultProps: {
    items: [
      { label: "Search", icon: "Search", shortcut: "⌘K" },
      { label: "Actions", icon: "Zap", group: "General" },
      { label: "Settings", icon: "Settings", group: "General" }
    ],
    styles: {
      dialog: "fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-lg shadow-lg z-50",
      input: "w-full bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-500 border-none focus:outline-none",
      list: "max-h-[60vh] overflow-y-auto p-2",
      item: "flex items-center px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
      empty: "p-4 text-sm text-gray-500 dark:text-gray-400 text-center",
      separator: "h-px bg-gray-200 dark:bg-gray-700 my-2",
      footer: "flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700",
      shortcut: "text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1"
    },
    ui: {
      placeholder: "Type a command or search...",
      emptyText: "No results found",
      searchIcon: "Search",
      footerIcon: "Command",
      showFooter: true,
      keyboardShortcut: "k"
    }
  },

  render: ({ items, styles, ui }) => {
    const [open, setOpen] = React.useState(false);
    const groups = React.useMemo(() => {
      return items.reduce((acc, item) => {
        const group = item.group || "Commands";
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {} as Record<string, typeof items>);
    }, [items]);

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === ui.keyboardShortcut && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen(o => !o);
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, [ui.keyboardShortcut]);

    return (
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        className={styles.dialog}
        label="Command Menu"
      >
        <div className="flex items-center p-2">
          {ui.searchIcon && icons[ui.searchIcon] &&
            React.cloneElement(icons[ui.searchIcon], { className: "w-5 h-5 text-gray-500 mr-2" })}
          <Command.Input placeholder={ui.placeholder} className={styles.input} />
        </div>

        <Command.Separator className={styles.separator} />

        <Command.List className={styles.list}>
          <Command.Empty className={styles.empty}>
            {ui.emptyText}
          </Command.Empty>

          {Object.entries(groups).map(([groupName, groupItems]) => (
            <React.Fragment key={groupName}>
              <Command.Group heading={groupName}>
                {groupItems.map((item, index) => (
                  <Command.Item
                    key={`${item.label}-${index}`}
                    className={styles.item}
                    onSelect={() => {
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center flex-1">
                      {item.icon && icons[item.icon] &&
                        React.cloneElement(icons[item.icon], { className: "w-4 h-4 mr-2" })}
                      {item.label}
                    </div>
                    {item.shortcut && (
                      <kbd className={styles.shortcut}>{item.shortcut}</kbd>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
              {groupName !== Object.keys(groups).slice(-1)[0] && (
                <Command.Separator className={styles.separator} />
              )}
            </React.Fragment>
          ))}
        </Command.List>

        {ui.showFooter && (
          <>
            <Command.Separator className={styles.separator} />
            <div className={styles.footer}>
              {ui.footerIcon && icons[ui.footerIcon] &&
                React.cloneElement(icons[ui.footerIcon], { className: "w-4 h-4" })}
              <div className="flex items-center space-x-2">
                <kbd className={styles.shortcut}>↑↓</kbd>
                <span className="text-xs text-gray-500">navigate</span>
                <kbd className={styles.shortcut}>enter</kbd>
                <span className="text-xs text-gray-500">select</span>
                <kbd className={styles.shortcut}>esc</kbd>
                <span className="text-xs text-gray-500">close</span>
              </div>
            </div>
          </>
        )}
      </Command.Dialog>
    );
  }
};
