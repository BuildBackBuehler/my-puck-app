import { ComponentConfig } from "@measured/puck"
import Image from "next/image"
import { Avatar } from '../data-displays/avatar';

export interface MiniCardProps {
  id: string
  title: string
  subtitle?: string
  description: string
  imageUrl: string
  isNew?: boolean
}

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MiniCard: ComponentConfig<MiniCardProps> = {
  fields: {
    id: { type: "text" },
    title: { type: "text" },
    subtitle: { type: "text" },
    description: { type: "textarea" },
    imageUrl: { type: "text" },
    isNew: { type: "radio", options: [
      { label: "Show", value: true },
      { label: "Hide", value: false }
    ]}
  },

  defaultProps: {
    id: "",
    title: "Article Title",
    description: "Article description goes here",
    imageUrl: "/placeholder.jpg",
    isNew: false
  },

  render: ({ title, subtitle, description, imageUrl, isNew }) => (
    <div className="bg-adaptive-primaryAlt rounded-lg shadow-lg overflow-hidden h-full">
      <div className="relative h-48">
        <Image 
          src={imageUrl} 
          alt={title} 
          layout="fill" 
          objectFit="cover"
          quality={90}
          priority
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-adaptive-secondary flex items-center gap-2">
          {title}
          {isNew && (
            <span className="text-sm font-bold bg-adaptive-accent text-adaptive-primary px-2 py-1 rounded">
              New
            </span>
          )}
        </h3>
        {subtitle && <p className="text-adaptive-secondaryAlt">{subtitle}</p>}
        <p className="mt-4 text-base text-adaptive-secondary line-clamp-4 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}