import type { Config } from "@measured/puck";
import { ComponentConfig } from "@measured/puck";

import {  Section, ThemeToggler, FixedColumns, DropColumn, FullWidthRow, ThreeColumns, ScrollColumn, TwoColumns, ScrollFree } from './src/layout';
import {  SectionProps, ThemeTogglerProps, FixedColumnsProps, DropColumnProps, FullWidthRowProps, ThreeColumnsProps, ScrollColumnProps, TwoColumnsProps, ScrollFreeProps } from "./src/layout";

import { Button, ContactDialog } from './src/buttons';
import { ButtonProps, ContactDialogProps } from './src/buttons';

import { AboutCard, Accordion, Author, AspectRatio, Avatar, Carousel, Collapsible, HoverCard, MusicCarousel, Poll, ScrollArticles } from './src/data-displays';
import { AboutCardProps, AccordionProps, AuthorProps, AspectRatioProps, AvatarProps, CarouselProps, CollapsibleProps, HoverCardProps, MusicCarouselProps, PollProps, ScrollArticlesProps } from './src/data-displays';

import { CommandMenu, ContextMenu, DropdownMenu, NavigationMenu,LogoBar, Menubar, Tabs, Toolbar, VertNavMenu } from './src/menus';
import { CommandMenuProps, ContextMenuProps, DropdownMenuProps, LogoBarProps, MenubarProps, NavigationMenuProps, TabsProps, ToolbarProps, VertNavMenuProps } from "./src/menus";

import { Article, ArticleCard, ArticleCardList, ArticleDialog, DemoCard } from './src/basics';
import { ArticleProps, ArticleCardProps, ArticleCardListProps, ArticleDialogProps, DemoCardProps } from './src/basics';

import { IssueCard, Sidebar, Socials, ArchiveGrid, ArchivePage, FilterBar, } from "./src/spec_parts";
import { IssueCardProps, SidebarProps, SocialsProps, ArchiveGridProps, Filters, FilterBarProps,  } from "./src/spec_parts";

import { ArticleList, Circle, FeaturedHeader, Ticker, RightBar } from "./src/right-bar";
import { ArticleListProps, CircleProps, FeaturedHeaderProps, TickerProps, RightBarProps  } from "./src/right-bar";

import { JSONLD } from "./src/JSONLD/index";
import { JSONLDProps } from "./src/JSONLD/index";
import { WebsiteJsonLd } from "./src/JSONLD/WebsiteJSON";
import { ArticleJsonLd } from "./src/JSONLD/ArticleJSON";
import { ArtistProfileJsonLd } from "./src/JSONLD/ArtistJSON";
import { ProfilePageJsonLd } from "./src/JSONLD/AuthorsJSON";


type Props = {
  HeadingBlock: { title: string };
  ArticleCard: ArticleCardProps;
  DemoCard: DemoCardProps;
  Button: ButtonProps;
  CommandMenu: CommandMenuProps;
  ContextMenu: ContextMenuProps;
  DropdownMenu: DropdownMenuProps;
  Accordion: AccordionProps;
  Collapsible: CollapsibleProps;
  Tabs: TabsProps;
  Toolbar: ToolbarProps;
  NavigationMenu: NavigationMenuProps;
  AspectRatio: AspectRatioProps;
  Avatar: AvatarProps;
  HoverCard: HoverCardProps;
  Menubar: MenubarProps;
  Ticker: TickerProps;
  ThemeToggler: ThemeTogglerProps;
  ArticleList: ArticleListProps;
  Circle: CircleProps;
  FeaturedHeader: FeaturedHeaderProps;
  ArticleCardList: ArticleCardListProps;
  Sidebar: SidebarProps;
  IssueCard: IssueCardProps;
  VertNavMenu: VertNavMenuProps;
  FixedColumns: FixedColumnsProps;
  DropColumn: DropColumnProps;
  Socials: SocialsProps;
  ThreeColumns: ThreeColumnsProps;
  Article: ArticleProps;
  ArchiveGrid: ArchiveGridProps;
  ArchivePage: Filters;
  FilterBar: FilterBarProps;
  LogoBar: LogoBarProps;
  Carousel: CarouselProps;
  ScrollColumn: ScrollColumnProps;
  MusicCarousel: MusicCarouselProps;
  TwoColumns: TwoColumnsProps;
  ScrollArticles: ScrollArticlesProps;
  ArticleDialog: ArticleDialogProps;
  FullWidthRow: FullWidthRowProps;
  Poll: PollProps;
  ContactDialog: ContactDialogProps;
  Author: AuthorProps;
  AboutCard: AboutCardProps;
  ScrollFree: ScrollFreeProps;
  RightBar: RightBarProps;
  JSONLD: JSONLDProps;
};

interface RootProps {
  children: React.ReactNode;
  pageType?: 'article' | 'arts' | 'profile';
  pageData?: any;
}

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
    CommandMenu,
    ContextMenu,
    DropdownMenu,
    Accordion,
    Collapsible,
    Tabs,
    Toolbar,
    NavigationMenu,
    AspectRatio,
    Avatar,
    HoverCard,
    Menubar,
    ThemeToggler,
    Sidebar,
    IssueCard,
    VertNavMenu,
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
    ScrollColumn,
    MusicCarousel,
    TwoColumns,
    ScrollArticles,
    ArticleDialog,
    FullWidthRow,
    Poll,
    ContactDialog,
    Author,
    AboutCard,
    ScrollFree,
    RightBar,
    JSONLD,
  },
    categories: {
    basics: {
      title: 'Basics',
      components: [ 'Article', 'ArticleCard', 'ArticleCardList','ArticleDialog', 'DemoCard' ]
    },
    layout: {
      title: 'Layout',
      components: [ 'DropColumn', 'FixedColumns', 'FullWidthRow', 'ScrollColumn','ScrollFree', 'ThemeToggler',  'ThreeColumns',  'TwoColumns' ]
    },
    buttons: {
      title: 'Buttons',
      components: [ 'Button', 'ContactDialog' ]
    },
    'data displays': {
      title: 'Data Displays',
      components: [ 'AboutCard', 'Accordion', 'Author', 'AspectRatio', 'Avatar', 'Carousel', 'Collapsible',`HoverCard`, 'MusicCarousel', 'Poll', 'ScrollArticles' ]
    },
    menus: {
      title: 'Menus',
      components: [ 'CommandMenu', 'ContextMenu', 'DropdownMenu', 'LogoBar', 'Menubar', 'NavigationMenu', 'Tabs', 'Toolbar', 'VertNavMenu' ]
    },
    'right-side-bar': {
      title: 'Right Side Bar',
      components: [ 'ArticleList', 'Circle', 'FeaturedHeader', 'Ticker', 'RightBar']
    },
  },
    root: {
      render: ({ children, pageType, pageData }: RootProps) => {
        return (
                  <>
          <WebsiteJsonLd />
          {pageType === 'article' && <ArticleJsonLd article={pageData} />}
          {pageType === 'arts' && <ArtistProfileJsonLd artist={pageData} />}
          {pageType === 'profile' && <ProfilePageJsonLd profile={pageData} />}
          <div className="min-h-screen bg-adaptive-primary text-adaptive-secondary transition-colors duration-300"> 
            {children}
          </div>
          </>
          );
        }
    }
};
export default config;