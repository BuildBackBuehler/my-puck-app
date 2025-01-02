import { ComponentConfig, DropZone } from "@measured/puck";
import { MessageCircle, Heart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FacebookShare, RedditShare, TwitterShare, LinkedinShare } from 'react-share-kit';
import { performRequest } from '../../lib/dato';

export interface ArticleProps {
  mainTitle: string;
  date: string;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  author: string;
  readTime: string;
  post: string;
  link: string;
};

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
    readTime: { type: "text" },
    post: { type: "textarea" },
    link: { 
      type: "text",
      defaultValue: "#",
      required: true
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
    author: "By Richard Carnation",
    readTime: "5 Min Read",
    post: "Blonde received widespread acclaim, with critics praising Ocean's introspective lyrics",
    link: "#"
  },

  render: ({
    mainTitle,
    date,
    image,
    title,
    author,
    readTime,
    post,
    link
  }) => {
    if (!image?.src) return null;
    return (
      <article className="w-full max-w-4xl mx-auto text-adaptive-secondary">
        <div className="absolute right-0 top-[10vh] w-px h-full bg-adaptive-secondaryAlt" />
        <div className="py-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-6xl text-left tracking-tight">{mainTitle}</h2>
            <div className="text-right">
              <time dateTime={date} className="px-4 block text-md mt-2">
                {date}
              </time>
              <div className="flex items-center space-x-2 text-xs pr-4">
                <span className="inline-flex items-center gap-1"><Eye size={12}/> 1.2k</span>
                <span className="inline-flex items-center gap-1"><Heart size={12}/> 847</span>
                <span className="inline-flex items-center gap-1"><MessageCircle size={12}/> 23</span>
              </div>
              <span className="text-md font-serif italic px-4">{readTime}</span>
            </div>
          </div>
          <div className="mx-4 self-center px-8 h-px bg-adaptive-secondaryAlt" />
          <div className="mx-4 relative aspect-[2/1] overflow-hidden rounded-lg">
            <Image 
              src={image.src} 
              alt={image.alt}
              fill
              className="object-cover"
              sizes="px-8 (max-width: 896px) 100vw, 896px"
              priority
            />
          </div>

          <h1 className="font-sans text-center text-5xl font-bold text-adaptive-accent">{title}</h1>

          <div className="flex items-center text-center justify-center text-md">
            <span className="font-serif italic items-center justify-center text-center px-2">{author}</span>
            <DropZone zone="Avatar"></DropZone>
          </div>
          <p className="font-sans px-8 text-lg leading-relaxed">{post}</p>
          <div className="flex justify-right items-right"> 
            <FacebookShare url={link} quote={title} round={true} size={32} blankTarget={true} />
            <LinkedinShare url={link} round={true} size={32} blankTarget={true}  />
            <RedditShare url={link} title={title} round={true} size={32} blankTarget={true} />
            <TwitterShare url={link} title={title} round={true} size={32} blankTarget={true} />
          </div>
        </div>
      </article>
    );
  }
};