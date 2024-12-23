import type { Config } from "@measured/puck";
// import { Divider, Heading, Paragraph, DemoCard, Icon } from './src/basics';
// import { Columns, Container, ThemeSwitcher } from './src/layout';
// import { ColumnsProps, ContainerProps, ThemeSwitcherProps } from "./src/layout";
// import { Accordion, AspectRatio, Avatar, Card, Checkbox, Collapsible, Progress, RadioGroup, Slider, Switch } from './src/data-displays';
// import { AccordionProps, CollapsibleProps } from "./src/data-displays";
// import { CommandMenu, ContextMenu, DropdownMenu, NavigationMenu, Tabs, Toolbar } from './src/menus';
// import { CommandMenuProps, ContextMenuProps, DropdownMenuProps, NavigationMenuProps, TabsProps, ToolbarProps } from "./src/menus";
// import { AlertDialog, Button, Dialog, Popover, Select, Toggle, Toast, ToggleGroup, Tooltip } from './src/buttons';

import { Button, Dialog, Popover } from './src/buttons';

import { CommandMenu, CommandMenuProps } from './src/menus/command-menu';
import { ContextMenu, ContextMenuProps } from './src/menus/context-menu';
import { DropdownMenu, DropdownMenuProps } from './src/menus/dropdown-menu';
import { Accordion, AccordionProps } from './src/data-displays/accordion';
import { Collapsible, CollapsibleProps } from './src/data-displays/collapsible';
import { ThemeSwitcher, ThemeSwitcherProps } from './src/layout/theme-switcher';

type Props = {
  HeadingBlock: { title: string };
  Button: ButtonProps;
  Dialog: DialogProps;
  CommandMenu: CommandMenuProps;
  ContextMenu: ContextMenuProps;
  DropdownMenu: DropdownMenuProps;
  Accordion: AccordionProps;
  Collapsible: CollapsibleProps;
  ThemeSwitcher: ThemeSwitcherProps;
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
    Button,
    Dialog,
    CommandMenu,
    ContextMenu,
    DropdownMenu,
    Accordion,
    Collapsible,
    ThemeSwitcher,
  },
};

export default config;
