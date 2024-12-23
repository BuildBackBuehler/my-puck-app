import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";

export interface AvatarProps {
  items: {
    image: string;
    fallbackText: string;
  }[];
  variant: "circle" | "rounded";
  isOnline?: boolean;
  avatarClassName: string;
  imageClassName: string;
  fallbackClassName: string;
  onlineIndicatorClassName: string;
}

export const Avatar: ComponentConfig<AvatarProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item) => item.fallbackText,
      arrayFields: {
        image: { type: "text" },
        fallbackText: { type: "text" }
      }
    },
    variant: {
      type: "radio",
      options: [
        { label: "Circle", value: "circle" },
        { label: "Rounded", value: "rounded" }
      ]
    },
    isOnline: {
      type: "radio",
      options: [
        { label: "Online", value: true },
        { label: "Offline", value: false }
      ]
    },
    avatarClassName: { type: "text" },
    imageClassName: { type: "text" },
    fallbackClassName: { type: "text" },
    onlineIndicatorClassName: { type: "text" }
  },

  defaultProps: {
    items: [{
      image: "https://images.unsplash.com/photo-1573607217032-18299406d100",
      fallbackText: "JD"
    }],
    variant: "circle",
    isOnline: false,
    avatarClassName: "relative inline-flex h-10 w-10",
    imageClassName: "h-full w-full object-cover",
    fallbackClassName: "flex h-full w-full items-center justify-center bg-white dark:bg-gray-800",
    onlineIndicatorClassName: "block h-2.5 w-2.5 rounded-full bg-green-400"
  },

  render: ({ 
    items,
    variant, 
    isOnline, 
    avatarClassName,
    imageClassName,
    fallbackClassName,
    onlineIndicatorClassName
  }) => {
    const variantClassMap = {
      circle: "rounded-full",
      rounded: "rounded"
    };

    return (
      <>
        {items.map((item, index) => (
          <AvatarPrimitive.Root
            key={index}
            className={avatarClassName}
          >
            <AvatarPrimitive.Image
              src={item.image}
              alt="Avatar"
              className={clsx(imageClassName, variantClassMap[variant])}
            />
            {isOnline && (
              <div className={clsx(
                "absolute bottom-0 right-0 h-2 w-2",
                variant === "circle" ? "-translate-x-1/2 -translate-y-1/2" : ""
              )}>
                <span className={onlineIndicatorClassName} />
              </div>
            )}
            <AvatarPrimitive.Fallback
              className={clsx(fallbackClassName, variantClassMap[variant])}
              delayMs={600}
            >
              <span className="text-sm font-medium uppercase text-gray-700 dark:text-gray-400">
                {item.fallbackText}
              </span>
            </AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>
        ))}
      </>
    )
  }
};
