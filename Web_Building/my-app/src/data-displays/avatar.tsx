// avatar.tsx
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";

const sizeClassMap = {
  sm: "h-4 w-4 md:h-6 md:w-6 lg:h-8 lg:w-8",
  md: "h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10",
  lg: "h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12",
  xl: "h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
};

export type AvatarFields = {
  variant: "circle" | "rounded";
  size: keyof typeof sizeClassMap;
  isOnline?: boolean;
  showPenName?: boolean;
}

export const Avatar: ComponentConfig<AvatarFields> = {
  fields: {
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
      ]
    }
  },

  defaultProps: {
    variant: "circle",
    size: "md",
    isOnline: false,
    showPenName: true
  },

  render: ({ variant, size, isOnline, showPenName }) => {
    return (
      <AvatarWrapper
        variant={variant}
        size={size}
        isOnline={isOnline}
        showPenName={showPenName}
      />
    );
  }
};

export const AvatarWrapper = ({ 
  variant, 
  size, 
  isOnline, 
  showPenName,
  author
}: AvatarFields & { author?: any }) => {
  return (
    <div className="flex items-center align-middle gap-2">
      <div className="relative">
        <AvatarPrimitive.Root
          className={clsx(
            sizeClassMap[size],
            variant === "circle" ? "rounded-full" : "rounded-lg",
            "relative inline-flex items-center justify-center overflow-hidden bg-adaptive-secondary"
          )}
        >
          {author?.avatar_url && (
            <AvatarPrimitive.Image
              src={author.avatar_url}
              className="h-full w-full object-cover"
            />
          )}
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
          <span className="absolute bottom-1 -right-0.5 h-2 w-2 rounded-full bg-green ring-1 ring-white" />
        )}
      </div>
      {showPenName && author?.pen_name && (
        <span className="relative align-middle pb-1 font-serif text-adaptive-secondaryAlt hover:text-adaptive-accent text-sm md:text-base lg:text-lg transition-colors">
          {author.pen_name}
        </span>
      )}
    </div>
  );
};