import type { Config } from "@measured/puck";
// import { Divider, Heading, Paragraph, DemoCard, Icon } from './src/basics';
// import { Columns, Container, ThemeSwitcher } from './src/layout';
// import { ColumnsProps, ContainerProps, ThemeSwitcherProps } from "./src/layout";
// import { AccordionProps, CollapsibleProps } from "./src/data-displays";
// import { CommandMenu, ContextMenu, DropdownMenu, NavigationMenu, Tabs, Toolbar } from './src/menus';
// import { CommandMenuProps, ContextMenuProps, DropdownMenuProps, NavigationMenuProps, TabsProps, ToolbarProps } from "./src/menus";
// import { AlertDialog, Button, Dialog, Popover, Select, Toggle, Toast, ToggleGroup, Tooltip } from './src/buttons';

import { Button, Dialog, Popover, Select, Toggle, Toast, ToggleGroup, Tooltip } from './src/buttons';
import { ButtonProps, DialogProps, PopoverProps, SelectProps, ToggleProps, ToastProps, ToggleGroupProps, TooltipProps } from './src/buttons';

import { Accordion, AspectRatio, Avatar, Checkbox, Collapsible, HoverCard, Progress, Slider, Switch } from './src/data-displays';
import { AccordionProps, AspectRatioProps, AvatarProps, CheckboxProps, CollapsibleProps, HoverCardProps, ProgressProps, SliderProps, SwitchProps } from './src/data-displays';

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
