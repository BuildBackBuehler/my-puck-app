"use client";

import { ComponentConfig } from "@measured/puck"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross1Icon } from "@radix-ui/react-icons"
import { MessageCircle, Heart, Eye, CornerDownRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { Transition, TransitionChild } from "@headlessui/react"
import { Avatar, AvatarWrapper } from "../data-displays/avatar"
import { ArticleEngagement, Author } from "@/utils/types/database"
import { SocialShareButtons } from "../buttons/SocialShareButtons"
import { LikeButton } from "../buttons/like-button"
import { useArticle } from "@/utils/hooks/useArticles"
import { MarkdownRenderer } from "./markdown-renderer"
import { useAuthor } from "@/utils/hooks/useAuthor"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Link from "next/link"

// Update interface to include article engagement
export interface ArticleDialogProps {
    slug: string;
    showEngagement?: boolean;
    socialShareUrls?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      reddit?: string;
    };
    engagement?: ArticleEngagement;  // Add this
}

export const ArticleDialog: ComponentConfig<ArticleDialogProps> = {
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
      }
    },

    render: ({ slug, showEngagement = true, socialShareUrls = {}, engagement: initialEngagement }) => {
    const { article, loading, updateEngagement } = useArticle(slug);
    const [isLiked, setIsLiked] = useState(false);
    const [hasViewed, setHasViewed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentEngagement, setCurrentEngagement] = useState<ArticleEngagement>(() => 
      initialEngagement || article?.engagement || {
        article_id: '',
        views: 0,
        likes: 0,
        comments: 0
      }
    );

    // Sync with article engagement when it changes
    useEffect(() => {
      if (article?.engagement) {
        setCurrentEngagement(article.engagement);
      }
    }, [article?.engagement]);

    useEffect(() => {
      if (!article || !isOpen || hasViewed) return;
      const newEngagement = {
        ...currentEngagement,
        views: (currentEngagement.views || 0) + 1
      };
      setCurrentEngagement(newEngagement);
      updateEngagement(newEngagement);
      setHasViewed(true);
    }, [article, isOpen, hasViewed, currentEngagement]);

    const handleLike = useCallback(() => {
      if (!article) return;
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      const newEngagement = {
        ...currentEngagement,
        likes: currentEngagement.likes + (newLikedState ? 1 : -1)
      };
      setCurrentEngagement(newEngagement);
      updateEngagement(newEngagement);
    }, [article, isLiked, currentEngagement]);

    if (loading || !article) return null;

    return (

      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Trigger asChild>
          <button className="group inline-flex text-lg md:text-xl lg:text-3xl items-center gap-2 transition-colors">
          <CornerDownRight className="w-3 h-3 md:w-6 md:h-6 lg:w-10 lg:h-10 transition-transform group-hover:translate-x-2 text-adaptive-accent" />
          <span className="text-adaptive-secondary group-hover:text-adaptive-accent">
            See More
          </span>
          </button>
        </DialogPrimitive.Trigger>

        <DialogPrimitive.Portal forceMount>
          <Transition show={isOpen} as="div">
            <TransitionChild
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
            </TransitionChild>

            <TransitionChild
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPrimitive.Content 
                className="fixed z-50 w-full lg:w-[110vw] max-w-6xl rounded-sm lg:rounded-lg p-3 lg:p-6 top-[5%] left-1/2 -translate-x-1/2 bg-adaptive-primary max-h-[90vh] overflow-y-auto shadow-md scrollbar-hide"
              >
                <DialogPrimitive.Title asChild>
                  <VisuallyHidden>
                    {article.title || 'Article Details'}
                  </VisuallyHidden>
                </DialogPrimitive.Title>
                  <div className="py-1 md:py-4 relative">
                        <div className="flex justify-between items-center">
                          <h2 className="font-display text-adaptive-secondary text-2xl md:text-4xl lg:text-6xl text-left tracking-tight pl-4">{article.category}</h2>
                          <div className="text-right">
                            <time dateTime={article.date} className="text-adaptive-secondaryAlt px-4 block text-3xs md:text-sm lg:text-base mt-2">
                              {article.date}
                            </time>
                            
                            {showEngagement && (
                              <div className="text-adaptive-secondaryAlt flex items-center space-x-2 text-3xs md:text-xs pr-4">
                                <span className="inline-flex items-center gap-1">
                                  <Eye className="w-2 sm:w-3 lg:w-4"/> 
                                  {currentEngagement.views}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Heart className={`w-2 sm:w-3 lg:w-4 ${isLiked ? 'text-adaptive-accent fill-adaptive-accent' : 'text-transparent fill-adaptive-accent'}`}/> 
                                  {currentEngagement.likes}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <MessageCircle className="w-2 sm:w-3 lg:w-4"/> 
                                  {currentEngagement.comments}
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
                        <div className="mx-4 mt-2 lg:mt-4 relative aspect-[2/1] overflow-hidden rounded-lg">
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

                  <article className="space-y-1 md:space-y-2 lg:space-y-3">
                    <header className="space-y-1 md:space-y-2 lg:space-y-3">
                      <div className="flex flex-col items-center justify-center w-full">
                        <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold text-adaptive-accent text-center">
                          <Link href={`/articles/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h1>
                      </div>
                        <div className="text-adaptive-secondary flex gap-1 md:gap-2 lg:gap-4 text-sm md:text-base lg:text-lg justify-center items-center">
                          {article.author && (
                            <AvatarWrapper
                              variant="circle"
                              size="md"
                              showPenName={true}
                              author={article.author}
                            />
                          )}
                        </div>
                    </header>
                    <div className="mx-8 px-8 md:mx-12 md:px-12 lg:mx-16 self-center lg:px-16 h-px bg-adaptive-secondaryAlt" />
                    <main className="mt-1 px-8 prose-sm md:prose-lg text-adaptive-secondary max-w-none">
                      <MarkdownRenderer.render content={article.content} />
                    </main>

                    <footer className="mt-8">
                    <div className="mx-4 self-center px-4 h-px bg-adaptive-secondaryAlt" />
                      <div className="flex justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
                        <SocialShareButtons urls={socialShareUrls} title={article.title} />
                        <LikeButton 
                          isLiked={isLiked}
                          onClick={handleLike}
                        />
                      </div>
                    </footer>
                  </article>

                  <DialogPrimitive.Close className="absolute -top-2 lg:-top-6 right-1 p-2 rounded-full fill-adaptive-secondary text-adaptive-secondary hover:bg-adaptive-primaryAlt hover:text-adaptive-accent3 focus:text-adaptive-accent transition-colors">
                    <Cross1Icon className="h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6" />
                  </DialogPrimitive.Close>
                </div>
              </DialogPrimitive.Content>
            </TransitionChild>
          </Transition>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
};