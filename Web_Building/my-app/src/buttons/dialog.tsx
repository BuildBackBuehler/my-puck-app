import { Transition } from "@headlessui/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ComponentConfig } from "@measured/puck";
import { Cross1Icon } from "@radix-ui/react-icons";
import React, { Fragment, ReactElement } from "react";
import { clsx } from "clsx";
import { Button } from "./button";

export interface DialogProps {
  buttonText: string;
  title: string;
  description: string;
  dialogClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  saveButtonClassName: string;
  closeButtonClassName: string;
  fields: {
    id: string;
    label: string;
    placeholder: string;
    type: string;
    labelClassName: string;
    inputClassName: string;
    autoComplete?: string;
  }[];
}

export const Dialog: ComponentConfig<DialogProps> = {
  fields: {
    buttonText: { type: "text" },
    title: { type: "text" },
    description: { type: "textarea" },
    dialogClassName: { type: "text" },
    titleClassName: { type: "text" },
    descriptionClassName: { type: "text" },
    saveButtonClassName: { type: "text" },
    closeButtonClassName: { type: "text" },
    fields: {
      type: "array",
      getItemSummary: (item) => item.label,
      arrayFields: {
        id: { type: "text" },
        label: { type: "text" },
        placeholder: { type: "text" },
        type: { 
          type: "select",
          options: [
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Number", value: "number" }
          ]
        },
        labelClassName: { type: "text" },
        inputClassName: { type: "text" },
        autoComplete: { type: "text" }
      }
    }
  },

  defaultProps: {
    buttonText: "Open Dialog",
    title: "Edit Profile",
    description: "Make changes to your profile here. Click save when you're done.",
    dialogClassName: "fixed z-50 w-[95vw] max-w-md rounded-lg p-4 md:w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
    titleClassName: "text-sm font-medium text-gray-900 dark:text-gray-100",
    descriptionClassName: "mt-2 text-sm font-normal text-gray-700 dark:text-gray-400",
    saveButtonClassName: "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:text-gray-100 dark:hover:bg-purple-600 border border-transparent focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
    closeButtonClassName: "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
    fields: [{
      id: "firstName",
      label: "First Name",
      placeholder: "Enter first name",
      type: "text",
      labelClassName: "text-xs font-medium text-gray-700 dark:text-gray-400",
      inputClassName: "mt-1 block w-full rounded-md text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600 border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
      autoComplete: "given-name"
    }]
  },

  render: ({ 
    buttonText, 
    title, 
    description, 
    dialogClassName, 
    titleClassName, 
    descriptionClassName, 
    saveButtonClassName, 
    closeButtonClassName, 
    fields 
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Trigger asChild>
          <Button>{buttonText}</Button>
        </DialogPrimitive.Trigger>
        <DialogPrimitive.Portal forceMount>
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
              <DialogPrimitive.Overlay
                forceMount
                className="fixed inset-0 z-20 bg-black/50"
              />
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
              <DialogPrimitive.Content
                forceMount
                className={dialogClassName}
              >
                <DialogPrimitive.Title className={titleClassName}>
                  {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className={descriptionClassName}>
                  {description}
                </DialogPrimitive.Description>
                <form className="mt-2 space-y-2">
                  {fields.map((field) => (
                    <fieldset key={field.id}>
                      <label
                        htmlFor={field.id}
                        className={field.labelClassName}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        className={field.inputClassName}
                      />
                    </fieldset>
                  ))}
                </form>

                <div className="mt-4 flex justify-end">
                  <DialogPrimitive.Close className={saveButtonClassName}>
                    Save
                  </DialogPrimitive.Close>
                </div>

                <DialogPrimitive.Close className={closeButtonClassName}>
                  <Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
                </DialogPrimitive.Close>
              </DialogPrimitive.Content>
            </Transition.Child>
          </Transition.Root>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
};
