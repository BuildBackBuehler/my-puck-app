import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { ComponentConfig } from "@measured/puck";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { clsx } from "clsx";
import React from "react";

export interface AlertDialogProps {
  trigger: {
    text: string;
    className: string;
  };
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  overlayClassName: string;
  contentClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  cancelClassName: string;
  confirmClassName: string;
}

export const AlertDialog: ComponentConfig<AlertDialogProps> = {
  fields: {
    trigger: {
      type: "object",
      fields: {
        text: { type: "text" },
        className: { type: "text" }
      }
    },
    title: { type: "text" },
    description: { type: "textarea" },
    cancelText: { type: "text" },
    confirmText: { type: "text" },
    overlayClassName: { type: "text" },
    contentClassName: { type: "text" },
    titleClassName: { type: "text" },
    descriptionClassName: { type: "text" },
    cancelClassName: { type: "text" },
    confirmClassName: { type: "text" }
  },

  defaultProps: {
    trigger: {
      text: "Delete account",
      className: "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-gray-100 dark:hover:bg-red-600"
    },
    title: "Are you absolutely sure?",
    description: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
    cancelText: "Cancel",
    confirmText: "Yes, delete account",
    overlayClassName: "fixed inset-0 z-20 bg-black/50",
    contentClassName: clsx(
      "fixed z-50 w-[95vw] max-w-md rounded-lg p-4 md:w-full",
      "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      "bg-white dark:bg-gray-800",
      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    ),
    titleClassName: "text-lg font-medium text-gray-900 dark:text-gray-100",
    descriptionClassName: "mt-2 text-sm font-normal text-gray-700 dark:text-gray-400",
    cancelClassName: "inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900",
    confirmClassName: "inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-gray-100 dark:hover:bg-red-600"
  },

  render: ({ 
    trigger, 
    title, 
    description, 
    cancelText, 
    confirmText,
    overlayClassName,
    contentClassName,
    titleClassName,
    descriptionClassName,
    cancelClassName,
    confirmClassName
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <AlertDialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogPrimitive.Trigger className={trigger.className}>
          {trigger.text}
        </AlertDialogPrimitive.Trigger>

        <AlertDialogPrimitive.Portal>
          <Transition.Root show={isOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <AlertDialogPrimitive.Overlay className={overlayClassName} />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <AlertDialogPrimitive.Content className={contentClassName}>
                <AlertDialogPrimitive.Title className={titleClassName}>
                  {title}
                </AlertDialogPrimitive.Title>
                <AlertDialogPrimitive.Description className={descriptionClassName}>
                  {description}
                </AlertDialogPrimitive.Description>
                <div className="mt-4 flex justify-end space-x-2">
                  <AlertDialogPrimitive.Cancel className={cancelClassName}>
                    {cancelText}
                  </AlertDialogPrimitive.Cancel>
                  <AlertDialogPrimitive.Action className={confirmClassName}>
                    {confirmText}
                  </AlertDialogPrimitive.Action>
                </div>
              </AlertDialogPrimitive.Content>
            </Transition.Child>
          </Transition.Root>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    );
  }
};