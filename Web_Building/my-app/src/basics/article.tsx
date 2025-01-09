import { ComponentConfig, DropZone } from "@measured/puck";
import { MessageCircle, Heart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FacebookShare, RedditShare, TwitterShare, LinkedinShare } from 'react-share-kit';
import { useLayoutState } from '../../lib/layout-state';
import { useState, useEffect } from 'react';
import readingTime from "reading-time";

export interface ArticleProps {
  mainTitle: string;
  date: string;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  subtitle?: string;
  author: string;
  readTime: string;
  post: string;
  engagement: {
    views: number;
    likes: number;
    comments: number;
  };
  showEngagement?: boolean;
  onLike?: (liked: boolean) => void;
  isLiked?: boolean;
  shareLinks: {
    facebook?: string;
    linkedin?: string;
    reddit?: string;
    twitter?: string;
  };
  onEngagementUpdate?: (engagement: { views: number; likes: number; comments: number }) => void;
}

export const Article: ComponentConfig<ArticleProps> = {
  fields: {
    mainTitle: { type: "text" },
    date: { type: "text" },
    image: {
      type: "object",
      objectFields: {
        src: { type: "text" },
        alt: { type: "text" }
      }
    },
    title: { type: "text" },
    author: { type: "text" },
    subtitle: { type:"text" },
    readTime: { type: "text" },
    post: { type: "textarea" },
    engagement: {
      type: "object",
      objectFields: {
        views: { type: "number" },
        likes: { type: "number" },
        comments: { type: "number" }
      }
    },
    showEngagement: {
      type: "radio",
      label: "Show Engagement Stats",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false }
      ],
      defaultValue: true
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
        facebook: { type: "text", defaultValue: "" },
        linkedin: { type: "text", defaultValue: "" },
        reddit: { type: "text", defaultValue: "" },
        twitter: { type: "text", defaultValue: "" }
      }
    }
  },

  defaultProps: {
    mainTitle: "Esteem",
    date: "12.06.2021",
    image: { 
      src: "https://demo-source.imgix.net/puppy.jpg",
      alt: "A cute puppy"
    },
    title: "Sharing The Widespread Acclaim",
    subtitle: "This is a sick quote",
    author: "By Richard Carnation",
    readTime: "5 Min Read",
    post: "Blonde received widespread acclaim, with critics praising Ocean's introspective lyrics",
    engagement: {
      views: 1200,
      likes: 847,
      comments: 23
    },
    showEngagement: true,
    isLiked: false,
    shareLinks: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      reddit: "https://reddit.com",
      twitter: "https://twitter.com"
    }
  },

  render: ({
    mainTitle,
    date,
    image,
    title,
    subtitle,
    author,
    readTime,
    post,
    engagement,
    showEngagement = true,
    onLike,
    isLiked: initialLiked = false,
    shareLinks = {},
    onEngagementUpdate
  }) => {
    const { isSidebarOpen, isRightSidebarOpen } = useLayoutState()
    const [currentEngagement, setCurrentEngagement] = useState(engagement);
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [hasViewed, setHasViewed] = useState(false);

    useEffect(() => {
      if (!hasViewed) {
        const newViews = (currentEngagement?.views || 0) + 1;
        setCurrentEngagement(prev => ({
          ...prev,
          views: newViews
        }));
        onEngagementUpdate?.({
          ...currentEngagement,
          views: newViews
        });
        setHasViewed(true);
      }
    }, []);

    const handleLike = () => {
      const newLikedState = !isLiked;
      const newLikes = currentEngagement.likes + (newLikedState ? 1 : -1);
      
      setIsLiked(newLikedState);
      setCurrentEngagement(prev => ({
        ...prev,
        likes: newLikes
      }));
      
      onEngagementUpdate?.({
        ...currentEngagement,
        likes: newLikes
      });
    };

    if (!image?.src) return null;

    return (
      <article className={`
        w-full mx-auto max-h-[calc(100vh-80px)] overflow-y-auto text-adaptive-secondary relative
        transition-all duration-300 scroll-smooth
        ${isSidebarOpen ? '-pl-2' : 'pl-2'}
        ${isRightSidebarOpen ? 'pr-12' : 'pr-2'} 
      `}>
        
        <div className="py-4 space-y-2 md:space-y-4 relative mt-13 lg:mt-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl md:text-4xl lg:text-6xl text-left tracking-tight pl-4">{mainTitle}</h2>
            <div className="text-right">
              <time dateTime={date} className="text-adaptive-secondaryAlt px-4 block text-3xs md:text-sm lg:text-base mt-2">
                {date}
              </time>
              {showEngagement && (
                <div className="text-adaptive-secondaryAlt flex items-center space-x-1 md:space-x-2 text-3xs md:text-2xs lg:text-xs pr-4">
                  <span className="inline-flex items-center gap-0.5 sm:gap-1">
                    <Eye className="w-2 sm:w-3 lg:w-4"/> 
                    {currentEngagement?.views ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-0.5 sm:gap-1">
                    <Heart className="w-2 sm:w-3 lg:w-4 text-transparent fill-adaptive-accent"/> 
                    {currentEngagement?.likes ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-0.5 sm:gap-1">
                    <MessageCircle className="w-2 sm:w-3 lg:w-4"/> 
                    {currentEngagement?.comments ?? 0}
                  </span>
                </div>
              )}
              <span className="text-adaptive-secondaryAlt -space-y-4 md:mt-0 text-3xs md:text-xs lg:text-base font-serif px-4">{readTime}</span>
            </div>
          </div>

            <div className="mx-4 self-center px-8 h-px bg-adaptive-secondaryAlt" />
          <div className="space-y-2 md:space-y-4 md:py-4">
          <div className="mx-4 relative aspect-[2/1] overflow-hidden rounded-lg">
            <Image 
              src={image.src} 
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
          </div>
          <h1 className="font-display text-center text-xl md:text-3xl lg:text-6xl font-bold text-adaptive-accent">{title}</h1>

          {subtitle && (
            <blockquote className="mx-auto px-4 md:px-8 lg:px-16 max-w-4xl my-4 md:my-6 lg:my-8 font-serif italic text-sm md:text-lg lg:text-2xl text-center">
              <p className="">
                "{subtitle}"
              </p>
            </blockquote>
          )}
          
          <div className="flex items-center text-center justify-center text-base">
            <DropZone zone="Avatar" />
            <span className="text-adaptive-secondaryAlt text-xs md:text-sm lg:text-base font-serif px-2 pt-1.5">By {author}</span>
          </div>
          <div className="mx-16 self-center px-16 h-px bg-adaptive-secondaryAlt" />
          <p className="font-sans px-8 text-sm md:text-md lg:text-xl leading-relaxed">{post}</p>
          <div className="mx-16 self-center px-16 h-px bg-adaptive-secondaryAlt" />

          <div className="flex justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0.5 md:hidden">
              <FacebookShare url={shareLinks.facebook || ''} quote={title} round={true} size={20} className="" blankTarget={true} />
              <LinkedinShare url={shareLinks.linkedin || ''} round={true} size={20} className="" blankTarget={true} />
              <RedditShare url={shareLinks.reddit || ''} title={title} round={true} size={20} className="" blankTarget={true} />
              <TwitterShare url={shareLinks.twitter || ''} title={title} round={true} size={20} className="" blankTarget={true} />
            </div>
            <div className="hidden md:flex lg:hidden gap-1">
              <FacebookShare url={shareLinks.facebook || ''} quote={title} round={true} size={28} className="" blankTarget={true} />
              <LinkedinShare url={shareLinks.linkedin || ''} round={true} size={28} className="" blankTarget={true} />
              <RedditShare url={shareLinks.reddit || ''} title={title} round={true} size={28} className="" blankTarget={true} />
              <TwitterShare url={shareLinks.twitter || ''} title={title} round={true} size={28} className="" blankTarget={true} />
            </div>
            <div className="hidden lg:flex gap-1">
              <FacebookShare url={shareLinks.facebook || ''} quote={title} round={true} size={36} className="" blankTarget={true} />
              <LinkedinShare url={shareLinks.linkedin || ''} round={true} size={36} className="" blankTarget={true} />
              <RedditShare url={shareLinks.reddit || ''} title={title} round={true} size={36} className="" blankTarget={true} />
              <TwitterShare url={shareLinks.twitter || ''} title={title} round={true} size={36} className="" blankTarget={true} />
            </div>
            <button 
              onClick={handleLike}
              className={`p-1 sm:p-1.5 lg:p-2 rounded-full transition-all duration-300 ${
                isLiked ? 'text-adaptive-accent fill-adaptive-accent' : 'text-adaptive-secondary hover:text-adaptive-accent'
              }`}
            >
              <Heart 
                size={22}
                className={`transition-all duration-300 sm:h-[24px] md:hidden ${
                  isLiked 
                    ? 'text-adaptive-accent fill-adaptive-accent stroke-adaptive-accent' 
                    : 'text-adaptive-secondary hover:text-adaptive-accent stroke-current'
                }`}
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <Heart 
                size={28}
                className={`transition-all duration-300 md:flex hidden lg:hidden ${
                  isLiked 
                    ? 'text-adaptive-accent fill-adaptive-accent stroke-adaptive-accent' 
                    : 'text-adaptive-secondary hover:text-adaptive-accent stroke-current'
                }`}
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <Heart 
                size={36}
                className={`transition-all duration-300 lg:flex hidden ${
                  isLiked 
                    ? 'text-adaptive-accent fill-adaptive-accent stroke-adaptive-accent' 
                    : 'text-adaptive-secondary hover:text-adaptive-accent stroke-current'
                }`}
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>
      </article>
    );
  }
};