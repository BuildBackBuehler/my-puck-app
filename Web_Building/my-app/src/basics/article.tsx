"use client";

import { ComponentConfig } from "@measured/puck";
import { MessageCircle, Heart, Eye } from "lucide-react";
import Image from "next/image";
import { useArticle } from "@/utils/hooks/useArticles";
import { ArticleEngagement } from "@/utils/types/database";
import { useCallback, useEffect, useState } from "react";
import { SocialShareButtons } from "../buttons/SocialShareButtons"
import { LikeButton } from "../buttons/like-button"
import { MarkdownRenderer } from "./markdown-renderer";
import { AvatarWrapper } from "../data-displays/avatar";
import { LemmyComments } from "./lemmy-comments";
export interface ArticleProps {
  slug: string;
  showEngagement?: boolean;
  socialShareUrls?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    reddit?: string;
  };
  authorId?: string;
  lemmyPostId?: number;
  lemmyInstanceUrl?: string;
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
    lemmyPostId: {
      type: "number",
      label: "Lemmy Post ID (for comments)"
    },
    lemmyInstanceUrl: {
      type: "text",
      label: "Lemmy Instance URL",
      defaultValue: "https://lemmy.lotuswav.es"
    }
  },

  render: ({ slug, showEngagement = true, socialShareUrls = {}, lemmyInstanceUrl, lemmyPostId }) => {
    const { article, loading, updateEngagement } = useArticle(slug);
    
    // Initialize like state from localStorage and/or engagement data
    const [isLiked, setIsLiked] = useState(() => {
      if (typeof window !== 'undefined') {
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
        return !!likedArticles[slug];
      }
      return false;
    });

    // Add type for initial engagement state
    const [engagement, setEngagement] = useState<ArticleEngagement>({
      article_id: '',
      likes: 0,
      views: 0, 
      comments: 0
    });

    // Update localStorage when like state changes
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
        if (isLiked) {
          likedArticles[slug] = true;
        } else {
          delete likedArticles[slug];
        }
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      }
    }, [isLiked, slug]);

    // Add ArticleEngagement type to updateEngagement call
    const handleLike = useCallback(async () => {
      if (!article) return;
      
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);

      const newEngagement: ArticleEngagement = {
        article_id: article.id,
        likes: (article.engagement?.likes ?? 0) + (newLikedState ? 1 : -1),
        views: article.engagement?.views ?? 0,
        comments: article.engagement?.comments ?? 0
      };

      await updateEngagement(newEngagement);
    }, [article, isLiked, updateEngagement]);

    // Track article views using localStorage
    const [hasViewed, setHasViewed] = useState(() => {
      if (typeof window !== 'undefined') {
      const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '{}');
      return !!viewedArticles[slug];
      }
      return false;
    });

    // Update view count when article is first viewed
    useEffect(() => {
      if (!hasViewed && article) {
      setHasViewed(true);
      localStorage.setItem('viewedArticles', JSON.stringify({
        ...JSON.parse(localStorage.getItem('viewedArticles') || '{}'),
        [slug]: true
      }));
      
      const newEngagement: ArticleEngagement = {
        article_id: article.id,
        likes: article.engagement?.likes ?? 0,
        views: (article.engagement?.views ?? 0) + 1,
        comments: article.engagement?.comments ?? 0
      };
      
      updateEngagement(newEngagement);
      }
    }, [hasViewed, article, slug, updateEngagement]);

    if (loading || !article) {
      return null;
    }

    return (
      <article className="w-full max-h-[calc(100vh-80px)] overflow-y-auto text-adaptive-secondary relative">
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
                    {article.engagement?.views || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className={`w-2 sm:w-3 lg:w-4 ${isLiked ? 'text-adaptive-accent fill-adaptive-accent' : 'text-transparent fill-adaptive-accent'}`}/> 
                    {article.engagement?.likes || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="w-2 sm:w-3 lg:w-4"/> 
                    {article.engagement?.comments || 0}
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
          
          <div className="flex items-center text-center justify-center text-base gap-1 md:gap-2 lg:gap-4">
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
          
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none mx-auto px-4">
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
          {lemmyPostId && (
            <LemmyComments.render 
              postId={lemmyPostId} 
              instanceUrl={lemmyInstanceUrl || "https://lemmy.world"} 
            />
          )}
        </div>
      </article>
    );
  }
};


