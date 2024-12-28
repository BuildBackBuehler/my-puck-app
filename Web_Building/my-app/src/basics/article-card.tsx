import { ComponentConfig } from "@measured/puck";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface ArticleCardProps {
  mainTitle: string;
  date: string;
  image: string;
  title: string;
  author: string;
  readTime: string;
  summary: string;
  link: string;
};

export const ArticleCard: ComponentConfig<ArticleCardProps> = {
  fields: {
    mainTitle: { type: "text" },
    date: { type: "text" },
    image: { type: "text" },
    title: { type: "text" },
    author: { type: "text" },
    readTime: { type: "text" },
    summary: { type: "textarea" },
    link: { type: "text" }
  },

  defaultProps: {
    mainTitle: "Esteem",
    date: "12.06.2021",
    image: "https://images.unsplash.com/photo-1609825488888-3a766db05542",
    title: "Sharing The Widespread Acclaim",
    author: "By Richard Carnation",
    readTime: "5 Min Read",
    summary: "Blonde received widespread acclaim, with critics praising Ocean's introspective lyrics",
    link: "#"
  },

  render: ({
    mainTitle,
    date,
    image,
    title,
    author,
    readTime,
    summary,
    link
  }) => {
    return (
      <article className="w-full max-w-4xl mx-auto bg-gray-900 text-white">
        <div className="p-8 space-y-6">
          <h1 className="text-7xl font-bold tracking-tight">{mainTitle}</h1>
          
          <time dateTime={date} className="block text-xl text-right">
            {date}
          </time>
          
          <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
            <Image 
              src={image} 
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>

          <h2 className="text-4xl font-bold italic">{title}</h2>

          <div className="flex justify-between items-center text-lg">
            <span className="italic">{author}</span>
            <span>{readTime}</span>
          </div>

          <p className="text-xl leading-relaxed">{summary}</p>

          <Link 
            href={link}
            className="group inline-flex items-center gap-2 text-xl hover:text-gray-300 transition-colors"
          >
            <span>See More</span>
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    );
  }
};