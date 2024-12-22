import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import {React, ReactElement} from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { Section } from "../../components/Section";
//fix ^

const getClassName = getClassNameFactory("Accordion");

const icons = Object.keys(dynamicIconImports).reduce<
  Record<string, ReactElement>
>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);

  return {
    ...acc,
    [iconName]: <El />,
  };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export interface AccordionProps {
  items: {
  header: string;
  content: string;
  trigger: object;
  icon: string;
  header_class: string;
  content_class: string;
  trigger_class: string;
  icon_class: string;
  defaultExpanded: boolean;
  }[];
}


export const { Accordion }: ComponentConfig<AccordionProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item) => item.header || "Accordion Item",
      arrayfields: {
        header: { type: 'text'},
        content: { type: 'textarea'},
        trigger: { type: 'object'},
        icon: {
          type: "select",
          options: iconOptions,
        },
        header_class: { type: 'tailwind'},
        content_class: { type: 'tailwind'},
        trigger_class: { type: 'tailwind'},
        icon_class: { type: 'tailwind' },
        defaultExpanded: {
          type: 'radio',
          options: [
            { value: true, label: 'Expanded' },
            { value: false, label: 'Collapsed' }
          ]
        },
      },
    },
  },
  defaultProps:{ 
  items: [{
    header: 'Accordion Header',
    content: 'Accordion Body',
    icon: 'ChevronDownIcon',
    trigger: 'Accordion Trigger',
    header_class: 'rounded-lg focus-within:ring focus-within:ring-purple-500 focus-within:ring-opacity-75 focus:outline-none w-full',
    content_class: 'pt-1 w-full rounded-b-lg bg-white px-4 pb-3 dark:bg-gray-800',
    trigger_class:'"group","radix-state-open:rounded-t-lg radix-state-closed:rounded-lg","focus:outline-none","inline-flex w-full items-center justify-between bg-white px-4 py-2 text-left dark:bg-gray-800"',
    icon_class: 'ml-2 h-5 w-5 shrink-0 text-gray-700 ease-in-out dark:text-gray-400',
    defaultExpanded: false,
  }],
},
render: ({ items }) => {
  return (
      <Section className={getClassName("Accordion")}>
        <div className={getClassName("items")}> 
          {items.map(({ header, content, icon, trigger, header_class, content_class, icon_class,trigger_class, defaultExpanded }, i) => (
            <div key={i} className={getClassName("item")}>
              <div className= {getClassName({ [defaultExpanded]: defaultExpanded })}>
              <div className={getClassName("header", header_class)}>{header}</div>
              <div className={getClassName("content", content_class)}>{content}</div>
              <div className={getClassName("trigger", trigger_class)}>{trigger}</div>
              <div className={getClassName("icon", icon_class)}>{icon && icons[icon]}</div>
                    </div>
                  </div>
                ))}
              </div>
                  </Section>
                );
              },
            };