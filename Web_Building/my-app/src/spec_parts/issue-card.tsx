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
    <div className="absolute h-screen w-auto">
      <div className="absolute left-0 top-[11vh] h-[90vh] w-px bg-black-light" />
      {/* <a href={link} className="relative block bg-white text-black pr-4 py-8"> */}
        <div className="flex flex-col h-screen px-4">
          <div>
            <h2 className="mt-8 font-display text-8xl tracking-tight font-bold mb-4">{title}</h2>
            {isPinned && (
              <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-4 bg-black rounded-full" />
                <span className="text-xl">Pinned Issue</span>
              </div>
              
            )}
            <div className="w-full h-px bg-black-light" />
            <div className="absolute right-0 top-[20vh] h-4/5 pt-8 w-px bg-black-light" />
          </div>
          <div className="flex justify-center items-end flex-grow">
            <span className="font-display text-7xl">NO. {issueNumber}</span>
          </div>
        </div>
      {/* </a> */}
    </div>
  )
};