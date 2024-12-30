import { ComponentConfig } from "@measured/puck";

export interface DividerProps {
  color?: string;
  margin?: string;
}

export const Divider: ComponentConfig<DividerProps> = {
  fields: {
    color: { type: "text" },
    margin: { type: "text" }
  },
  defaultProps: {
    color: "#333333",
    margin: "2rem"
  },
  render: ({ color, margin }) => (
    <hr 
      style={{
        border: 'none',
        borderTop: `1px solid ${color}`,
        margin: `${margin} 0`,
        width: '100%'
      }}
      aria-hidden="true"
    />
  )
};