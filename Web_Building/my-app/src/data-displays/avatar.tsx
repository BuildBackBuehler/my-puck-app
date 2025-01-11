import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import type { Author as AuthorType } from "../../lib/supabase";
import { getAuthors } from "../../utils/supabase/client";
import React from "react";

const sizeClassMap = {
  sm: "h-4 w-4 md:h-6 md:w-6 lg:h-8 lg:w-8",
  md: "h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10",
  lg: "h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12",
  xl: "h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
};

export type AuthorProps = {
  authorId?: string;
  showBio?: boolean;
  showRole?: boolean;
  pen_name?: string;
  initials?: string;
};

export interface AvatarProps {
  authorId?: string;
  variant: "circle" | "rounded";
  size: keyof typeof sizeClassMap;
  isOnline?: boolean;
  pen_name?: string;
  showPenName?: boolean;
}

export const Avatar: ComponentConfig<AvatarProps> = {
  fields: {
    authorId: {
      type: "external",
      label: "Select Author",
      fetchList: async () => {
        const authors = await getAuthors();
        return authors;
      },
      getItemSummary: (item: AuthorType) => item.initials,
      mapProp: (item: AuthorType) => item.id,
    },
    variant: {
      type: "radio",
      options: [
        { label: "Circle", value: "circle" },
        { label: "Rounded", value: "rounded" }
      ]
    },
    size: {
      type: "select",
      options: Object.keys(sizeClassMap).map(size => ({
        label: size.toUpperCase(),
        value: size
      }))
    },
    isOnline: {
      type: "radio",
      options: [
        { label: "Online", value: true },
        { label: "Offline", value: false }
      ]
    },
    showPenName: {
      type: "radio",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ],
      defaultValue: true
    },
  },

  defaultProps: {
    variant: "circle",
    size: "md",
    isOnline: false,
    showPenName: true
  },

  render: ({ authorId, variant, size, isOnline, showPenName = true }) => {
    const [author, setAuthor] = React.useState<AuthorType | null>(null);

    React.useEffect(() => {
      if (authorId) {
        getAuthors().then(authors => {
          const selectedAuthor = authors.find(a => a.id === authorId);
          setAuthor(selectedAuthor || null);
        });
      }
    }, [authorId]);

    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <AvatarPrimitive.Root
            className={clsx(
              sizeClassMap[size],
              variant === "circle" ? "rounded-full" : "rounded-md",
              "relative inline-flex items-center justify-center overflow-hidden bg-adaptive-secondary"
            )}
          >
            <AvatarPrimitive.Image
              src={author?.avatar_url}
              className="h-full w-full object-cover"
            />
            <AvatarPrimitive.Fallback
              className={clsx(
                "flex items-center justify-center bg-adaptive",
                variant === "circle" ? "rounded-full" : "rounded-md"
              )}
              delayMs={600}
            >
              <span className="text-sm font-medium text-adaptive-secondary">
                {author?.initials}
              </span>
            </AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
          )}
        </div>
        {showPenName && author?.pen_name && (
          <span className="text-adaptive-secondaryAlt hover:text-adaptive-accent text-sm md:text-base lg:text-lg transition-colors">
            {author.pen_name}
          </span>
        )}
      </div>
    );
  }
};