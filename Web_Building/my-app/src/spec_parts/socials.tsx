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

export interface SocialsProps {
  showSubscribe?: boolean;
}

export const Socials: ComponentConfig<SocialsProps> = {
  fields: {
    showSubscribe: { type: "radio", options: [
      { label: "Show", value: true },
      { label: "Hide", value: false }
    ]}
  },
  defaultProps: {
    showSubscribe: true
  },
  render: ({ showSubscribe }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
            <div className="pt-16 space-y-2">
            <p className={`text-adaptive-secondary text-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Looking for Substance?"}</p>
            <p><span className={`text-adaptive-secondary text-md italic line-through transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Subscribe"}</span></p>
            <p><span className={`italic text-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Prescribe to us"}</span></p>
            {showSubscribe && (
              <div className={`flex ${isOpen ? 'gap-2' : 'flex-col gap-4'} ${!isOpen && 'mt-4'}`}>
              <button className="bg-adaptive-primary text-adaptive-secondary p-1.5 rounded hover:text-red transition-colors flex items-center justify-center w-8 h-8">
              <MailPlus size={16} />
              </button>
              <button className="bg-adaptive-primary text-adaptive-secondary p-1.5 rounded hover:text-red transition-colors flex items-center justify-center w-8 h-8">
              <Instagram size={16} />
              </button>
              <button className="bg-adaptive-primary text-adaptive-secondary p-1.5 rounded hover:text-red transition-colors flex items-center justify-center w-8 h-8">
              <Rss size={16} />
              </button>
              </div>
            )}
            <p className={`text-adaptive-secondary text-xs italic transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{"Not a cult!™"}</p>
            </div>
    );
  }
};