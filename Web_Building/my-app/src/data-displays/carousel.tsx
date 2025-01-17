'use client';

import { ComponentConfig } from "@measured/puck"
import { useEffect, useRef, useState, useCallback } from "react"
import { getCarouselImages } from "../../utils/supabase/client"
import { CarouselImage } from "../../utils/types/database"
import gsap from "gsap"
import Image from "next/image"
import { supabase } from "../../utils/supabase/client"

export interface CarouselProps {
  title: string;
  containerId?: string;
  perspective?: string;
  containerSize?: { 
    width: string; 
    height: string 
  };
}

export const Carousel: ComponentConfig<CarouselProps> = {
  fields: {
    title: { type: "text" },
    containerId: {
      type: "external",
      label: "Image Container",
      fetchList: async () => {
        const { data: images, error } = await supabase
          .from('carousel_images')
          .select('id, container_name, image_url, caption')
          .order('container_name', { ascending: true });

        if (error) throw error;
        if (!images) return [];
        return images.map(img => ({
          id: img.container_name,  // Changed from container_id
          title: img.container_name
        }))
      },
      getItemSummary: (item) => item.title,
      mapProp: (item) => item.id,
    },
    containerSize: {
      type: "object",
      objectFields: {
        width: { 
          type: "text",
          defaultValue: "min(80vw, 1200px)" // Max width constraint
        },
        height: { 
          type: "text",
          defaultValue: "min(60vh, 800px)" // Max height constraint
        }
      }
    },
    perspective: { type: "text" }
  },

  defaultProps: {
    title: "Gallery",
    perspective: "2000px",
    containerSize: {
      width: "min(80vw, 1200px)",
      height: "min(60vh, 800px)"
    }
  },

  render: ({ 
    title, 
    containerId, 
    perspective = "2000px", 
    containerSize 
  }) => {
    const [images, setImages] = useState<CarouselImage[]>([])
    const stageRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const imageRefs = useRef<HTMLDivElement[]>([])
    let xPos = 0

    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
    const [dragCoefficient, setDragCoefficient] = useState(0.25);
    const THROTTLE_MS = 16; // ~60fps

    const handleMouseMove = useCallback((e: MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime < THROTTLE_MS) return;
    
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
    
      const mouseX = e.clientX;
      const speed = Math.min(
        Math.abs((mouseX - rect.left) / rect.width - 0.5) * dragCoefficient,
        0.5
      );
      
      xPos += speed * (mouseX > rect.width / 2 ? 1 : -1);
      rotateRing();
      
      setLastUpdateTime(currentTime);
    }, [lastUpdateTime]);
    
    useEffect(() => {
      const stage = stageRef.current;
      if (!stage) return;
    
      stage.addEventListener('mousemove', handleMouseMove);
      return () => stage.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);
    
    const rotateRing = () => {
      if (!ringRef.current) return;
      
      gsap.to(ringRef.current, {
        rotateY: xPos * -360,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    useEffect(() => {
      if (containerId) {
        getCarouselImages(containerId).then((images) => {
          if (images) {
            setImages(images)
          }
        })
      }
    }, [containerId])

    useEffect(() => {
      if (!stageRef.current || !ringRef.current || !images.length) return
      
      const getBgPos = (i: number) => {
        const rotation = gsap.getProperty(ringRef.current, "rotationY") as number
        return `${100 - gsap.utils.wrap(0, 360, rotation - 180 - i * 36) / 360 * 500}px 0px`
      }

      const initCarousel = () => {
        gsap.set(ringRef.current, { rotationY: 180, cursor: "grab" })
        gsap.set(imageRefs.current, {
          rotateY: (i) => i * -36,
          transformOrigin: "60% 60% 500px",
          z: -500,
          backgroundImage: (i) => `url(${images[i].image_url})`,
          backgroundPosition: (i) => getBgPos(i),
          backfaceVisibility: "hidden"
        })
      }

      const dragStart = (e: MouseEvent | TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        xPos = Math.round(clientX)
        gsap.set(ringRef.current, { cursor: "grabbing" })
        window.addEventListener("mousemove", drag)
        window.addEventListener("touchmove", drag)
      }

      const drag = (e: MouseEvent | TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        gsap.to(ringRef.current, {
          rotationY: `-=${(Math.round(clientX) - xPos) % 360}`,
          onUpdate: () => {
            imageRefs.current.forEach((img, i) => {
              gsap.set(img, { backgroundPosition: getBgPos(i) })
            })
          }
        })
        xPos = Math.round(clientX)
      }

      const dragEnd = () => {
        window.removeEventListener("mousemove", drag)
        window.removeEventListener("touchmove", drag)
        gsap.set(ringRef.current, { cursor: "grab" })
      }

      initCarousel()

      stageRef.current.addEventListener("mousedown", dragStart)
      stageRef.current.addEventListener("touchstart", dragStart)
      window.addEventListener("mouseup", dragEnd)
      window.addEventListener("touchend", dragEnd)

      return () => {
        stageRef.current?.removeEventListener("mousedown", dragStart)
        stageRef.current?.removeEventListener("touchstart", dragStart)
        window.removeEventListener("mouseup", dragEnd)
        window.removeEventListener("touchend", dragEnd)
      }
    }, [images])

    const [selectedImage, setSelectedImage] = useState<CarouselImage | null>(null);

    const ImageModal = ({ image, onClose }: { image: CarouselImage; onClose: () => void }) => {
      useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
      }, [onClose]);
    
      return (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div 
            className="w-screen h-screen p-4 flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-adaptive-accent z-50"
              onClick={onClose}
            >
              Close
            </button>
            <Image
              src={image.image_url}
              alt={image.caption}
              className="w-auto h-auto max-w-[95vw] max-h-[95vh] object-contain"
              width={1920}
              height={1080}
              priority
            />
          </div>
        </div>
      );
    };

    if (!images.length) return null

    return (
      <div ref={stageRef} className="relative h-screen">
        <div 
          className="absolute inset-0 flex items-center justify-center z-0"
          ref={el => {
            if (el) {
              const moveTitle = (e: MouseEvent) => {
                const xMove = (e.clientX - window.innerWidth / 2) * 0.1
                const yMove = (e.clientY - window.innerHeight / 2) * 0.15
                gsap.to(el, {
                  x: xMove,
                  y: yMove,
                  duration: 1,
                  ease: "power2.out"
                })
              }
              
              window.addEventListener('mousemove', moveTitle)
              return () => window.removeEventListener('mousemove', moveTitle)
            }
          }}
        >
          <h1 className="select-none text-7xl md:text-9xl font-display text-adaptive-secondary font-bold pb-64">
            {title}
          </h1>
        </div>

        <div style={{
          perspective,
          width: containerSize?.width || "min(80vw, 1200px)",
          height: containerSize?.height || "min(60vh, 800px)",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "1200px", // Hard limit
          margin: "0 auto"
        }}>
          <div 
            ref={ringRef}
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              userSelect: "none"
            }}
          >
{images.map((image, i) => (
          <div
            key={i}
            ref={el => {
              if (el) imageRefs.current[i] = el
            }}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(image)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              backdropFilter: "blur(1000px)",
              zIndex: 500
            }}
          >
            <Image 
              src={image.image_url}
              alt={image.caption}
              className="absolute inset-0 w-full h-full object-cover"
              width={600}
              height={1200}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h2 className="font-display text-3xl font-bold text-white bg-black-light/20 backdrop-blur-sm z-10 drop-shadow-lg p-4">
                {image.caption}
              </h2>
            </div>
          </div>
        ))}
          </div>
        </div>
        {selectedImage && (
          <ImageModal 
            image={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        )}
      </div>
    )
  }
}