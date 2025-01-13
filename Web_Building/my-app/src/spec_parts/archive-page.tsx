import { ComponentConfig } from "@measured/puck";
import { supabase } from "@/utils/supabase/client";
import { FilterBar } from "./filter-bar";
import { ArchiveGrid } from "./archive-grid";

export const ArchivePage: ComponentConfig = {
  resolveData: async () => {
    const { data: articles } = await supabase
      .from('articles')
      .select(`
        *,
        author:author_id(
          id,
          pen_name,
          avatar_url
        ),
        engagement:article_engagement(*)
      `)
      .order('date', { ascending: false });

    return {
      props: {
        articles: articles || []
      }
    };
  },

  render: ({ articles = [] }) => (
    <div className="min-h-screen mt-[6vh]">
      <FilterBar.render />
      <ArchiveGrid.render 
        articles={articles}
        batchSize={9}
        gridGap="2rem"
      />
    </div>
  )
};