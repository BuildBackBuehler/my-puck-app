import { ComponentConfig } from "@measured/puck";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type ArticleCardProps = {
  cardClassName: string;
  mainTitle: string;
  date: string;
  image: {
    src: string;
    alt: string;
    imageClassName: string;
  };
  title: string;
  author: string;
  readTime: string;
  summary: string;
  link: string;
  stickyPosition: "top" | "bottom";
  stickyOffset: number;
};

export const ArticleCard: ComponentConfig<ArticleCardProps> = {
  fields: {
    cardClassName: { type: "text" },
    mainTitle: { type: "text" },
    date: { type: "text" },
    image: {
      type: "object",
      objectFields: {
        src: { type: "text" },
        alt: { type: "text" },
        imageClassName: { type: "text" }
      }
    },
    title: { type: "text" },
    author: { type: "text" },
    readTime: { type: "text" },
    summary: { type: "textarea" },
    link: { type: "text" },
    stickyPosition: {
      type: "select",
      options: [
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" }
      ]
    },
    stickyOffset: { type: "number", min: 0, max: 100 },
  },
  defaultProps: {
    cardClassName: `w-full max-w-4xl mx-auto bg-gray-900 text-white`,
    mainTitle: "Esteem",
    date: "January 1, 2024",
    image: {
      src: "https://images.unsplash.com/photo-1609825488888-3a766db05542",
      alt: "Hero Image",
      imageClassName: "h-full w-full mix-blend-overlay"
    },
    title: "Sharing The Widespread Acclaim About Motivation",
    author: "By Richard Carnation",
    readTime: "5 Min Read",
    summary: "Article Summary Goes Here...",
    link: "https://www.example.com",
    stickyPosition: "top",
    stickyOffset: 100,
  },

  render: ({
    cardClassName,
    mainTitle,
    date,
    image,
    title,
    author,
    readTime,
    summary,
    link,
    stickyPosition,
    stickyOffset,
  }) => {
    const id = title.replace(" ", "_").toLowerCase();

    return (
      <section id={id} className={cardClassName}>
      <div className={stickyPosition === "top" ? "sticky top-0" : "sticky bottom-0"}
        style={{ 
          [stickyPosition]: `${stickyOffset}px`,
          position: 'sticky'
        }}
      >
      <div className="p-8 space-y-6">
        <h1 className="text-7xl font-bold tracking-tight">{mainTitle}</h1>
        
        <div className="text-xl text-right">{date}</div>
        
        <Image 
          src={image.src} 
          alt={image.alt}
          className={image.imageClassName}
        />

        <h2 className="text-4xl font-bold italic">{title}</h2>

        <div className="flex justify-between items-center text-lg">
          <span className="italic">{author}</span>
          <span>{readTime}</span>
        </div>

        <p className="text-xl leading-relaxed">{summary}</p>
        <Link 
          href={link}
          className="group inline-flex items-center space-x-2 text-xl hover:text-gray-300 transition-colors"
        >
          <span>See More</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      </div>
    </section>
    );
  }
};