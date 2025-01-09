import { ComponentConfig } from "@measured/puck"
import { DropZone } from "@measured/puck"

export interface FullWidthRowProps {
  backgroundColor: string
  padding: string
  maxWidth: string
  verticalPadding: string
  align: string
  children?: React.ReactNode
}

export const FullWidthRow: ComponentConfig<FullWidthRowProps> = {
  label: "Full Width Row",
  fields: {
    backgroundColor: {
      type: "select",
      options: [
        { label: "None", value: "transparent" },
        { label: "Primary", value: "bg-adaptive-primary" },
        { label: "Secondary", value: "bg-adaptive-secondary" }
      ]
    },
    padding: {
      type: "select",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "4" },
        { label: "Medium", value: "8" },
        { label: "Large", value: "16" }
      ]
    },
    maxWidth: {
      type: "select",
      options: [
        { label: "Default", value: "max-w-7xl" },
        { label: "Full", value: "max-w-full" }
      ]
    },
    verticalPadding: {
      type: "select",
      options: [
        { label: "None", value: "py-0" },
        { label: "Small", value: "py-4" },
        { label: "Medium", value: "py-8" },
        { label: "Large", value: "py-16" }
      ]
    },
    align: {
      type: "select",
      options: [
        { label: "Left", value: "items-start" },
        { label: "Center", value: "items-center" },
        { label: "Right", value: "items-end" }
      ]
    }
  },

  defaultProps: {
    backgroundColor: "transparent",
    padding: "4",
    maxWidth: "max-w-7xl",
    verticalPadding: "py-8",
    align: "items-center"
  },

  render: ({ backgroundColor, padding, maxWidth, verticalPadding, align }) => {
    return (
      <div className={`w-full ${backgroundColor} ${verticalPadding}`}>
        <div className={`mx-auto px-${padding} ${maxWidth}`}>
          <div className={`flex ${align}`}>
            <DropZone zone="content" className="w-full" />
          </div>
        </div>
      </div>
    )
  }
}