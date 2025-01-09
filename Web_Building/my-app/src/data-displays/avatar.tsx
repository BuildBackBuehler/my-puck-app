import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";

const sizeClassMap = {
  sm: "h-4 w-4 md:h-6 md:w-6 lg:h-8 lg:w-8",
  md: "h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10",
  lg: "h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12",
  xl: "h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
};

export interface AvatarProps {
  items: {
    image: string;
    fallbackText: string;
  }[];
  variant: "circle" | "rounded";
  size: keyof typeof sizeClassMap;
  isOnline?: boolean;
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
    }
  },

  defaultProps: {
    items: [{
      image: "https://images.unsplash.com/photo-1573607217032-18299406d100",
      fallbackText: "JD"
    }],
    variant: "circle",
    size: "md",
    isOnline: false
  },

  render: ({ items, variant, size, isOnline }) => {
    const variantClass = variant === "circle" ? "rounded-full" : "rounded";
    const sizeClass = sizeClassMap[size];

    return (
      <div className="flex gap-2 items-center">
        {items.map((item, index) => (
          <div key={index} className="relative inline-flex">
            <AvatarPrimitive.Root className={clsx("relative inline-flex", sizeClass)}>
              <AvatarPrimitive.Image
                src={item.image}
                alt={item.fallbackText}
                className={clsx("aspect-square object-cover", variantClass)}
              />
              <AvatarPrimitive.Fallback
                className={clsx(
                  "flex items-center justify-center bg-gray-100",
                  variantClass
                )}
                delayMs={600}
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.fallbackText}
                </span>
              </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
            
            {isOnline && (
              <span className={clsx(
                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white",
                variant === "circle" && "translate-x-1/6 translate-y-1/6"
              )} />
            )}
          </div>
        ))}
      </div>
    );
  }
};