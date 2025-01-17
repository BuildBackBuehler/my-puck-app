import { Fields, TextField } from "@measured/puck";
import {
  ImageCommonTypes,
  ImageDimensionTypes,
  ImageFillTypes,
  ImageType,
} from "./config";
import { isValidImageDomain, isValidURL } from "./utilities";

export const DefaultCommonProps: ImageCommonTypes = {
  src: "",
  alt: "",
};

export const DefaultDimensionProps: ImageDimensionTypes = {
  ...DefaultCommonProps,
  width: 400,
  height: 400,
};

export const DefaultFillProps: ImageFillTypes = {
  ...DefaultCommonProps,
  sizesMode: "pre-defined",
  sizes: "100vw",
};

export const DefaultImageProps: ImageType = {
  fill: false,
  ...DefaultCommonProps,
  ...DefaultDimensionProps,
  ...DefaultFillProps,
};

export const commonImageFields: Fields<ImageCommonTypes> = {
  src: {
    type: "text",
    label: "Image URL",
    customProps: {
      vaidations: (value: string) =>
        isValidURL(value) && isValidImageDomain(value),
    },
  } as TextField,
  alt: {
    type: "text",
    label: "Alt Text",
  },
  priority: {
    type: "radio",
    label: "First Screen Priority",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
  },
  type: {
    type: "radio",
    options: [
      {
        label: "Cover",
        value: "cover",
      },
      {
        label: "Contain",
        value: "contain",
      },
      {
        label: "Stretch",
        value: "stretch",
      },
    ],
    label: "Type",
  },

  round: {
    type: "radio",
    label: "Round Cornders",
    options: [
      {
        label: "None",
        value: "",
      },
      {
        label: "Sm",
        value: "rounded-sm",
      },
      {
        label: "Base",
        value: "rounded",
      },
      {
        label: "Lg",
        value: "rounded-lg",
      },
      {
        label: "Md",
        value: "rounded-md",
      },
      {
        label: "Xl",
        value: "rounded-xl",
      },
      {
        label: "2Xl",
        value: "rounded-2xl",
      },
      {
        label: "3Xl",
        value: "rounded-3xl",
      },
      {
        label: "4Xl",
        value: "rounded-4xl",
      },
      {
        label: "Full",
        value: "rounded-full",
      },
    ],
  },
};

export const ImageFields = (
  props:
    | Partial<{
        fill: boolean;
        sizesMode: "pre-defined" | "manual";
      }>
    | undefined
): Fields<ImageType> => {
  if (props?.fill === true) {
    return {
      fill: {
        type: "radio",
        label: "Fill",
        options: [
          {
            label: "Yes",
            value: true,
          },
          {
            label: "No",
            value: false,
          },
        ],
      },
      ...ImageFillFields({
        preDefinedSizes: props?.sizesMode === "pre-defined",
      }),
    } as Fields<ImageType>;
  } else {
    return {
      fill: {
        type: "radio",
        label: "Fill",
        options: [
          {
            label: "Yes",
            value: true,
          },
          {
            label: "No",
            value: false,
          },
        ],
      },
      ...ImageDimensionFields,
    } as Fields<ImageType>;
  }
};

export const ImageDimensionFields: Fields<ImageDimensionTypes> = {
  ...commonImageFields,
  width: {
    type: "number",
    label: "Width",
  },
  height: {
    type: "number",
    label: "Height",
  },
};

export const ImageFillFields = (
  props: { preDefinedSizes: boolean | undefined } | undefined
): Fields<ImageFillTypes> => ({
  ...commonImageFields,
  sizesMode: {
    type: "radio",
    label: "Sizes Mode",
    options: [
      {
        label: "Pre-defined",
        value: "pre-defined",
      },
      {
        label: "Manual",
        value: "manual",
      },
    ],
  },
  sizes: props?.preDefinedSizes
    ? {
        type: "select",
        label: "Render Size",
        options: [
          {
            label: "Full Screen",
            value: "100vw",
          },
          {
            label: "Half Screen",
            value: "50vw",
          },
          {
            label: "Full Screen till 640px, Half Screen Afterwards",
            value: "(min-width: 640px) 50vw, 100vw",
          },
          {
            label: "Full - 640px, Half - 1024px, Third - Afterwards",
            value: "(min-width: 1024) 33vw, (min-width: 640px) 50vw, 100vw",
          },
        ],
      }
    : {
        type: "text",
        label: "Render Size",
      },
});
