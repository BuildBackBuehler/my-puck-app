import { ComponentConfig } from "@measured/puck";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AnimatedSVG from "@/public/animatedLW";

export interface LogoBarProps {
  siteLogo: {
    src: string;
    alt: string;
    width: string;
    height: string;
  };
  siteUrl: string;
  headerHeight?: string;
  animationStyle: "fade" | "hover";
}

export const LogoBar: ComponentConfig<LogoBarProps> = {
  fields: {
    siteLogo: {
      type: "object", 
      objectFields: {
        src: { type: "text" },
        alt: { type: "text" },
        width: { 
          type: "text",
          label: "Width (include px)"
        },
        height: { 
          type: "text",
          label: "Height (include px)"
        }
      }
    },
    siteUrl: { type: "text" },
    headerHeight: { type: "text" },
    animationStyle: {
      type: "radio",
      options: [
        { label: "Fade Animation", value: "fade" },
        { label: "Hover Animation", value: "hover" }
      ]
    }
  },

  defaultProps: {
    siteLogo: {
      src: "/BevelLotus.svg", 
      alt: "Site Logo",
      width: "48px",
      height: "48px"
    },
    siteUrl: "/",
    headerHeight: "48px",
    animationStyle: "hover"
  },

  render: ({ siteLogo, siteUrl, headerHeight = "64px", animationStyle }) => {
    const width = parseInt(siteLogo.width);
    const height = parseInt(siteLogo.height);

    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-4" style={{ height: headerHeight }}>
        <div className="h-full flex items-center justify-center max-w-7xl mx-auto pt-2">
          <Link href={siteUrl}>
          {animationStyle === "fade" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "linear"
                }}
                className="relative"
                >
              <AnimatedSVG />
              </motion.div>
            )  : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
                style={{
                  width: siteLogo.width,
                  height: siteLogo.height
                }}
              >
                <Image
                  src={siteLogo.src}
                  alt={siteLogo.alt}
                  width={width}
                  height={height} 
                  className="w-full h-full object-contain"
                  priority
                />
              </motion.div>
            )}
          </Link>
        </div>
      </header>
    );
  }
};