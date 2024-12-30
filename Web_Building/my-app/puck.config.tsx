import type { Config } from "@measured/puck";
// import { Divider, Heading, Paragraph, DemoCard, Icon } from './src/basics';

import { Columns, Section, ThemeSwitcher, ThemeToggler, FixedColumns } from './src/layout';
import { ColumnsProps, SectionProps, ThemeSwitcherProps, ThemeTogglerProps, FixedColumnsProps } from "./src/layout";

import { AlertDialog, Button, Dialog, Popover, RadioGroup, Select, Toggle, Toast, ToggleGroup, Tooltip } from './src/buttons';
import { AlertDialogProps, ButtonProps, DialogProps, PopoverProps, RadioGroupProps, SelectProps, ToggleProps, ToastProps, ToggleGroupProps, TooltipProps } from './src/buttons';

import { Accordion, AspectRatio, Avatar, Checkbox, Collapsible, HoverCard, Progress, Slider, Switch, Ticker } from './src/data-displays';
import { AccordionProps, AspectRatioProps, AvatarProps, CheckboxProps, CollapsibleProps, HoverCardProps, ProgressProps, SliderProps, SwitchProps, TickerProps } from './src/data-displays';

import { CommandMenu, ContextMenu, DropdownMenu, NavigationMenu, Menubar, Tabs, Toolbar, VertNavMenu } from './src/menus';
import { CommandMenuProps, ContextMenuProps, DropdownMenuProps, MenubarProps, NavigationMenuProps, TabsProps, ToolbarProps, VertNavMenuProps } from "./src/menus";

import { ArticleCard, ArticleCardList, DemoCard, Divider } from './src/basics';
import { ArticleCardProps, ArticleCardListProps, DemoCardProps, DividerProps } from './src/basics';

import { ArticleList, Circle, IssueCard, FeaturedHeader, Sidebar } from "./src/spec_parts";
import { ArticleListProps, CircleProps, IssueCardProps, FeaturedHeaderProps, SidebarProps } from "./src/spec_parts";

type Props = {
  HeadingBlock: { title: string };
  ArticleCard: ArticleCardProps;
  DemoCard: DemoCardProps;
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
  Ticker: TickerProps;
  ThemeToggler: ThemeTogglerProps;
  ArticleList: ArticleListProps;
  Circle: CircleProps;
  FeaturedHeader: FeaturedHeaderProps;
  ArticleCardList: ArticleCardListProps;
  Sidebar: SidebarProps;
  IssueCard: IssueCardProps;
  VertNavMenu: VertNavMenuProps;
  Divider: DividerProps;
  FixedColumns: FixedColumnsProps;
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
    ArticleList,
    Circle,
    FeaturedHeader,
    ArticleCard,
    ArticleCardList,
    Ticker,
    DemoCard,
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
    ThemeToggler,
    Sidebar,
    IssueCard,
    VertNavMenu,
    Divider,
    FixedColumns
  },
    categories: {
    basics: {
      title: 'Basics',
      components: [ 'ArticleCard', 'ArticleCardList', 'Divider', 'DemoCard', 'Icon']
    },
    layout: {
      title: 'Layout',
      components: ['Columns', 'FixedColumns', 'Section', 'ThemeSwitcher', 'ThemeToggler']
    },
    'data-displays': {
      title: 'Data Displays',
      components: ['Accordion', 'AspectRatio', 'Avatar', 'Checkbox',`HoverCard`, 'Collapsible', 'Progress', 'Slider', 'Switch', 'Ticker']
    },
    menus: {
      title: 'Menus',
      components: ['CommandMenu', 'ContextMenu', 'DropdownMenu', 'NavigationMenu', 'Menubar', 'Tabs', 'Toolbar', 'VertNavMenu']
    },
    buttons: {
      title: 'Buttons',
      components: ['AlertDialog', 'Button', 'Dialog', 'RadioGroup', 'Popover', 'Select', 'Toggle', 'Toast', 'ToggleGroup', 'Tooltip']
    }
  },
    root: {
        render: ({ children }: { children: React.ReactNode }) => (
          <div className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-gray-900 dark:text-white">
            {children}
          </div>
        )
    }
  };

export default config;