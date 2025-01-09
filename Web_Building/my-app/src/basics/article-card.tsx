import { ComponentConfig, DropZone } from "@measured/puck";
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
  post: string;
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
    },
    post: { type: "textarea" }
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
    link: "#",
    post: "Blonde received widespread acclaim, with critics praising Ocean's introspective lyrics"
  },

  render: ({ mainTitle, date, image, title, author, readTime, summary, link, post }) => {

    if (!image?.src) return null;
      
    return (
      <article className="overflow-hidden">
        <div className="h-full flex flex-col justify-center py-8 space-y-1 px-3 lg:py-8 lg:space-y-2 lg:px-6">
          <h1 className="font-display text-4xl lg:text-9xl font-bold tracking-tight pt-4 lg:pt-4">{mainTitle}</h1>
          <time dateTime={date} className="block text-sm lg:text-2xl text-right pr-4">{date}</time>
          
          <div className="w-full h-px bg-adaptive-secondaryAlt" />
          
          <div className="relative aspect-[2/1] overflow-hidden rounded-sm top-2 lg:rounded-lg lg:top-4">
            <Image 
              src={image.src} 
              alt={image.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
          <h2 className="text-xl sm:text-center sm:max-md:text-center lg:text-left lg:text-4xl pl-4 lg:pl-0 font-bold text-adaptive-secondary hover:text-adaptive-accent focus:text-adaptive-accent transition-colors pt-4">
            <Link 
                        href={link || '#'} 
                      >
                        {title}
                      </Link>
          </h2>

          <div className="flex justify-between items-center">
            <span className="font-serif text-3xs md:text-xs lg:text-base">{author}</span>
            <span className="font-serif text-3xs md:text-xs lg:text-base">{readTime}</span>
          </div>

          <p className="font-sans text-sm lg:text-xl leading-relaxed">{summary}</p>
          </div>
          <div className="w-full h-px bg-adaptive-secondaryAlt" />
          
          <div className="flex justify-end">
            <DropZone zone="SeeMore"/>
            {/* <button 
              onClick={() => setIsDialogOpen(true)}
              
              <CornerDownRight size={36} />
              <span className="text-adaptive-secondary group-hover:text-adaptive-accent">
                See More
              </span>
            </button> */}
          </div>
        </div>
      </article>
    );
  }
};