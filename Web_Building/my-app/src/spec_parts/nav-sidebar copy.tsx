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

const dynamicIconImports = {
  'Snoo': ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
    <div className="w-6 h-6 flex items-center md:-mb-8">
      <Image 
        src="/snoo.svg"
        alt="Reddit Icon"
        width={16}
        height={16}
        className="text-adaptive-secondary hover:text-adaptive-accent"
      />
    </div>
  ),
  'Contact': () => <Contact size={16} />,
  'Palette': () => <Palette size={16} />,
  'Archive': () => <Archive size={16} />,
  'Sparkles': () => <Sparkles size={16} />,
  'Unabomber': ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
    <div className="w-8 h-6 flex items-center">
      <Image
        src="/unabomber.svg"
        alt="Manifesto Icon"
        width={18}
        height={16}
        className="text-adaptive-secondary hover:text-adaptive-accent"
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
  // Icons:{ 
  //   Lemmy: string
  //   About: string
  //   Arts: string
  //   Archive: string
  //   Essentials: string
  //   Manifesto: string
  // }
  socialHandle?: string
  showSubscribe?: boolean
  initialState?: 'open' | 'closed'
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
  //   Icons: {
  //   type: "object",
  //   objectFields: {
  //     Lemmy: {
  //       type: "select",
  //       options: Object.keys(dynamicIconImports).map(name => ({
  //         label: name, value: name
  //       }))
  //     },
  //     About: {
  //       type: "select", 
  //       options: Object.keys(dynamicIconImports).map(name => ({
  //         label: name, value: name
  //       }))
  //     },
  //     Arts: {
  //       type: "select",
  //       options: Object.keys(dynamicIconImports).map(name => ({
  //         label: name, value: name
  //       }))
  //     },
  //     Archive: {
  //       type: "select", 
  //       options: Object.keys(dynamicIconImports).map(name => ({
  //         label: name, value: name
  //       }))
  //     },
  //     Essentials: {
  //       type: "select",
  //       options: Object.keys(dynamicIconImports).map(name => ({
  //         label: name, value: name
  //       }))
  //     },
  //     Manifesto: {
  //       type: "select", 
  //       options: Object.keys(dynamicIconImports).map(name => ({
  //         label: name, value: name
  //       }))
  //     },
  //   },
  // },
    socialHandle: { type: "text" },
    showSubscribe: { 
      type: "radio", 
      options: [
        { label: "Show", value: "true" },
        { label: "Hide", value: "false" }
      ]
    },
    initialState: {
      type: "radio",
      options: [
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" }
      ]
    },
    showDivider: { 
      type: "radio", 
      options: [
        { label: "Show", value: "true" },
        { label: "Hide", value: "false" }
      ]
    }
  },

  defaultProps: {
    navigation: [
      { label: "Lemmy ↗", href: "/forums", icon: "Snoo" },
      { label: "About Us", href: "/about", icon: "Contact" },
      { label: "Arts", href: "/arts", icon: "Palette" },
      { label: "Archive", href: "/archive", icon: "Archive" },
      { label: "Essentials", href: "/essentials", icon: "Sparkles" },
      { label: "Manifesto", href: "/manifesto", icon: "Unabomber" }
    ],
    // Icons: {
    //   Lemmy: "Snoo",
    //   About: "Contact",
    //   Arts: "Palette",
    //   Archive: "Archive",
    //   Essentials: "Sparkles",
    //   Manifesto: "Unabomber",
    // },
    socialHandle: "@lotuswav.es",
    showSubscribe: true,
    initialState: "open",
    showDivider: false
  },

  render: ({ navigation = [], socialHandle, showSubscribe, initialState = 'open', showDivider }) => {
    const [isOpen, setIsOpen] = useState(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sidebarState')
        return saved ? JSON.parse(saved) : true
      }
      return true
    })

    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarState', JSON.stringify(isOpen))
      }
    }, [isOpen])

    const { isSidebarOpen, setSidebarOpen } = useLayoutState()

    useEffect(() => {
      setSidebarOpen(isOpen)
    }, [isOpen, setSidebarOpen])

    useEffect(() => {
      const checkWidth = () => {
        const isMobile = window.innerWidth <= 430; // phones
        setIsOpen(!isMobile);
        setSidebarOpen(!isMobile);
      };

      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }, [setSidebarOpen]);

    return (
      <aside   className={`
        absolute inset-y-0 left-0 h-full transition-all duration-300
        ${isSidebarOpen 
          ? 'w-16 md:w-36 lg:w-64' 
          : 'w-8 md:w-12 lg:w-16'
        }
      `}
      >
        {showDivider && (
          <div className={`absolute right-0 top-[13.5vh] w-px h-[86.5vh] bg-adaptive-secondaryAlt transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
        )}
        <div className="flex flex-col h-full justify-between p-4 sm:p-6 lg:p-8">
          <div className="relative">
            <button 
              onClick={() => {
                const newState = !isSidebarOpen
                setSidebarOpen(newState)
                localStorage.setItem('sidebarState', JSON.stringify(newState))
              }}
              className="absolute -right-6 top-[50vh] w-3.5 h-3.5 md:w-4 md:h-4 lg:w-6 lg:h-6 border border-adaptive-secondary text-adaptive-secondary hover:text-adaptive-accent hover:border-adaptive-accent rounded-full flex items-center justify-center cursor-pointer bg-adaptive-primary opacity-40 hover:opacity-100 transition-all duration-150"
            >
              <span className="text-3xs md:text-sm lg:text-base bg-adaptive-secondary"></span>
              {isSidebarOpen ? '←' : '→'}
            </button>
            <div className="mt-8">
              <DropZone zone="Toggle"/>
            </div>
            <nav className={`mt-12 ${isSidebarOpen ? 'space-y-2 lg:space-y-4' : ''}`}>
              {navigation.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href}
                  className="block md:text-lg lg:text-xl first-letter:text-2xl first-letter:bold text-adaptive-secondary hover:text-adaptive-accent transition-colors"
                >
                  {/* Desktop - Text only */}
                  <span className={`hidden md:block transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    {item.label}
                  </span>
                  
                  {/* Mobile/Tablet - Icon only */}
                  <span className={`transition-opacity ${isSidebarOpen ? 'md:opacity-0 md:hidden md:w-0 gap-4' : 'items-center opacity-100 block w-auto max-md:gap-4 max-md:space-y-4' }`}>
                    {item.icon && dynamicIconImports[item.icon] && dynamicIconImports[item.icon]({ isSidebarOpen })}
                  </span>
                </Link>
              ))}
            </nav>
          </div>


          <div className="mt-auto space-y-4">
            <div className={`mt-8 transition-all duration-300 items-center ${isSidebarOpen ? 'w-auto' : 'gap-4 w-6 -pl-4'}`}>
                <DropZone zone="Contact" />
              </div>
            <div className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
              <p className="text-adaptive-secondaryAlt lg:text-base md:text-xs text-2xs">Looking for Substance?</p>
              <p className="text-adaptive-secondaryAlt lg:text-base md:text-xs text-2xs italic line-through">Subscribe</p>
              <p className="text-adaptive-secondaryAlt italic lg:text-base md:text-xs text-2xs">Prescribe to us</p>
            </div>
            
            {showSubscribe && (
              <div className={`flex ${isSidebarOpen ? 'gap-2' : 'flex-col gap-2 items-center pl-2'}`}>
                <button className="text-adaptive-secondary p-1.5 rounded hover:text-adaptive-accent transition-colors flex items-center justify-center w-8 h-8">
                  <MailPlus size={16} />
                </button>
                <button className="text-adaptive-secondary p-1.5 rounded hover:text-adaptive-accent transition-colors flex items-center justify-center w-8 h-8">
                  <Instagram size={16} />
                </button>
                <button className="text-adaptive-secondary p-1.5 rounded hover:text-adaptive-accent transition-colors flex items-center justify-center w-8 h-8">
                  <Rss size={16} />
                </button>
              </div>
            )}

            <p className={`text-adaptive-accent text-2xs md:text-xs italic ${isSidebarOpen ? 'block' : 'hidden'}`}>
              Not a cult!™
            </p>
          </div>
        </div>
      </aside>
    )
  }
}