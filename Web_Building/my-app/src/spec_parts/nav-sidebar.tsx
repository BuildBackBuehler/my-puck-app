import { ComponentConfig, DropZone } from "@measured/puck";
import Link from "next/link";
import { useState } from "react";
import { Rss, Instagram, MailPlus } from "lucide-react";
import Image from 'next/image';
import NewsletterIcon from '../misc/reshot-icon-newsletter-DVKLPRYUF6.svg';

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
    const [isOpen, setIsOpen] = useState(true);

    return (
      <aside className={`fixed top-0 left-0 h-full bg-neutral-900 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col h-full justify-between p-8">
          <div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-1/2 -right-4 w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center cursor-pointer"
            >
              {isOpen ? '←' : '→'}
            </button>
            <div>
              <DropZone zone="my-content 1" />
            </div>
            <nav className="space-y-6 mt-8">
              {navigation.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href}
                  className="block text-2xl text-white hover:text-gray-300 transition-colors"
                >
                  {item.icon && <span className="inline-block w-8">{item.icon}</span>}
                  <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
            <div className={`space-y-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <DropZone zone="my-content 2" />
            </div>
            <div className="space-y-4">
            <p className={`text-white text-lg transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Looking for Substance?"}</p>
            <p><span className={`text-white text-lg italic line-through transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Subscribe"}</span></p>
            <p><span className={`text-white italic text-lg transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Prescribe to us"}</span></p>
            {showSubscribe && (
              <div className={`flex ${isOpen ? 'gap-2' : 'flex-col gap-4'} ${!isOpen && 'mt-4'}`}>
              <button className="bg-white text-black p-1.5 rounded hover:bg-gray-100 transition-colors flex items-center justify-center w-8 h-8">
              <MailPlus size={16} />
              </button>
              <button className="bg-white text-black p-1.5 rounded hover:bg-gray-100 transition-colors flex items-center justify-center w-8 h-8">
              <Instagram size={16} />
              </button>
              <button className="bg-white text-black p-1.5 rounded hover:bg-gray-100 transition-colors flex items-center justify-center w-8 h-8">
              <Rss size={16} />
              </button>
              </div>
            )}
            <p className={`text-white text-xs italic transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Not a cult!™"}</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }
};