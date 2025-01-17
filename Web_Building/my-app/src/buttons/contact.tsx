"use client";

import { ComponentConfig } from "@measured/puck";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Transition, TransitionChild } from "@headlessui/react";
import { SquarePen } from "lucide-react";
import React, { Fragment, useState, useEffect } from "react";
import { useLayoutState } from "../../lib/layout-state";
import ReCAPTCHA from "react-google-recaptcha";

export interface ContactDialogProps {
  buttonText: string;
  dialogTitle: string;
  dialogDescription: string;
  alertTitle: string;
  alertDescription: string;
  toastTitle: string;
  toastDescription: string;
}

export const ContactDialog: ComponentConfig<ContactDialogProps> = {
  fields: {
    buttonText: { type: "text" },
    dialogTitle: { type: "text" },
    dialogDescription: { type: "text" },
    alertTitle: { type: "text" },
    alertDescription: { type: "text" },
    toastTitle: { type: "text" },
    toastDescription: { type: "text" }
  },

  defaultProps: {
    buttonText: "Contact Us",
    dialogTitle: "Contact Admin Team",
    dialogDescription: "Send us a message and we'll get back to you as soon as possible.",
    alertTitle: "Discard changes?",
    alertDescription: "If you leave now, your message will not be saved.",
    toastTitle: "Message Sent!",
    toastDescription: "Thank you for your message. We'll respond shortly."
  },

  render: ({
    buttonText,
    dialogTitle,
    dialogDescription,
    alertTitle,
    alertDescription,
    toastTitle,
    toastDescription
  }) => {
    const { isSidebarOpen } = useLayoutState();
    const [isOpen, setIsOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [currentToastMessage, setCurrentToastMessage] = useState(toastDescription);
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: ""
    });

    const [isVerified, setIsVerified] = useState(false);

    const verifyToken = async (token: string) => {
      try {
        const response = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });
        
        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('ReCAPTCHA verification failed:', error);
        return false;
      }
    };

    const handleVerify = async (token: string | null) => {
      if (!token) {
        setIsVerified(false);
        return;
      }

      const isValid = await verifyToken(token);
      setIsVerified(isValid);
    };

    const hasChanges = formData.name || formData.email || formData.message;

    useEffect(() => {
      const checkWidth = () => {
        setIsMobileOrTablet(window.innerWidth <= 1024);
      };

      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }, []);

    const handleClose = () => {
      if (hasChanges) {
        setShowAlert(true);
      } else {
        setIsOpen(false);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isVerified) {
        setCurrentToastMessage("Please verify that you are not a robot");
        setShowToast(true);
        return;
      }
      // Handle form submission logic here
      setIsOpen(false);
      setShowToast(true);
      setFormData({ name: "", email: "", message: "" });
    };

    return (
      <>
        <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <DialogPrimitive.Trigger className="inline-flex items-center gap-2 text-xl text-adaptive-secondary hover:text-adaptive-accent">
            {isSidebarOpen ? (
              isMobileOrTablet ? (
                <SquarePen size={16} />
              ) : (
                buttonText
              )
            ) : (
              <SquarePen size={16} />
            )}
          </DialogPrimitive.Trigger>

          <DialogPrimitive.Portal>
            <Transition show={isOpen} as="div">
              <TransitionChild
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
              </TransitionChild>

              <TransitionChild
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPrimitive.Content className="fixed z-50 w-[95vw] max-w-md rounded-lg p-4 lg:w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-adaptive-secondary">
                  <DialogPrimitive.Title className="text-lg font-medium text-adaptive-primary">
                    {dialogTitle}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-2 text-sm text-adaptive-primaryAlt">
                    {dialogDescription}
                  </DialogPrimitive.Description>

                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-adaptive-primaryAlt">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                        className="mt-1 block w-full rounded-md border border-adaptive-secondaryAlt placeholder:text-adaptive-secondaryAlt"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-adaptive-primaryAlt">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="mt-1 block w-full rounded-md border border-adaptive-secondaryAlt placeholder:text-adaptive-secondaryAlt"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-adaptive-primaryAlt">Message</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Type your message here"
                        className="mt-1 block w-full rounded-md border border-adaptive-secondaryAlt h-32 placeholder:text-adaptive-secondaryAlt"
                      />
                    </div>
                    <div className="mt-4 flex flex-col gap-4">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={handleVerify}
                        theme="dark"
                        className="transform scale-90 sm:scale-100"
                      />
                      <button
                        type="submit"
                        disabled={!isVerified}
                        className={`${
                          isVerified 
                            ? 'bg-adaptive-accent hover:bg-adaptive-accent/90' 
                            : 'bg-adaptive-secondary cursor-not-allowed'
                        } text-adaptive-primary px-4 py-2 rounded-md transition-colors`}
                      >
                        Submit
                      </button>
                    </div>
                  </form>

                  <DialogPrimitive.Close
                    onClick={handleClose}
                    className="absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1"
                  >
                    <Cross1Icon className="h-4 w-4 text-adaptive-primary hover:text-adaptive-accent" />
                  </DialogPrimitive.Close>
                </DialogPrimitive.Content>
              </TransitionChild>
            </Transition>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>

        <AlertDialogPrimitive.Root open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogPrimitive.Portal>
            <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <AlertDialogPrimitive.Content className="fixed z-50 w-[95vw] max-w-md rounded-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
              <AlertDialogPrimitive.Title className="text-lg font-medium">
                {alertTitle}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="mt-2 text-sm">
                {alertDescription}
              </AlertDialogPrimitive.Description>
              <div className="mt-4 flex justify-end space-x-2">
                <AlertDialogPrimitive.Cancel className="px-4 py-2 text-sm font-medium">
                  Cancel
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action
                  onClick={() => {
                    setIsOpen(false);
                    setShowAlert(false);
                    setFormData({ name: "", email: "", message: "" });
                  }}
                  className="px-4 py-2 text-sm font-medium text-adaptive-primary bg-adaptive-accent3 rounded-md"
                >
                  Discard
                </AlertDialogPrimitive.Action>
              </div>
            </AlertDialogPrimitive.Content>
          </AlertDialogPrimitive.Portal>
        </AlertDialogPrimitive.Root>

        <ToastPrimitive.Provider>
          <ToastPrimitive.Root
            open={showToast}
            onOpenChange={setShowToast}
            className="fixed bottom-4 right-4 w-auto max-w-md rounded-lg bg-adaptive-secondary text-adaptive-primary p-4 shadow-lg"
          >
            <ToastPrimitive.Title className="text-sm font-medium text-adaptive-accent">
              {toastTitle}
            </ToastPrimitive.Title>
            <ToastPrimitive.Description className="mt-1 text-sm text-adaptive-primary">
              {currentToastMessage}
            </ToastPrimitive.Description>
          </ToastPrimitive.Root>
          <ToastPrimitive.Viewport />
        </ToastPrimitive.Provider>
      </>
    );
  }
};
