import * as ToastPrimitive from "@radix-ui/react-toast";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";
import { useMediaQuery } from "../../lib/use-media-query";

export interface ToastProps {
  title: string;
  description: string;
  actionText: string;
  actionUrl: string;
  dismissText: string;
  rootClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  actionClassName: string;
  dismissClassName: string;
}

export const Toast: ComponentConfig<ToastProps> = {
  fields: {
    title: { type: "text" },
    description: { type: "textarea" },
    actionText: { type: "text" },
    actionUrl: { type: "text" },
    dismissText: { type: "text" },
    rootClassName: { type: "text" },
    titleClassName: { type: "text" },
    descriptionClassName: { type: "text" },
    actionClassName: { type: "text" },
    dismissClassName: { type: "text" }
  },

  defaultProps: {
    title: "Notification",
    description: "This is a toast notification",
    actionText: "View",
    actionUrl: "#",
    dismissText: "Dismiss",
    rootClassName: clsx(
      "z-50 fixed bottom-4 inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg",
      "bg-white dark:bg-gray-800",
      "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
      "radix-state-closed:animate-toast-hide",
      "radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x",
      "radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x",
      "radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y",
      "radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y",
      "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    titleClassName: "text-sm font-medium text-gray-900 dark:text-gray-100",
    descriptionClassName: "mt-1 text-sm text-gray-700 dark:text-gray-400",
    actionClassName: clsx(
      "w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium",
      "text-purple-600 dark:text-purple-500 hover:bg-gray-50 dark:hover:bg-gray-900",
      "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    dismissClassName: clsx(
      "w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium",
      "text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900",
      "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    )
  },

  render: ({ title, description, actionText, actionUrl, dismissText, rootClassName, titleClassName, descriptionClassName, actionClassName, dismissClassName }) => {
    const [open, setOpen] = React.useState(false);
    const isMd = window.matchMedia("(min-width: 768px)").matches;

    return (
      <ToastPrimitive.Provider swipeDirection={isMd ? "right" : "down"}>
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          className={rootClassName}
        >
          <div className="flex">
            <div className="w-0 flex-1 flex items-center pl-5 py-4">
              <div className="w-full radix">
                <ToastPrimitive.Title className={titleClassName}>
                  {title}
                </ToastPrimitive.Title>
                <ToastPrimitive.Description className={descriptionClassName}>
                  {description}
                </ToastPrimitive.Description>
              </div>
            </div>
            <div className="flex flex-col px-3 py-2 space-y-1">
              <ToastPrimitive.Action
                altText={actionText}
                className={actionClassName}
                onClick={() => window.open(actionUrl)}
              >
                {actionText}
              </ToastPrimitive.Action>
              <ToastPrimitive.Close className={dismissClassName}>
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