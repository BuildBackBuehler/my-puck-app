import { ComponentConfig, DropZone } from "@measured/puck";
import { MessageCircle, Heart, Eye } from "lucide-react";
import Image from "next/image";
import { useArticle } from "@/utils/hooks/useArticles";
import { ArticleEngagement } from "@/utils/types/database";
import { useCallback, useEffect, useState } from "react";
import { SocialShareButtons } from "../buttons/SocialShareButtons"
import { LikeButton } from "../buttons/like-button"
import { MarkdownRenderer } from "./markdown-renderer";
import { Avatar, AvatarWrapper } from "../data-displays/avatar";
import { useAuthor } from "@/utils/hooks/useAuthor";
interface ArticleProps {
  slug: string;
  showEngagement?: boolean;
  socialShareUrls?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    reddit?: string;
  };
  authorId?: string;
}

export const Article: ComponentConfig<ArticleProps> = {
  fields: {
    slug: { type: "text" },
    showEngagement: {
      type: "radio",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ],
      defaultValue: true
    },
    socialShareUrls: {
      type: "object",
      objectFields: {
        facebook: { type: "text" },
        twitter: { type: "text" },
        linkedin: { type: "text" },
        reddit: { type: "text" }
      }
    },
    authorId: {
      type: "text"
    },
  },

  render: ({ slug, showEngagement = true, socialShareUrls = {}, authorId }) => {
    const { article, loading, updateEngagement } = useArticle(slug);
    const [isLiked, setIsLiked] = useState(false);
    const [hasViewed, setHasViewed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    // Move author hook after article check
    const { author, loading: authorLoading } = useAuthor(
      article?.author?.id ?? ''
    );

    useEffect(() => {
      if (!article || !isOpen || hasViewed) return;
      updateEngagement({ views: (article.engagement?.views || 0) + 1 });
      setHasViewed(true);
    }, [article]);

    const handleLike = useCallback(() => {
      if (!article) return;
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      updateEngagement({ 
        likes: article.engagement.likes + (newLikedState ? 1 : -1) 
      });
    }, [article, isLiked]);

    if (loading || !article) return null;

    return (
      <article className="w-full mx-auto max-h-[calc(100vh-80px)] overflow-y-auto text-adaptive-secondary relative">
        <div className="py-4 space-y-4 relative mt-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl md:text-4xl lg:text-6xl tracking-tight pl-4">
              {article.category}
            </h2>
            
            <div className="text-right">
              <time dateTime={article.date} className="text-adaptive-secondaryAlt px-4 block text-3xs md:text-sm lg:text-base mt-2">
                {article.date}
              </time>
              
              {showEngagement && (
                <div className="text-adaptive-secondaryAlt flex items-center space-x-2 text-3xs md:text-xs pr-4">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-2 sm:w-3 lg:w-4"/> 
                    {article.engagement?.views}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className={`w-2 sm:w-3 lg:w-4 ${isLiked ? 'text-adaptive-accent fill-adaptive-accent' : 'text-transparent fill-adaptive-accent'}`}/> 
                    {article.engagement?.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="w-2 sm:w-3 lg:w-4"/> 
                    {article.engagement?.comments}
                  </span>
                </div>
                            )}
              
              <span className="text-adaptive-secondaryAlt text-3xs md:text-xs lg:text-base font-serif px-4">
                {article.reading_time}
              </span>
            </div>
          </div>

          <div className="mx-4 self-center px-8 h-px bg-adaptive-secondaryAlt" />
          
          {article.featured_image && (
            <div className="mx-4 relative aspect-[2/1] overflow-hidden rounded-lg">
              <Image 
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <h1 className="font-display text-center text-xl md:text-3xl lg:text-6xl font-bold text-adaptive-accent">
            {article.title}
          </h1>

          {article.subtitle && (
            <blockquote className="mx-auto px-4 md:px-8 lg:px-16 max-w-4xl my-4 md:my-6 lg:my-8 font-serif italic text-sm md:text-lg lg:text-2xl text-center">
              <p>"{article.subtitle}"</p>
            </blockquote>
          )}
          
          <div className="flex items-center text-center justify-center text-base gap-1 md:gap-2">
          {article.author && (
            <AvatarWrapper
              variant="circle"
              size="md"
              showPenName={true}
              author={article.author}
            />
          )}
        </div>
        

          <div className="mx-16 self-center px-16 h-px bg-adaptive-secondaryAlt" />
          
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none mx-auto pr-2">
            <MarkdownRenderer.render content={article.content} />
          </div>
          
          <div className="mx-4 self-center px-8 h-px bg-adaptive-secondaryAlt" />

          <div className="flex justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
            <SocialShareButtons urls={socialShareUrls} title={article.title} />
            <LikeButton 
              isLiked={isLiked}
              onClick={handleLike}
            />
          </div>
        </div>
      </article>
    );
  }
};

function setHasViewed(arg0: boolean) {
  throw new Error("Function not implemented.");
}
