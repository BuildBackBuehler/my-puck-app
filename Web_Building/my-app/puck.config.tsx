import type { Config } from "@measured/puck";

import { Section, ThemeSwitcher, ThemeToggler, FixedColumns, DropColumn, ThreeColumns } from './src/layout';
import { SectionProps, ThemeSwitcherProps, ThemeTogglerProps, FixedColumnsProps, DropColumnProps, ThreeColumnsProps } from "./src/layout";

import { AlertDialog, Button, Dialog, Popover, RadioGroup, Select, Toggle, Toast, ToggleGroup, Tooltip } from './src/buttons';
import { AlertDialogProps, ButtonProps, DialogProps, PopoverProps, RadioGroupProps, SelectProps, ToggleProps, ToastProps, ToggleGroupProps, TooltipProps } from './src/buttons';

import { Accordion, AspectRatio, Avatar, Carousel, Checkbox, Collapsible, HoverCard, Progress, Slider, Switch } from './src/data-displays';
import { AccordionProps, AspectRatioProps, AvatarProps, CarouselProps, CheckboxProps, CollapsibleProps, HoverCardProps, ProgressProps, SliderProps, SwitchProps } from './src/data-displays';

import { CommandMenu, ContextMenu, DropdownMenu, NavigationMenu,LogoBar, Menubar, Tabs, Toolbar, VertNavMenu } from './src/menus';
import { CommandMenuProps, ContextMenuProps, DropdownMenuProps, LogoBarProps, MenubarProps, NavigationMenuProps, TabsProps, ToolbarProps, VertNavMenuProps } from "./src/menus";

import { Article, ArticleCard, ArticleCardList, DemoCard, Divider } from './src/basics';
import { ArticleProps, ArticleCardProps, ArticleCardListProps, DemoCardProps, DividerProps } from './src/basics';

import { IssueCard, Sidebar, Socials, ArchiveGrid, ArchivePage, FilterBar } from "./src/spec_parts";
import { IssueCardProps, SidebarProps, SocialsProps, ArchiveGridProps, ArchivePageProps, FilterBarProps } from "./src/spec_parts";

import { ArticleList, Circle, FeaturedHeader, Ticker } from "./src/right-bar";
import { ArticleListProps, CircleProps, FeaturedHeaderProps, TickerProps } from "./src/right-bar";

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
  DropColumn: DropColumnProps;
  Socials: SocialsProps;
  ThreeColumns: ThreeColumnsProps;
  Article: ArticleProps;
  ArchiveGrid: ArchiveGridProps;
  ArchivePage: ArchivePageProps;
  FilterBar: FilterBarProps;
  LogoBar: LogoBarProps;
  Carousel: CarouselProps;
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
    FixedColumns,
    DropColumn,
    Socials,
    ThreeColumns,
    Article,
    ArchiveGrid,
    ArchivePage,
    FilterBar,
    LogoBar,
    Carousel,
  },
    categories: {
    basics: {
      title: 'Basics',
      components: [ 'Article', 'ArticleCard', 'ArticleCardList', 'Divider', 'DemoCard', 'Icon']
    },
    layout: {
      title: 'Layout',
      components: [ 'FixedColumns', 'Section', 'ThemeSwitcher', 'ThemeToggler', 'DropColumn', 'ThreeColumns']
    },
    'data displays': {
      title: 'Data Displays',
      components: ['Accordion', 'AspectRatio', 'Avatar', 'Carousel', 'Checkbox', 'Collapsible',`HoverCard`, 'Progress', 'Slider', 'Switch', 'Ticker']
    },
    menus: {
      title: 'Menus',
      components: ['CommandMenu', 'ContextMenu', 'DropdownMenu', 'LogoBar', 'Menubar', 'NavigationMenu', 'Tabs', 'Toolbar', 'VertNavMenu']
    },
    buttons: {
      title: 'Buttons',
      components: ['AlertDialog', 'Button', 'Dialog', 'RadioGroup', 'Popover', 'Select', 'Toggle', 'Toast', 'ToggleGroup', 'Tooltip']
    },
    'right-side-bar': {
      title: 'Right Side Bar',
      components: ['ArticleList', 'Circle', 'FeaturedHeader', 'Ticker']
    },
  },
    root: {
        render: ({ children }: { children: React.ReactNode }) => (
          <div className="min-h-screen bg-adaptive-primary text-adaptive-secondary transition-colors duration-300">
            {children}
          </div>
        )
    }
  };

export default config;