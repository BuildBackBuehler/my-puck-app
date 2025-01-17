import { ComponentConfig, Fields, TextField } from "@measured/puck";
import Image from "next/image";
import { ImageFields, DefaultImageProps } from "./fields";
import { cn, isValidImageDomain, isValidURL } from "./utilities";
import dynamic from "next/dynamic";

const ImageAdminRender = dynamic(() => import("./adminRender"));

export type ImageCommonTypes = {
  src: string;
  alt: string;
  priority?: boolean;
  type?: "cover" | "contain" | "stretch";
  round?: string;
};

export type ImageDimensionTypes = ImageCommonTypes & {
  width: number;
  height: number;
};

export type ImageFillTypes = ImageCommonTypes & {
  sizesMode?: "pre-defined" | "manual";
  sizes?: string;
};

export type ImageType = ImageCommonTypes &
  ((ImageDimensionTypes & { fill: false }) | (ImageFillTypes & { fill: true }));

export default function ImageRender({
  image,
  sizes,
  className,
}: {
  image: Partial<ImageType>;
  sizes?: string;
  className?: string;
}) {
  const {
    src = "",
    alt = "",
    fill = false,
    priority = false,
    type = "cover",
    round,
  } = image;
  if (!src) return null;
  if (!isValidURL(src)) {
    return null;
  }
  if (!isValidImageDomain(src)) {
    return null;
  }

  const fillType = {
    cover: "object-cover",
    contain: "object-contain",
    stretch: "object-stretch",
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={image.fill === false ? image.width || 0 : undefined}
      height={image.fill === false ? image.height || 0 : undefined}
      sizes={sizes || (image.fill ? image.sizes : undefined)}
      className={cn(className, fillType[type], round)}
      priority={priority || undefined}
      fill={fill}
      placeholder={priority ? "empty" : "blur"}
      blurDataURL={
        priority
          ? undefined
          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNksAcAAEUAQRtOwGEAAAAASUVORK5CYII="
      }
    />
  );
}

export const ImageConfig: ComponentConfig<ImageType> = {
  label: "Image",
  resolveFields: (data) =>
    ImageFields({
      fill: data.props.fill,
      sizesMode: data.props.fill ? data.props.sizesMode : undefined,
    }),
  defaultProps: DefaultImageProps,
  render: ({ puck, id, ...props }) =>
    puck.isEditing ? (
      <ImageAdminRender image={props} />
    ) : (
      <ImageRender image={props} />
    ),
};
