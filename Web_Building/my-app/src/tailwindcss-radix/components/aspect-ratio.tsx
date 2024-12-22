import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { clsx } from "clsx";
import React, { Fragment } from "react";
import { ComponentConfig } from "@/core/types";
import { Section } from "../../components/Section";
import { getClassNameFactory } from "@/core/lib";

const getClassName = getClassNameFactory("AspectRatio");

export interface AspectRatioProps {
  ratio: number;
  ratio_class: string;
  image: string;
  overlay: string;
  overlay_text: string;
  overlay_class: string;
  alt: string;
}

export const AspectRatio: ComponentConfig<AspectRatioProps> = {
  fields: {
    ratio: { type: "number" },
    ratio_class: { type: "tailwind" },
    image: { type: "text" },
    overlay: { type: "tailwind" },
    overlay_text: { type: "text" },
    overlay_text_class: { type: "tailwind" },
    alt: { type: "text" },
  },
  defaultProps: {
    ratio: 16 / 9,
    ratio_class: "h-full w-full overflow-hidden rounded-lg shadow-md",
    image: "https://images.unsplash.com/photo-1609825488888-3a766db05542?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
    overlay: "absolute inset-0 z-10 flex items-center justify-center",
    overlay_text: "Vancouver",
    overlay_text_class: "select-none bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-3xl font-black uppercase text-transparent duration-300 ease-in-out group-hover:opacity-0 sm:text-4xl",
    alt: "Vancouver by Matt Wang",
  },
  render: ({ ratio, ratio_class, image, overlay, overlay_text, overlay_text_class, alt }) => {
    return (
      <Section className={getClassName("AspectRatio")}>
        <div className={getClassName("ratio", ratio_class)}>{ratio}</div>
        <div className={overlay}>
          <div className={overlay_text_class}>{overlay_text}</div>
        </div>
        <div className={clsx("absolute inset-0 bg-gray-600 object-cover group-hover:bg-gray-500", "transition-colors duration-300 ease-in-out")}>
          <img src={image} alt={alt} className="h-full w-full mix-blend-overlay" />
        </div>
      </Section>
    );
  }
};
