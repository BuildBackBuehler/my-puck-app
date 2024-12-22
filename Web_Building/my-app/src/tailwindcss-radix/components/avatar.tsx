import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { clsx } from "clsx";
import React, { Fragment } from "react";
import { getRandomInitials } from "../utils/random";
import { ComponentConfig } from "@/core/types";
import { Section } from "../../components/Section";
import { getClassNameFactory } from "@/core/lib";

export interface AvatarProps {
  variant: string;
  isOnline?: boolean;
  renderInvalidUrls?: boolean;
  imageUrl: string;
  alt: string;
  avatar_class: string;
  image_class: string;
  online_class: string;
  online_span: string;
}

export const Avatar: ComponentConfig<AvatarProps> = {
  fields: {
    variant: {
      type: "select",
      options: [
        { value: "0", label: "Circle" },
        { value: "1", label: "Rounded" },
      ],
    },
    isOnline: { type: "boolean" },
    renderInvalidUrls: { type: "boolean" },
    imageUrl: { type: "text" },
    alt: { type: "text" },
    avatar_class: { type: "tailwind" },
    image_class: { type: "tailwind" },
    online_class: { type: "tailwind" },
    online_span: { type: "tailwind" },
  },
  defaultProps: {
    variant: "Circle",
    isOnline: false,
    renderInvalidUrls: false,
    imageUrl:"https://images.unsplash.com/photo-1573607217032-18299406d100?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80",
    alt: "Avatar",
    avatar_class: "relative inline-flex h-10 w-10",
    image_class: "h-full w-full object-cover",
    online_class: "absolute bottom-0 right-0 h-2 w-2",
    online_span: "block h-2.5 w-2.5 rounded-full bg-green-400",
  },
  render: ({ variant, isOnline, renderInvalidUrls, imageUrl, alt, avatar_class, image_class, online_class, online_span}) => {
    return 
    <Section className={getClassName("Avatar")}>
      <div className={avatar_class}>
        <AvatarPrimitive.Image
          src={imageUrl}
          alt={alt}
          className={clsx(
            image_class,
            {
              [variant.Circle]: "rounded-full",
              [variant.Rounded]: "rounded",
            }[variant]
          )}
        />
        {isOnline && (
          <div
            className={clsx(
              online_class,
              {
                [Variant.Circle]: "-translate-x-1/2 -translate-y-1/2",
                [Variant.Rounded]: "",
              }[variant]
            )}
          >
            <span className={online_span} />
          </div>
        )}
        <AvatarPrimitive.Fallback
          className={clsx(
            "flex h-full w-full items-center justify-center bg-white dark:bg-gray-800",
            {
              [Variant.Circle]: "rounded-full",
              [Variant.Rounded]: "rounded",
            }[variant]
          )}
          delayMs={600}
        >
          <span className="text-sm font-medium uppercase text-gray-700 dark:text-gray-400">
            {getRandomInitials()}
          </span>
        </AvatarPrimitive.Fallback>
      
const Avatar = ({
  variant,
  isOnline,
  renderInvalidUrls = false,
}: AvatarProps) => {
  const urls = renderInvalidUrls
    ? Array.from({ length: users.length }, () => "")
    : users;

  return (
    <Fragment>
      {urls.map((src) => (
        <AvatarPrimitive.Root
          key={`avatar-${src}`}
          className="relative inline-flex h-10 w-10"
        >
          <AvatarPrimitive.Image
            src={src}
            alt="Avatar"
            className={clsx(
              "h-full w-full object-cover",
              {
                [Variant.Circle]: "rounded-full",
                [Variant.Rounded]: "rounded",
              }[variant]
            )}
          />
          {isOnline && (
            <div
              className={clsx(
                "absolute bottom-0 right-0 h-2 w-2",
                {
                  [Variant.Circle]: "-translate-x-1/2 -translate-y-1/2",
                  [Variant.Rounded]: "",
                }[variant]
              )}
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
          )}
          <AvatarPrimitive.Fallback
            className={clsx(
              "flex h-full w-full items-center justify-center bg-white dark:bg-gray-800",
              {
                [Variant.Circle]: "rounded-full",
                [Variant.Rounded]: "rounded",
              }[variant]
            )}
            delayMs={600}
          >
            <span className="text-sm font-medium uppercase text-gray-700 dark:text-gray-400">
              {getRandomInitials()}
            </span>
          </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
      ))}
    </Fragment>
  );
};

Avatar.variant = Variant;
export { Avatar };
