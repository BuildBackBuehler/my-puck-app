import { ComponentConfig } from "@measured/puck";
import { ChevronLeft, ChevronRight, Mail, Linkedin, Instagram } from "lucide-react";
import { Author as AuthorType } from "../../lib/supabase";
import { getAuthors } from "../../utils/supabase/client";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import type { Settings as SliderSettings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@/utils/styles/slick-custom.css';
import clsx from "clsx";

export interface AboutCardProps {
  authorId?: string;
  occupation?: string;
  interests?: { name: string }[];
  descriptions?: { text: string }[];
  emailUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  backgroundImage?: string;
}

const CustomArrow = ({ className, onClick, direction }: { className?: string; onClick?: () => void; direction: 'prev' | 'next' }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  
  return (
    <button
      className={`${className} !text-white-mid/60 hover:text-white !w-8 !h-8 !flex items-center justify-center
        before:!content-none rounded-full
        transition-all duration-300 ease-in-out z-20 hover:drop-shadow-glowY`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      aria-label={`${direction} slide`}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

export const AboutCard: ComponentConfig<AboutCardProps> = {
  fields: {
    authorId: {
      type: "external",
      label: "Select Author",
      fetchList: async () => getAuthors(),
      getItemSummary: (item: AuthorType) => item.pen_name,
      mapProp: (item: AuthorType) => item.id,
    },
    occupation: { type: "text" },
    interests: {
      type: "array",
      arrayFields: { name: { type: "text" } },
      defaultItemProps: { name: "Interest" },
      max: 6
    },
    descriptions: {
      type: "array",
      arrayFields: { text: { type: "textarea" } },
      defaultItemProps: { text: "Add your description" }
    },
    emailUrl: { type: "text" },
    linkedinUrl: { type: "text" },
    instagramUrl: { type: "text" },
    backgroundImage: { type: "text" }
  },

  defaultProps: {
    occupation: "Software Developer",
    interests: [
      { name: "Coding" },
      { name: "Writing" },
      { name: "Design" }
    ],
    descriptions: [
      { text: "A passionate creator who loves building things that matter." },
      { text: "Always learning and exploring new possibilities." }
    ],
    emailUrl: "mailto:example@email.com",
    linkedinUrl: "https://linkedin.com",
    instagramUrl: "https://instagram.com"
  },

  render: ({
    authorId,
    occupation,
    interests = [],
    descriptions = [],
    emailUrl,
    linkedinUrl,
    instagramUrl,
    backgroundImage
  }) => {
    const [author, setAuthor] = React.useState<AuthorType | null>(null);
    const sliderRef = useRef<Slider>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    
    const handleMouseMove = (event: React.MouseEvent) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x, y });
    };
    
    const getShadowStyle = () => ({
      filter: `drop-shadow(${mousePosition.x * 10}px ${mousePosition.y * 10}px 4px rgba(0,0,0,0.25))`
    });

    React.useEffect(() => {
      if (authorId) {
        getAuthors().then(authors => {
          const selectedAuthor = authors.find(a => a.id === authorId);
          setAuthor(selectedAuthor || null);
        });
      }
    }, [authorId]);

    if (!author) return null;

    const sliderSettings: SliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: <CustomArrow direction="prev" />,
      nextArrow: <CustomArrow direction="next" />,
      dotsClass: "slick-dots custom-lines",
    };

    const socialIcons = [
      { url: emailUrl, icon: Mail },
      { url: linkedinUrl, icon: Linkedin },
      { url: instagramUrl, icon: Instagram }
    ].filter(({ url }) => url);

    return (
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group snap-center relative block max-w-5xl h-[600px] md:h-[450px] mx-auto overflow-hidden rounded-lg transition-all duration-400 shadow-lg hover:shadow-xl"
      >
        <div className="relative h-full z-10 bg-gradient-to-r from-purple-dark via-purple-dark/70 to-transparent rounded-lg">
          <div className="relative p-6 h-2/5 opacity-10 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <img 
              src={author.avatar_url}
              alt={author.pen_name}
              className="relative float-left mr-5 h-32 w-32 object-cover rounded-lg shadow-lg text-adaptive-primary transition-all"
              style={getShadowStyle()}
            />
            <div>
              <h1 
                className="font-display text-2xl font-semibold text-white transition-all"
                style={getShadowStyle()}
              >
                {author.pen_name}
              </h1>
              <h4 className="mt-2 text-white-mid group-hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] transition-all">
                {occupation}
              </h4>
              <div className="grid grid-cols-3 gap-2 mt-4 max-w-[300px]">
                {interests.map((interest, index) => (
                  <div 
                    key={index}
                    className={clsx(
                      "relative px-2 py-1 text-xs rounded-md overflow-hidden shadow-lg text-center transition-all",
                      index < 3 
                        ? "text-white font-medium bg-purple/10"
                        : "text-white-mid"
                    )}
                    style={getShadowStyle()}
                  >
                    <span>{interest.name}</span>
                    <div className="absolute inset-0 bottom-1/2 bg-white/10 rounded-[0%_0%_10%_30%] clip-shine z-40"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col -mt-14 md:-mt-0 pl-4 px-3 md:px-7 h-[65%] opacity-10 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <div className="relative w-3/4">
              <Slider ref={sliderRef} {...sliderSettings}>
                {descriptions.map((desc, index) => (
                  <div key={index} className="!flex outline-none">
                    <p 
                      className="text-white text-sm md:text-base leading-relaxed transition-all pl-2"
                      style={getShadowStyle()}
                    >
                      {desc.text}
                    </p>
                  </div>
                ))}
              </Slider>
            </div>
            
            <div className="absolute z-30">
            <ul className="flex justify-center gap-3">
          {Array.from({ length: descriptions.length }).map((_, i) => (
            <button
              key={i}
              className="rounded-full bg-adaptive-transparent hover:bg-adaptive-primaryAlt/60 
              transition-all duration-200 focus:outline-none"
              onClick={() => sliderRef.current?.slickGoTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </ul>
      </div>
            <div className="absolute bottom-[3%] md:bottom-[7%] right-4 md:right-16 z-30">
              <ul className="flex justify-right gap-6">
                {socialIcons.map(({ url, icon: Icon }, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" group text-white-mid hover:text-adaptive-accent transition-all"
                      style={getShadowStyle()}
                    >
                      <Icon className="w-6 h-6 opacity-40" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div 
          className="absolute top-0 right-0 z-0 h-full w-10/12 rounded-r-lg bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage || author.avatar_url})`
          }}
        />
      </div>
    );
  }
};

// appendDots: dots => (
//   <div className="absolute bottom-[7%]">
//     <ul className="flex justify-center gap-3"> {dots} </ul>
//   </div>
// ),
// customPaging: i => (
//   <button
//     className="rounded-none bg-adaptive-primaryAlt/30 hover:bg-adaptive-primaryAlt/60 
//     transition-all duration-200 focus:outline-none"
//     aria-label={`Go to slide ${i + 1}`}
//   />
// )