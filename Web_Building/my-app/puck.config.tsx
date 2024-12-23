import type { Config } from "@measured/puck";
// import { Divider, Heading, Paragraph, DemoCard, Icon } from './src/basics';

import { Columns, Section, ThemeSwitcher } from './src/layout';
import { ColumnsProps, SectionProps, ThemeSwitcherProps } from "./src/layout";

import { AlertDialog, Button, Dialog, Popover, RadioGroup, Select, Toggle, Toast, ToggleGroup, Tooltip } from './src/buttons';
import { AlertDialogProps, ButtonProps, DialogProps, PopoverProps, RadioGroupProps, SelectProps, ToggleProps, ToastProps, ToggleGroupProps, TooltipProps } from './src/buttons';

import { Accordion, AspectRatio, Avatar, Checkbox, Collapsible, HoverCard, Progress, Slider, Switch } from './src/data-displays';
import { AccordionProps, AspectRatioProps, AvatarProps, CheckboxProps, CollapsibleProps, HoverCardProps, ProgressProps, SliderProps, SwitchProps } from './src/data-displays';

import { CommandMenu, ContextMenu, DropdownMenu, NavigationMenu, Menubar, Tabs, Toolbar } from './src/menus';
import { CommandMenuProps, ContextMenuProps, DropdownMenuProps, MenubarProps, NavigationMenuProps, TabsProps, ToolbarProps } from "./src/menus";




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
  Columns: ColumnsProps;
  AlertDialog: AlertDialogProps;
  Popover: PopoverProps;
  Select: SelectProps;
  Toggle: ToggleProps;
  Toast: ToastProps;
  ToggleGroup: ToggleGroupProps;
  Tooltip: TooltipProps;
  Tabs: TabsProps;
  Toolbar: ToolbarProps;
  NavigationMenu: NavigationMenuProps;
  AspectRatio: AspectRatioProps;
  Avatar: AvatarProps;
  Checkbox: CheckboxProps;
  Progress: ProgressProps;
  Slider: SliderProps;
  Switch: SwitchProps;
  HoverCard: HoverCardProps;
  RadioGroup: RadioGroupProps;
  Menubar: MenubarProps;
  Section: SectionProps;
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
    Columns,
    Section,
    AlertDialog,
    Popover,
    Select,
    Toggle,
    Toast,
    ToggleGroup,
    Tooltip,
    Tabs,
    Toolbar,
    NavigationMenu,
    AspectRatio,
    Avatar,
    Checkbox,
    Progress,
    Slider,
    Switch,
    HoverCard,
    RadioGroup,
    Menubar,
  },
    categories: {
    basics: {
      title: 'Basics',
      components: ['Divider', 'Heading', 'Paragraph', 'DemoCard', 'Icon']
    },
    layout: {
      title: 'Layout',
      components: ['Columns', 'Section', 'ThemeSwitcher']
    },
    'data-displays': {
      title: 'Data Displays',
      components: ['Accordion', 'AspectRatio', 'Avatar', 'Checkbox',`HoverCard`, 'Collapsible', 'Progress', 'Slider', 'Switch']
    },
    menus: {
      title: 'Menus',
      components: ['CommandMenu', 'ContextMenu', 'DropdownMenu', 'NavigationMenu', 'Menubar', 'Tabs', 'Toolbar']
    },
    buttons: {
      title: 'Buttons',
      components: ['AlertDialog', 'Button', 'Dialog', 'RadioGroup', 'Popover', 'Select', 'Toggle', 'Toast', 'ToggleGroup', 'Tooltip']
    }
  },
  root: {
    render: ({ children }) => {
      return <div className="p-16">{children}</div>;
    }
  }
};

export default config;

