import { ComponentConfig } from "@measured/puck"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross1Icon } from "@radix-ui/react-icons"
import { MessageCircle, Heart, Eye, CornerDownRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Transition, TransitionChild } from "@headlessui/react"
import { FacebookShare, RedditShare, TwitterShare, LinkedinShare } from 'react-share-kit'
import { Avatar } from "../data-displays/avatar"

interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ArticleDialogProps {
  article: {
    mainTitle: string
    title: string
    content: string
    imageUrl: string
    imageAlt: string
    author: string
    readTime: string
    date: string
    engagement?: {
      views: number
      likes: number
      comments: number
    }
    shareLinks?: {
      facebook?: string
      linkedin?: string
      reddit?: string
      twitter?: string
    }
    onLike?: (liked: boolean) => void;
    isLiked?: boolean;    
    onEngagementUpdate?: (engagement: { views: number; likes: number; comments: number }) => void;
  }
}

export const ArticleDialog: ComponentConfig<ArticleDialogProps> = {
  fields: {
    article: {
      type: "object",
      objectFields: {
        mainTitle: { type: "text" },
        title: { type: "text" },
        content: { type: "textarea" },
        imageUrl: { type: "text" },
        imageAlt: { type: "text" },
        author: { type: "text" },
        date: { type: "text" },
        readTime: { type: "text" },
        engagement: {
          type: "object",
          objectFields: {
            views: { type: "number" },
            likes: { type: "number" },
            comments: { type: "number" }
          }
        },
        isLiked: {
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ],
          defaultValue: false
        },
        shareLinks: {
          type: "object",
          objectFields: {
            facebook: { type: "text" },
            linkedin: { type: "text" },
            reddit: { type: "text" },
            twitter: { type: "text" }
          }
        }
      }
    }
  },

  defaultProps: {
    article: {
      mainTitle: "Awareness",
      title: "Article Title",
      content: "Article content goes here...",
      imageUrl: "/placeholder.jpg",
      imageAlt: "Article Image",
      author: "John Doe",
      readTime: "5 min read",
      date: new Date().toLocaleDateString(),
      engagement: {
        views: 0,
        likes: 0,
        comments: 0
      },
      isLiked: false,
      shareLinks: {
        facebook: "",
        linkedin: "",
        reddit: "",
        twitter: ""
      }
    }
  },


  render: ({ article, ...props }) => {
    const shareLinks = article.shareLinks || {};
    const [isOpen, setIsOpen] = useState(false)
    const [isLiked, setIsLiked] = useState(article.isLiked)
    const [currentEngagement, setCurrentEngagement] = useState(article.engagement || { views: 0, likes: 0, comments: 0 })
    const [hasViewed, setHasViewed] = useState(false);

    useEffect(() => {
      if (!hasViewed) {
        const newViews = (currentEngagement?.views || 0) + 1;
        setCurrentEngagement(prev => ({
          ...prev,
          views: newViews
        }));
        article.onEngagementUpdate?.({
          ...currentEngagement,
          views: newViews
        });
        setHasViewed(true);
      }
    }, [hasViewed, currentEngagement, article]);

    const handleLike = () => {
      const newLikedState = !isLiked;
      const newLikes = currentEngagement.likes + (newLikedState ? 1 : -1);
      
      setIsLiked(newLikedState);
      setCurrentEngagement(prev => ({
        ...prev,
        likes: newLikes
      }));
      
      article.onEngagementUpdate?.({
        ...currentEngagement,
        likes: newLikes
      });
    };

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
                  <div className="py-1 md:py-4 relative">
                        <div className="flex justify-between items-center">
                          <h2 className="font-display text-adaptive-secondary text-2xl md:text-4xl lg:text-6xl text-left tracking-tight pl-4">{article.mainTitle}</h2>
                          <div className="text-right">
                            <time dateTime={article.date} className="text-adaptive-secondaryAlt px-4 block text-3xs md:text-xs lg:text-base mt-2">
                              {article.date}
                            </time>
                              <div className="mt-1 -mb-1 md:mt-0 md:mb-0 text-adaptive-secondaryAlt flex items-center text-3xs mx-4 md:mx-0 space-x-0.5 md:space-x-1 lg:space-x-2 md:text-xs">
                                <span className="inline-flex items-center gap-0.5 md:gap-1"><Eye size={12}/> {currentEngagement?.views ?? 0}</span>
                                <span className="inline-flex items-center gap-0.5 md:gap-1"><Heart size={12} className="text-transparent fill-adaptive-accent dark:fill-adaptive-accent3"/> {currentEngagement?.likes ?? 0}</span>
                                <span className="inline-flex items-center gap-0.5 md:gap-1"><MessageCircle size={12}/> {currentEngagement?.comments ?? 0}</span>
                              </div>
                            <span className="text-adaptive-secondary text-3xs md:text-xs lg:text-base font-serif px-4">{article.readTime}</span>
                          </div>
                        </div>
                        </div>
                    <div className="mx-4 self-center px-4 h-px bg-adaptive-secondaryAlt" />
                <div className="space-y-2 md:space-y-8">
                  {article.imageUrl && (
                    <div className="relative aspect-video w-full rounded-sm lg:rounded-lg overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1440px) 100vw, 1440px"
                        priority
                      />
                    </div>
                  )}

                  <article className="space-y-2 lg:space-y-4">
                    <header className="space-y-2 lg:space-y-4">
                      <div className="flex flex-col items-center justify-center w-full">
                        <h1 className="font-display text-3xl md:text-5xl font-bold text-adaptive-accent text-center">
                          {article.title}
                        </h1>
                      </div>
                        <div className="text-adaptive-secondary flex gap-1 md:gap-2 lg:gap-4 text-sm md:text-base lg:text-lg justify-center items-center">
                          <Avatar src={article.author.avatarUrl} alt={article.author.name} size="sm" />
                          <span>By {article.author}</span>
                      </div>
                    </header>
                    <div className="mx-8 px-8 md:mx-12 md:px-12 lg:mx-16 self-center lg:px-16 h-px bg-adaptive-secondaryAlt" />
                    <main className="px-4 prose-sm md:prose-lg text-adaptive-secondary max-w-none">
                      {article.content}
                    </main>

                    <footer className="mt-8">
                    <div className="mx-4 self-center px-4 h-px bg-adaptive-secondaryAlt" />
                      <div className="flex justify-between items-center gap-1 px-8 pt-2 md:pt-4">
                        <div className="flex gap-1">
                          <FacebookShare url={shareLinks.facebook || ''} quote={article.title} round={true} size={30} blankTarget={true} />
                          <LinkedinShare url={shareLinks.linkedin || ''} round={true} size={30} blankTarget={true} />
                          <RedditShare url={shareLinks.reddit || ''} title={article.title} round={true} size={30} blankTarget={true} />
                          <TwitterShare url={shareLinks.twitter || ''} title={article.title} round={true} size={30} blankTarget={true} />
                        </div>
                        
                        <button 
                          onClick={handleLike}
                          className={`p-2 rounded-full transition-all duration-300 ${
                            isLiked ? '' : ''
                          }`}
                        >
                          <Heart 
                            size={30}
                            className={`transition-all duration-300 ${
                              isLiked 
                                ? 'text-adaptive-accent dark:text-adaptive-accent3 fill-adaptive-accent dark:fill-adaptive-accent3 stroke-adaptive-accent dark:stroke-adaptive-accent3' 
                                : 'text-adaptive-secondary hover:text-adaptive-accent dark:text-adaptive-accent3 stroke-current'
                            }`}
                            fill={isLiked ? 'currentColor' : 'none'}
                          />
                        </button>
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
    )
  }
}