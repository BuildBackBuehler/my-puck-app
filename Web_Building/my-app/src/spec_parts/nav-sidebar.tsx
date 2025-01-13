import { ComponentConfig, DropZone } from "@measured/puck"
import Link from "next/link"
import React, { useState, useEffect, ReactElement } from "react"
import { Rss, Instagram, MailPlus } from "lucide-react"
import { useLayoutState } from "../../lib/layout-state"
import { Archive, Contact, Palette, Sparkles, SquarePen } from "lucide-react"
import Unabomber from "../../public/unabomber.svg"
import Snoo from "../../public/snoo.svg"
import dynamic from "next/dynamic";
import Image from "next/image"
import clsx from "clsx"
import { createRipple } from "./ripple"
import { usePathname } from 'next/navigation';

const dynamicIconImports = {
  'Snoo': () => (
    <div className="w-4 h-4 flex items-center justify-center">
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        className="fill-adaptive-secondary hover:fill-adaptive-accent transition-all transform-gpu"
      >
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    </div>
  ),  'Contact': () => <Contact size={16} />,
  'Palette': () => <Palette size={16} />,
  'Archive': () => <Archive size={16} />,
  'Sparkles': () => <Sparkles size={16} />,
  'Unabomber': ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
    <div className="w-4 h-4 md:w-5 md:h-5 flex items-center">
      <Image
        src="/unabomber.svg"
        alt="Unabomber"
        width={18}
        height={18}
        className="forced-color-adjust-auto fill-adaptive-primary transition-all transform-gpu 
        dark:invert hover:fill-adaptive-accent"
      />
    </div>
  )
}

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactElement>>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);
  return { ...acc, [iconName]: <El /> };
}, {});

export interface NavItem {
  label: string
  href: string
  icon?: keyof typeof dynamicIconImports
}

export interface SidebarProps {
  navigation: NavItem[]
  socialHandle?: string
  showSubscribe?: boolean
  initialState?: boolean
  showDivider?: boolean
}

