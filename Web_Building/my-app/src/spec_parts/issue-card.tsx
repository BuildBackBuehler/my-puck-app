import { type ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
export interface IssueCardProps {
  title: string;
  isPinned?: boolean;
  issueNumber: string;
  link?: string;
}

export const IssueCard: ComponentConfig<IssueCardProps> = {
  fields: {
    title: { type: "text" },
    isPinned: { 
      type: "radio",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" }
      ]
    },
    issueNumber: { type: "text" },
    link: { type: "text" }
  },
  defaultProps: {
    title: "Your",
    isPinned: true,
    issueNumber: "01",
    link: "/issues/01"
  },
  render: ({ title, isPinned, issueNumber }) => (
    <div className="relative h-screen w-full flex flex-col">
      {/* <div className="absolute left-0 top-[11vh] h-[89vh] w-px bg-adaptive-secondaryAlt" /> */}
      <div className="absolute right-0  md:top-[10.25vh] h-[89.75vh] lg:top-[24vh] lg:h-4/5 w-px bg-adaptive-secondaryAlt" />
      
      <div className="flex-1 px-4 pt-4">
        <h2 className="mt-8 lg:mt-8 font-display text-4xl lg:text-9xl tracking-tight font-bold mb-2">{title}</h2>
        {isPinned && (
          <div className="flex items-center gap-0.5 md:gap-1 lg:gap-2">
            <span className="w-2 h-2 lg:w-4 lg:h-4 bg-adaptive-secondary rounded-full" />
            <span className="-mt-1 md:mt-0 lg:mt-0 text-2xs md:text-sm lg:text-2xl">Pinned Issue</span>
          </div>
        )}
      <div className="lg:mt-2 w-full h-px bg-adaptive-secondaryAlt" />
      <DropZone zone="Poll" />
      </div>
      <div className="flex-none pb-8 px-4">
        <span className="font-display text-3xl lg:text-7xl text-center bold">NO. {issueNumber}</span>
      </div>
    </div>
  )
};