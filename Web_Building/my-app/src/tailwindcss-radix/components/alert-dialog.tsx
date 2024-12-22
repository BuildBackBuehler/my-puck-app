import { Transition } from "@headlessui/react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { clsx } from "clsx";
import React, { Fragment, useState } from "react";
import Button from "./shared/button";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { Section } from "../../components/Section";

const getClassName = getClassNameFactory("Button");

export interface AlertDialogProps {
  buttons: {
    label: string;
    href: string;
    variant?: "menu" | "primary" | "secondary";
    more?: { text: string }[];
  }[];
  title: string;
  description: string;
  title_classname: string;
  description_classname: string;
  overlay: string;
  content_window: string;
}

export const AlertDialog: ComponentConfig<AlertDialogProps> = {
  fields: {
    buttons: {
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { value: "menu", label: "Menu" },
            { value: "primary", label: "Primary" },
            { value: "secondary", label: "Secondary" },
          ],
        },
        more: {
          type: "array",
          arrayFields: {
            text: { type: "text" },
          },
        },
      },
    },
    title: { type: "text" },
    description: { type: "textarea" },
    title_classname: { type: "tailwind" },
    description_classname: { type: "tailwind" },
    overlay: { type: "tailwind" },
    content_window: { type: "tailwind" },
  },
  defaultProps: {
    buttons: [
      {
        label: "Button",
        href: "https://example.com",
        variant: "primary",
        more: [{ text: "More" }],
      },
    ],
    title: "Are you absolutely sure?",
    description: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
    title_classname: "text-sm font-medium text-gray-900 dark:text-gray-100",
    description_classname: "mt-2 text-sm font-normal text-gray-700 dark:text-gray-400",
    overlay: "fixed inset-0 z-20 bg-black/50",
    content_window:'"fixed z-50", "w-[95vw] max-w-md rounded-lg p-4 md:w-full", "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", "bg-white dark:bg-gray-800","focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"' 
    },
  render: ({ actions, buttons, title, description, title_classname, description_classname, overlay, content_window }) => {
    return (
      <Section className={getClassName("AlertDialog")}>
         <div className={getClassName("actions")}>
          {buttons.map((button, i) => (
            <Button
              key={i}
              href={button.href}
              variant={button.variant}
              size="large"
              tabIndex={puck.isEditing ? -1 : undefined}
            >
              {button.label}
            </Button>
          ))}
        </div>
        <div className={getClassName("title")}>{title}</div>
        <div className={getClassName("description")}>{description}</div>
        <div className={getClassName("overlay")}></div>
        <div className={getClassName("content_window")}></div>
      </Section>
    );
  }
};