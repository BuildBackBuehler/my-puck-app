import { ComponentConfig } from "@measured/puck";
import { CornerDownRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export interface ArticleCardProps {
  mainTitle: string;
  date: string;
  image: {
    src: string;
    alt: string;
  };
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
    summary: { type: "textarea" },
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
    if (!image?.src) return null;
    return (
      <article className="w-full max-w-4xl mx-auto bg-gray-900 text-white">
        <div className="py-8 space-y-4">
          <h1 className="font-display text-8xl font-bold tracking-tight">{mainTitle}</h1>
          
          <time dateTime={date} className="px-4 block text-xl text-right">
            {date}
          </time>
          <div className="mx-4 self-center px-8 h-px bg-neutral-800" />
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

          <h2 className="font-sans px-8 text-4xl">{title}</h2>

          <div className="flex justify-between items-center text-md">
            <span className="font-serif px-8 italic">{author}</span>
            <span className="font-serif px-8 italic">{readTime}</span>
          </div>

          <p className="font-sans px-8 text-lg leading-relaxed">{summary}</p>
          <div className="mx-4 self-center px-8 h-px bg-neutral-800" />
            <div className="flex justify-end">
            <Link 
              href={link || "#"}
              className="pr-4 group inline-flex items-center gap-2 text-3xl hover:text-gray-300 transition-colors"
            >
              <CornerDownRight size={36} />
              <span>See More</span>
            </Link>
            </div>
        </div>
      </article>
    );
  }
};

// className="w-6 h-6 transition-transform group-hover:translate-x-1"