import * as ToastPrimitive from "@radix-ui/react-toast";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React, { useState } from "react";
import { useMediaQuery } from "../../lib/use-media-query";
import { Button as ButtonConfig } from "./button";
const Button = ButtonConfig.render;
export interface ToastProps {
  triggerText: string;
  title: string;
  description: string;
  actionText: string;
  actionUrl: string;
  dismissText: string;
  variant: "dark" | "light";
  position: "bottom" | "top";
}

export const Toast: ComponentConfig<ToastProps> = {
  fields: {
    triggerText: { type: "text" },
    title: { type: "text" },
    description: { type: "textarea" },
    actionText: { type: "text" },
    actionUrl: { type: "text" },
    dismissText: { type: "text" },
    variant: {
      type: "radio",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" }
      ]
    },
    position: {
      type: "radio",
      options: [
        { label: "Bottom", value: "bottom" },
        { label: "Top", value: "top" }
      ]
    }
  },

  defaultProps: {
    triggerText: "Show Notification",
    title: "Notification Title",
    description: "This is a notification message",
    actionText: "View",
    actionUrl: "#",
    dismissText: "Dismiss",
    variant: "light",
    position: "bottom"
  },

  render: ({ 
    triggerText,
    title, 
    description, 
    actionText, 
    actionUrl, 
    dismissText,
    variant,
    position
  }) => {
    const [open, setOpen] = useState(false);
    const isMd = useMediaQuery("(min-width: 768px)");

    const handleTrigger = () => {
      if (open) {
        setOpen(false);
        setTimeout(() => setOpen(true), 400);
      } else {
        setOpen(true);
      }
    };

    return (
      <ToastPrimitive.Provider swipeDirection={isMd ? "right" : "down"}>
        <Button onClick={handleTrigger} text={triggerText} />
        
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          className={clsx(
            "z-50 fixed w-auto shadow-lg rounded-lg",
            "radix-state-closed:animate-toast-hide",
            "radix-swipe-end:animate-toast-swipe-out",
            "radix-swipe-cancel:translate-x-0 duration-200 ease-[ease]",
            "focus:outline-none focus-visible:ring focus-visible:ring-purple-500",
            {
              "bg-white": variant === "light",
              "bg-gray-800": variant === "dark",
              "inset-x-4 bottom-4 md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm": position === "bottom",
              "inset-x-4 top-4 md:top-4 md:right-4 md:left-auto md:w-full md:max-w-sm": position === "top",
              "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right": position === "bottom",
              "radix-state-open:animate-toast-slide-in-top md:radix-state-open:animate-toast-slide-in-right": position === "top"
            }
          )}
        >
          <div className="flex">
            <div className="w-0 flex-1 flex items-center pl-5 py-4">
              <div className="w-full">
                <ToastPrimitive.Title className={clsx("text-sm font-medium", {
                  "text-gray-900": variant === "light",
                  "text-gray-100": variant === "dark"
                })}>
                  {title}
                </ToastPrimitive.Title>
                <ToastPrimitive.Description className={clsx("mt-1 text-sm", {
                  "text-gray-700": variant === "light",
                  "text-gray-400": variant === "dark"
                })}>
                  {description}
                </ToastPrimitive.Description>
              </div>
            </div>
            
            <div className="flex flex-col px-3 py-2 space-y-1">
              <ToastPrimitive.Action
                altText={actionText}
                className={clsx(
                  "w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium",
                  "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500",
                  {
                    "text-purple-600 hover:bg-gray-50": variant === "light",
                    "text-purple-500 hover:bg-gray-900": variant === "dark"
                  }
                )}
                onClick={() => window.open(actionUrl)}
              >
                {actionText}
              </ToastPrimitive.Action>
              
              <ToastPrimitive.Close className={clsx(
                "w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium",
                "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500",
                {
                  "text-gray-700 hover:bg-gray-50": variant === "light",
                  "text-gray-100 hover:bg-gray-900": variant === "dark"
                }
              )}>
                {dismissText}
              </ToastPrimitive.Close>
            </div>
          </div>
        </ToastPrimitive.Root>

        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    );
  }
};