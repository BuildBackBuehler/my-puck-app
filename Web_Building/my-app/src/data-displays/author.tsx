// blocks/Author/index.tsx
import { ComponentConfig } from "@measured/puck";
import type { Author as AuthorType } from "../../lib/supabase";
import { getAuthors } from "../../utils/supabase/client";
import React from "react";

export type AuthorProps = {
  authorId?: string;
  showBio?: boolean;
  showRole?: boolean;
};

export const Author: ComponentConfig<AuthorProps> = {
  fields: {
    authorId: {
      type: "external",
      label: "Select Author",
      fetchList: async () => {
        const authors = await getAuthors();
        return authors;
      },
      getItemSummary: (item: AuthorType) => item.pen_name,
      mapProp: (item: AuthorType) => item.id,
    },
    showBio: {
      type: "radio",
      label: "Show Bio",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ]
    },
    showRole: {
      type: "radio",
      label: "Show Role",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ]
    }
  },
  defaultProps: {
    showBio: false,
    showRole: false
  },
  render: ({ authorId, showBio, showRole }) => {
    const [author, setAuthor] = React.useState<AuthorType | null>(null);

    React.useEffect(() => {
      if (authorId) {
        getAuthors().then(authors => {
          const foundAuthor = authors.find(a => a.id === authorId);
          setAuthor(foundAuthor || null);
        });
      }
    }, [authorId]);

    if (!authorId || !author) return null;

    return (
      <div className="flex items-center gap-4">
        <img 
          src={author.avatar_url} 
          alt={author.pen_name}
          className="w-16 h-16 rounded-full object-cover" 
        />
        <div>
          <h3 className="font-medium text-lg">{author.pen_name}</h3>
          {showBio && author.bio && (
            <p className="mt-2 text-sm text-adaptive-secondaryAlt">{author.bio}</p>
          )}
        </div>
      </div>
    );
  }
};