export const Sidebar: ComponentConfig<SidebarProps> = {
  fields: {
    navigation: {
      type: "array",
      getItemSummary: (item) => item.label,
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        icon: { 
          type: "select",
          options: Object.keys(dynamicIconImports).map(name => ({
            label: name, value: name
          }))
        },
      },
    },
    socialHandle: { type: "text" },
    showSubscribe: { 
      type: "radio", 
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ]
    },
    initialState: {
      type: "radio",
      options: [
        { label: "Open", value: true },
        { label: "Closed", value: false }
      ]
    },
    showDivider: { 
      type: "radio", 
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ]
    }
  },

  defaultProps: {
    navigation: [
      { label: "Lemmy ↗", href: "/forums", icon: "Snoo" },
      { label: "About Us", href: "/about-us", icon: "Contact" },
      { label: "Arts", href: "/arts", icon: "Palette" },
      { label: "Archive", href: "/archive", icon: "Archive" },
      { label: "Essentials", href: "/essentials", icon: "Sparkles" },
      { label: "Manifesto", href: "/manifesto", icon: "Unabomber" }
    ],
    socialHandle: "@lotuswav.es",
    showSubscribe: true,
    initialState: true,
    showDivider: true
  },

  render: ({ navigation = [], socialHandle, showSubscribe = true, initialState = true, showDivider = true }) => {
    const pathname = usePathname();
    const storageKey = `sidebarState_${pathname}`;

    const [isOpen, setIsOpen] = useState(() => {
      if (typeof window !== 'undefined') {
        const pageSpecificState = localStorage.getItem(storageKey);
        if (pageSpecificState !== null) {
          return JSON.parse(pageSpecificState);
        }
        return initialState;
      }
      return initialState;
    });

    const { isSidebarOpen, setSidebarOpen } = useLayoutState();

    useEffect(() => {
      setSidebarOpen(isOpen);
      localStorage.setItem(storageKey, JSON.stringify(isOpen));
    }, [isOpen, setSidebarOpen, storageKey]);

    // Sidebar visibility based on screen size
    useEffect(() => {
      const checkWidth = () => {
        const isMobile = window.innerWidth <= 768;
        setIsOpen(!isMobile);
        setSidebarOpen(!isMobile);
      };

      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }, [setSidebarOpen]);

    return (
      <>
        {/* Mobile Bottom Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-adaptive-primary border-t border-adaptive-secondaryAlt z-50">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center p-4 min-w-min">
              <div className="flex space-x-6">
                {navigation.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href}
                    className="flex flex-col items-center min-w-[4rem] text-adaptive-secondary hover:text-adaptive-accent  transition-colors"
                  >
                    {item.icon && dynamicIconImports[item.icon] && (
                      <span className="mb-1">
                        {dynamicIconImports[item.icon]({ isSidebarOpen: false })}
                      </span>
                    )}
                    <span className="text-2xs whitespace-nowrap">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Social Icons */}
          {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-4 bg-adaptive-primary pl-4">
            {showSubscribe && (
              <>
                <button className="text-adaptive-secondary hover:text-adaptive-accent">
                  <MailPlus size={16} />
                </button>
                <button className="text-adaptive-secondary hover:text-adaptive-accent">
                  <Instagram size={16} />
                </button>
                <button className="text-adaptive-secondary hover:text-adaptive-accent">
                  <Rss size={16} />
                </button>
              </>
            )}
          </div> */}
        </nav>

        {/* Desktop/Tablet Sidebar - Hiding on Mobile */}
        <aside className={`
          hidden md:block absolute inset-y-0 left-0 h-full transition-all duration-200 ease-in-out
          ${isSidebarOpen ? 'w-36 lg:w-64' : 'w-12 lg:w-16'}
        `}>
          {/* Existing sidebar content */}
          {showDivider && (
            <div className={clsx(
              "absolute right-0 top-[10vh] h-[90vh] lg:top-[13.5vh] w-px lg:h-[86.5vh] bg-adaptive-secondaryAlt transition-opacity duration-300",
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            )} />
          )}
          
          <div className="flex flex-col h-full justify-between p-6 lg:p-8">
            <div className="relative">
              <button 
                onClick={() => {
                  const newState = !isSidebarOpen;
                  setSidebarOpen(newState);
                  localStorage.setItem('sidebarState', JSON.stringify(newState));
                }}
                className="absolute -right-6 top-[50vh] w-4 h-4 lg:w-6 lg:h-6 border border-adaptive-secondary text-adaptive-secondary hover:text-adaptive-accent hover:border-adaptive-accent rounded-full flex items-center justify-center cursor-pointer bg-adaptive-primary opacity-40 hover:opacity-100 transition-all duration-150"
              >
                {isSidebarOpen ? '←' : '→'}
              </button>

              <div className="mt-16">
                <DropZone zone="Toggle"/>
              </div>

              <nav className={`mt-14 ${isSidebarOpen ? 'space-y-1 md:space-y-3 lg:space-y-4' : 'md:space-y-3 lg:space-y-6'}`}>
                {navigation.map((item, index) => (
                  <div key={index} className="transform-gpu">
                    <Link 
                      href={item.href}
                      className="block text-lg lg:text-xl first-letter:text-2xl first-letter:bold text-adaptive-secondary group"
                      onClick={createRipple}
                    >
                      <span className={clsx(
                        "block transform-gpu transition-all duration-300 ease-in-out group-hover:scale-[1.035] group-hover:text-adaptive-accent",
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                      )}>
                        {item.label}
                      </span>
                      
                      <span className={clsx(
                        "block transform-gpu transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-adaptive-accent",
                        isSidebarOpen ? 'opacity-0 hidden' : 'opacity-100'
                      )}>
                        {item.icon && dynamicIconImports[item.icon] && 
                          dynamicIconImports[item.icon]({ isSidebarOpen })}
                    </span>
                  </Link>
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom section */}
            <div className="mt-auto space-y-4">
              <div className={clsx(
                "mt-8 transition-all duration-300 items-center ease-in-out",
                isSidebarOpen ? 'w-auto hover:scale-[1.02]' : 'gap-4 w-6 -pl-4 hover:scale-[1.15]'
              )}>
                <DropZone zone="Contact" />
              </div>

              <div className={isSidebarOpen ? 'block' : 'hidden'}>
                <p className="italic text-adaptive-secondaryAlt text-xs lg:text-base tracking-normal">
                  Looking for Substance?
                </p>
                <p className="text-adaptive-secondaryAlt text-xs lg:text-base italic line-through">
                  Subscribe
                </p>
                <p className="text-adaptive-secondaryAlt text-xs lg:text-base">
                  Prescribe to us
                </p>
              </div>

              {showSubscribe && (
                <div className={clsx(
                  "flex",
                  isSidebarOpen ? 'gap-2' : 'flex-col gap-2 items-center pl-2'
                )}>
                  <button className="hidden md:flex text-adaptive-secondary p-1.5 rounded 
                    hover:scale-[1.15] hover:text-adaptive-accent 
                    transition-all duration-300 ease-in-out transform-gpu
                    items-center justify-center w-8 h-8">
                    <MailPlus size={16} />
                  </button>
                  <button className="hidden md:flex text-adaptive-secondary p-1.5 rounded 
                    hover:scale-[1.15] hover:text-adaptive-accent 
                    transition-all duration-300 ease-in-out transform-gpu
                    items-center justify-center w-8 h-8">
                    <Instagram size={16} />
                  </button>
                  <button className="hidden md:flex text-adaptive-secondary p-1.5 rounded 
                    hover:scale-[1.15] hover:text-adaptive-accent 
                    transition-all duration-300 ease-in-out transform-gpu
                    items-center justify-center w-8 h-8">
                    <Rss size={16} />
                  </button>
                </div>
              )}

              <p className={clsx(
                "text-adaptive-accent text-xs italic",
                isSidebarOpen ? 'block' : 'hidden'
              )}>
                Not a cult!™
              </p>
            </div>
          </div>
        </aside>
      </>
    );
  }
};