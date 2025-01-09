import { ComponentConfig } from "@measured/puck"
import { DropZone } from "@measured/puck"
import { generateId } from "../../lib/generate-id"
import { useLayoutState } from '../../lib/layout-state'

export interface TwoColumnsProps {
  columns: {
    id?: string
    width: number
  }[]
}

export const TwoColumns: ComponentConfig<TwoColumnsProps> = {
  resolveData: ({ props }, { lastData }) => {
    if (lastData?.props.columns.length === props.columns.length) return { props }

    return {
      props: {
        ...props,
        columns: props.columns.map(column => ({
          ...column,
          id: column.id ?? generateId()
        }))
      }
    }
  },

  defaultProps: {
    columns: [
      { width: 0, id: generateId() },
      { width: 100, id: generateId() }
    ]
  },

  render: ({ columns }) => {
    const { isSidebarOpen } = useLayoutState()
    const sidebarWidth = isSidebarOpen ? 256 : 64

    return (
      <div className="flex h-screen w-full overflow-hidden" style={{ paddingLeft: sidebarWidth }}>
        <div className="flex-1 transition-all duration-300">
          <DropZone zone={`column-${columns[1].id}`} />
        </div>
      </div>
    )
  }
}