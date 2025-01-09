import { Transition, TransitionChild, TransitionRootProps } from "@headlessui/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ComponentConfig } from "@measured/puck";
import { Cross1Icon } from "@radix-ui/react-icons";
import React, { Fragment, ReactElement, useEffect } from "react";
import { clsx } from "clsx";
import { SquarePen, Plus, Settings, User, Mail, Edit, ArrowRight } from "lucide-react"
import { Button as ButtonConfig } from "./button";
import { useLayoutState } from '../../lib/layout-state'
const Button = ButtonConfig.render;
export interface DialogProps {
  buttonText: string;
  icon?: string;
  isSidebarOpen?: boolean;
  title: string;
  description: string;
  dialogClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  saveButtonClassName: string;
  closeButtonClassName: string;
  fields?: Array<{
    id: string;
    label: string;
    placeholder: string;
    type: string;
    labelClassName: string;
    inputClassName: string;
    autoComplete?: string;
  }>;
  children?: ReactElement;
}

export const Dialog: ComponentConfig<DialogProps> = {
  fields: {
    buttonText: { type: "text" },
    icon: {
      type: "select",
      options: [
        { label: "None", value: "" },
        { label: "Plus", value: "plus" },
        { label: "Settings", value: "settings" },
        { label: "User", value: "user" },
        { label: "Mail", value: "mail" },
        { label: "Edit", value: "edit" },
        { label: "Arrow Right", value: "arrowRight" },
        { label: "Message", value: "SquarePen" }
      ]
    },
    title: { type: "text" },
    description: { type: "textarea" },
    dialogClassName: { type: "text" },
    titleClassName: { type: "text" },
    descriptionClassName: { type: "text" },
    saveButtonClassName: { type: "text" },
    closeButtonClassName: { type: "text" },
    isSidebarOpen: { type: "radio",
      options: [ 
        { label: "Open", value: "true" },
        { label: "Closed", value: "false" }
      ]
    },
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
    icon: "Message",
    title: "Edit Profile",
    description: "Make changes to your profile here. Click save when you're done.",
    dialogClassName: "fixed z-50 w-[95vw] max-w-md rounded-lg p-4 lg:w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-adaptive-secondary focus:outline-none focus-visible:ring focus-visible:ring-adaptive-accent3 focus-visible:ring-opacity-75 focus:drop-shadow-glowY",
    titleClassName: "text-sm font-medium text-adaptive-primary",
    descriptionClassName: "mt-2 text-sm font-normal text-adaptive-primaryAlt",
    saveButtonClassName: "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium bg-adaptive-backgroundLight dark:bg-adaptive-backgroundLight text-adaptive-primary hover:bg-adaptive-backgroundDark dark:hover:bg-adaptive-backgroundLight border border-transparent focus:outline-none focus-visible:ring focus-visible:ring-adaptive-accent3 focus-visible:ring-opacity-75 focus:drop-shadow-glowY",
    closeButtonClassName: "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring focus-visible:ring-adaptive-accent3 focus-visible:ring-opacity-75 focus:drop-shadow-glowY",
    isSidebarOpen: true,
    fields: [{
      id: "firstName",
      label: "First Name",
      placeholder: "Enter first name",
      type: "text",
      labelClassName: "text-xs font-medium text-adaptive-primaryAlt",
      inputClassName: "mt-1 block w-full rounded-md text-sm text-adaptive-secondaryAlt placeholder:text-adaptive-primaryAlt border border-adaptive-secondaryAlt focus-visible:ring focus-visible:ring-adaptive-accent3 focus-visible:ring-opacity-75 focus:drop-shadow-glowY",
      autoComplete: "given-name"
    }]
  },

  render: ({ 
    buttonText, 
    icon,
    title, 
    dialogClassName,
    description,
    descriptionClassName,
    titleClassName,
    saveButtonClassName,
    closeButtonClassName,
    fields = [],
    children,
    ...props 
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { isSidebarOpen } = useLayoutState()
    const [isMobileOrTablet, setIsMobileOrTablet] = React.useState(false);

    useEffect(() => {
      const checkWidth = () => {
        const isMobileTablet = window.innerWidth <= 768; // md breakpoint
        setIsMobileOrTablet(isMobileTablet);
      };

      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }, []);

    
    const icons = {
      plus: <Plus size={16} />,
      settings: <Settings size={16} />,
      user: <User size={16} />,
      mail: <Mail size={16} />,
      edit: <Edit size={16} />,
      arrowRight: <ArrowRight size={16} />,
      SquarePen: <SquarePen size={16} />
    }

    return (
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Trigger asChild>
          <div className="flex items-center gap-2 text-xl hover:text-adaptive-accent">
            {isSidebarOpen ? (
              isMobileOrTablet ? (
                icon && icons[icon]
              ) : (
                <Button text={buttonText} />
              )
            ) : (
              icon && icons[icon]
            )}
          </div>
        </DialogPrimitive.Trigger>
        <DialogPrimitive.Portal forceMount>
          <Transition show={isOpen} as="div">
            <TransitionChild
              as="div"
              className="fixed inset-0 z-40"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogPrimitive.Overlay
                forceMount
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              />
            </TransitionChild>
            <TransitionChild
              as="div"
              className="fixed inset-0 z-50 flex items-center justify-center "
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
                {children ? children : (
                  <>
                    <DialogPrimitive.Title className={titleClassName}>
                      {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className={descriptionClassName}>
                      {description}
                    </DialogPrimitive.Description>
                    {fields.length > 0 && (
                      <form className="mt-2 space-y-2">
                        {fields.map((field) => (
                          <fieldset key={field.id}>
                            <label
                              htmlFor={field.id}
                              className={field.labelClassName}
                            >
                              {field.label}
                            </label>
                            {field.type === 'text' ? (
                              <textarea
                                id={field.id}
                                placeholder={field.placeholder}
                                className={`${field.inputClassName} h-24 resize-none whitespace-normal align-top`}
                              />
                            ) : (
                              <input
                                id={field.id}
                                type={field.type}
                                placeholder={field.placeholder}
                                autoComplete={field.autoComplete}
                                className={`${field.inputClassName} h-8`}
                              />
                            )}
                          </fieldset>
                        ))}
                      </form>
                    )}
                  </>
                )}
                <div className="mt-4 flex justify-end">
                  <DialogPrimitive.Close className={saveButtonClassName}>
                    Submit
                  </DialogPrimitive.Close>
                </div>

                <DialogPrimitive.Close className={closeButtonClassName}>
                  <Cross1Icon className="h-4 w-4 text-adaptive-primary hover:text-adaptive-primaryAlt" />
                </DialogPrimitive.Close>
              </DialogPrimitive.Content>
            </TransitionChild>
          </Transition>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
};
