import { ComponentConfig } from "@measured/puck";
import Link from "next/link";
import { useState } from "react";
import { Rss, Instagram, MailPlus } from "lucide-react";
import { Dialog as DialogConfig } from "../buttons/dialog";
const Dialog = DialogConfig.render;

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
  render: ({ navigation, socialHandle, showSubscribe }) => {
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

            <div className="mt-6">
              <Dialog 
                buttonText="Contact Us"
                title="Get in Touch"
                description="Send us a message"
                dialogClassName="bg-neutral-900 p-6 rounded-lg"
                titleClassName="text-2xl font-bold text-white"
                descriptionClassName="text-gray-400 mt-2"
                saveButtonClassName="bg-white text-black px-4 py-2 rounded"
                closeButtonClassName="text-white hover:text-gray-300"
                fields={[
                  {
                    id: "email",
                    label: "Email",
                    placeholder: "your@email.com",
                    type: "email",
                    labelClassName: "text-white",
                    inputClassName: "bg-neutral-800 text-white rounded p-2 mt-1",
                    autoComplete: "email"
                  },
                  {
                    id: "message",
                    label: "Message",
                    placeholder: "Your message",
                    type: "textarea",
                    labelClassName: "text-white",
                    inputClassName: "bg-neutral-800 text-white rounded p-2 mt-1"
                  }
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-white text-lg">{"Looking for Substance?"}</p>
            <p><span className="text-white text-lg italic line-through">{"Subscribe"}</span></p>
            <p><span className="text-white italic text-lg">{"Prescribe to us"}</span></p>
            {showSubscribe && (
              <div className="flex gap-2">
              <button className="bg-white text-black p-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-center">
                <MailPlus size={20} />
              </button>
              <button className="bg-white text-black p-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-center">
                <Instagram size={20} />
              </button>
              <button className="bg-white text-black p-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-center">
                <Rss size={20} />
              </button>
              </div>
            )}
            <p className="text-white text-xs italic">{"Not a cult!™"}</p>
          </div>
        </div>
      </aside>
    );
  }
};