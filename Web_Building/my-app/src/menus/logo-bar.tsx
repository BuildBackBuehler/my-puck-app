import { ComponentConfig } from "@measured/puck";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import * as logo from "src/misc/TransLogo3000.png";

export interface LogoBarProps {
  siteLogo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  siteUrl: string;
  backgroundColor?: string;
  height?: string;
}

export const LogoBar: ComponentConfig<LogoBarProps> = {
  fields: {
    siteLogo: {
      type: "object",
      objectFields: {
        src: { type: "text" },
        alt: { type: "text" },
        width: { type: "number" },
        height: { type: "number" }
      }
    },
    siteUrl: { type: "text" },
    height: { type: "text" }
  },

  defaultProps: {
    siteLogo: {
      src: '/Users/zack/.home/gitrepos/Web_Building/my-app/src/misc/TransLogo3000.png',
      alt: "Site Logo",
      width: 120,
      height: 40
    },
    siteUrl: "/",
    height: "64px"
  },

  render: ({ siteLogo, siteUrl, height = "64px" }) => (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-0 right-0 z-50 px-4"
      style={{ height }}
    >
      <div className="h-full flex items-center max-w-7xl mx-auto">
        <Link href={siteUrl}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Image
              src={siteLogo.src}
              alt={siteLogo.alt}
              width={siteLogo.width}
              height={siteLogo.height}
              className="object-contain"
              priority
            />
          </motion.div>
        </Link>
      </div>
    </motion.header>
  )
};