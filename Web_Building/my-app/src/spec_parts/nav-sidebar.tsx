import { ComponentConfig } from "@measured/puck";
import Link from "next/link";
import { useState } from "react";

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
      { label: "Work", href: "/work", icon: "↗" },
      { label: "Studio", href: "/studio" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ],
    socialHandle: "@MagazineDope",
    showSubscribe: true
  },
  render: ({ navigation, socialHandle, showSubscribe }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <aside className={`fixed top-0 right-0 h-full bg-neutral-900 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col h-full justify-between p-8">
          <div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-8 -left-4 w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center cursor-pointer"
            >
              {isOpen ? '→' : '←'}
            </button>
            
            <nav className="space-y-6 mt-8">
              {navigation.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className="block text-2xl text-white hover:text-gray-300 transition-colors"
                >
                  {item.label} {item.icon}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-white text-lg">{socialHandle}</p>
            {showSubscribe && (
              <button className="w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            )}
          </div>
        </div>
      </aside>
    );
  }
};