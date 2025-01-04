import { ComponentConfig, DropZone } from "@measured/puck";
import Link from "next/link";
import { useState } from "react";
import { Rss, Instagram, MailPlus } from "lucide-react";
import Image from 'next/image';
import NewsletterIcon from '../misc/reshot-icon-newsletter-DVKLPRYUF6.svg';
import { useLayoutState } from "../../lib/layout-state";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface SidebarProps {
  navigation: NavItem[];
  socialHandle?: string;
  showSubscribe?: boolean;
}

export const Sidebar: ComponentConfig<SidebarProps> = {
  fields: {
    navigation: {
      type: "array",
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        icon: { type: "text" }
      }
    },
    socialHandle: { type: "text" },
    showSubscribe: { type: "radio", options: [
      { label: "Show", value: true },
      { label: "Hide", value: false }
    ]}
  },
  defaultProps: {
    navigation: [
      { label: "Lemmy Reddit  ", href: "/forums", icon: "↗" },
      { label: "Arts", href: "/arts"},
      { label: "Archive", href: "/archive" },
      { label: "Essentials", href: "/essentials" },
      { label: "Manifesto", href: "/manifesto" },
    ],
    socialHandle: "@lotuswav.es",
    showSubscribe: true
  },
  render: ({ navigation = [], socialHandle, showSubscribe }) => {
    const { isSidebarOpen: isOpen, setSidebarOpen: setIsOpen } = useLayoutState()

    return (
      <aside className={`fixed top-0 left-0 h-screen transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col h-full justify-between p-8">
          <div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-1/2 right-2 w-6 h-6 border border-adaptive-secondary text-adaptive-secondary hover:text-adaptive-accent hover:border-adaptive-accent rounded-full flex items-center justify-center cursor-pointer"
            >
              {isOpen ? '←' : '→'}
            </button>
            <div className="absolute mt-8 h-min-[100px] w-full rounded-md">
              <DropZone zone="Toggle"/>
            </div>
            <nav className="space-y-4 mt-12">
              {navigation.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href}
                  className="block text-xl text-adaptive-secondary hover:text-adaptive-accent transition-colors"
                >
                  <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    {item.label}
                  </span>
                  {item.icon && <span className="inline-block w-8">{item.icon}</span>}
                </Link>
              ))}
            </nav>
          </div>
          <div className={`transition-opacity flex items-center gap-2 mt-8 hover:text-adaptive-accent ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <DropZone zone="Contact Us"/>
          </div>
          <div className="mt-auto space-y-8">
            <div className="space-y-2">
              <p className={`text-adaptive-secondaryAlt text-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {"Looking for Substance?"}
              </p>
              <p>
                <span className={`text-adaptive-secondaryAlt text-sm italic line-through transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {"Subscribe"}
                </span>
              </p>
              <p>
                <span className={`text-adaptive-secondaryAlt italic text-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {"Prescribe to us"}
                </span>
              </p>
            </div>
            
            {showSubscribe && (
              <div className={`flex ${isOpen ? 'gap-2' : 'flex-col gap-4'} ${!isOpen && 'mt-4'}`}>
                <button className=" text-adaptive-secondary p-1.5 rounded hover:text-adaptive-accent transition-colors flex items-center justify-center w-8 h-8">
                  <MailPlus size={16} />
                </button>
                <button className=" text-adaptive-secondary p-1.5 rounded hover:text-adaptive-accent transition-colors flex items-center justify-center w-8 h-8">
                  <Instagram size={16} />
                </button>
                <button className="text-adaptive-secondary p-1.5 rounded hover:text-adaptive-accent transition-colors flex items-center justify-center w-8 h-8">
                  <Rss size={16} />
                </button>
              </div>
            )}
            <p className={`text-adaptive-accent text-xs italic transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              {"Not a cult!™"}
            </p>
          </div>
        </div>
      </aside>
    );
  }
};