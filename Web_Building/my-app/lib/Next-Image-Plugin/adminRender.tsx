"use client";

import { useEffect, useRef } from "react";
import { ImageType } from "./config";
import { isValidImageDomain, isValidURL } from "./utilities";
import Image from "next/image";

export default function ImageAdminRender({ image }: { image: ImageType }) {
  const { src, alt, fill, type } = image;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fill && src && isValidURL(src) && isValidImageDomain(src)) {
      if (ref.current) {
        let dropZoneContent: HTMLDivElement | null = ref.current.closest(
          "[class^=_DropZone-content_]"
        );
        if (dropZoneContent) {
          const aspectElement = dropZoneContent.parentElement
            ?.parentElement as HTMLDivElement;

          ref.current.style.minHeight = 128 + "px";
          if (aspectElement?.classList.contains("aspect-container")) {
            dropZoneContent = aspectElement;
          }
          dropZoneContent.style.backgroundImage = `url(${src})`;
          dropZoneContent.style.backgroundRepeat = "no-repeat";
          dropZoneContent.style.backgroundPosition = "center center";

          if (type)
            dropZoneContent.style.backgroundSize = {
              contain: "contain",
              cover: "cover",
              stretch: "100% 100%",
            }[type];
        }
      }
    }

    return () => {
      if (ref.current) {
        let dropZoneContent: HTMLDivElement | null = ref.current.closest(
          "[class^=_DropZone-content_]"
        );
        if (dropZoneContent) {
          const aspectElement = dropZoneContent.parentElement
            ?.parentElement as HTMLDivElement;

          ref.current.style.minHeight = "";
          if (aspectElement?.classList.contains("aspect-container")) {
            dropZoneContent = aspectElement;
          }

          dropZoneContent.style.backgroundImage = "";
          dropZoneContent.style.backgroundRepeat = "";
          dropZoneContent.style.backgroundPosition = "";
          dropZoneContent.style.backgroundSize = "";
        }
      }
    };
  }, [src, fill, type]);

  if (!src) return null;
  if (!isValidURL(src)) {
    return null;
  }
  if (!isValidImageDomain(src)) {
    return null;
  }

  return (
    <>
      <div ref={ref}></div>
      {image.fill ? (
        ""
      ) : (
        <Image
          unoptimized={true}
          src={src}
          alt={alt}
          style={{
            objectFit: type === "stretch" ? "fill" : type,
            width: fill ? "100%" : ('width' in image ? image.width : undefined),
            height: fill ? "100%" : ('height' in image ? image.height : undefined),
            position: fill ? "absolute" : undefined,
            inset: fill ? 0 : undefined,
          }}
        />
      )}
    </>
  );
}
