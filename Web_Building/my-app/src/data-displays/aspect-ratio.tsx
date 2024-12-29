import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { ComponentConfig } from "@measured/puck";
import { clsx } from "clsx";
import React from "react";
import Image from "next/image";

export interface AspectRatioProps {
  ratio: number;
  image: {
    src: string;
    alt: string;
  };
  overlay: {
    text: string;
    className: string;
  };
  containerClassName: string;
  imageWrapperClassName: string;
  imageClassName: string;
}

export const AspectRatio: ComponentConfig<AspectRatioProps> = {
  fields: {
    ratio: {
      type: "select",
      options: [
        { label: "16:9", value: 16/9 },
        { label: "4:3", value: 4/3 },
        { label: "1:1", value: 1 },
        { label: "9:16", value: 9/16 }
      ]
    },
    image: {
      type: "object",
      objectFields: {
        src: { type: "text" },
        alt: { type: "text" }
      }
    },
    overlay: {
      type: "object",
      objectFields: {
        text: { type: "text" },
        className: { type: "text" }
      }
    },
    containerClassName: { type: "text" },
    imageWrapperClassName: { type: "text" },
    imageClassName: { type: "text" }
  },

  defaultProps: {
    ratio: 16/9,
    image: {
      src: "https://demo-source.imgix.net/puppy.jpg",
      alt: "Hero Image"
    },
    overlay: {
      text: "Overlay Text",
      className: "select-none bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-3xl font-black uppercase text-transparent duration-300 ease-in-out group-hover:opacity-0 sm:text-4xl"
    },
    containerClassName: "group relative h-full w-full overflow-hidden rounded-lg shadow-md",
    imageWrapperClassName: "absolute inset-0 bg-gray-600 object-cover group-hover:bg-gray-500 transition-colors duration-300 ease-in-out",
    imageClassName: "h-full w-full mix-blend-overlay"
  },

  render: ({ ratio, image, overlay, containerClassName, imageWrapperClassName, imageClassName }) => (
    <AspectRatioPrimitive.Root ratio={ratio} className={containerClassName}>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h3 className={overlay.className}>
          {overlay.text}
        </h3>
      <div className={imageWrapperClassName}>
        <Image
          src={image.src}
          alt={image.alt}
          className={imageClassName}
          fill
          sizes="100vw"
        />
      </div>
      </div>
    </AspectRatioPrimitive.Root>
  )
};
