import { ComponentConfig } from "@measured/puck";

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
    isPinned: "true",
    issueNumber: "01",
    link: "/issues/01"
  },
  render: ({ title, isPinned, issueNumber, link }) => (
    <div className="absolute w-full h-screen">
      <div className="absolute left-0 top-0 h-full w-px bg-neutral-800" />
      <a href={link} className="relative block bg-neutral-900 text-white pr-4 py-8">
        <div className="flex flex-col h-screen">
          <div>
            <h2 className="font-display text-8xl tracking-tight font-bold mb-4">{title}</h2>
            {isPinned && (
              <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-4 bg-white rounded-full" />
                <span className="text-xl">Pinned Issue</span>
              </div>
            )}
            <div className="w-full h-px bg-neutral-800" />
          </div>
          <div className="mt-96 flex justify-center items-center">
            <span className="font-display text-5xl tracking-wide">NO. {issueNumber}</span>
          </div>
        </div>
      </a>
    </div>
  )
};