import { ComponentConfig } from "@measured/puck"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export interface CarouselProps {
  title: string;
  images: Array<{ 
    url: string; 
    alt: string;
    text?: string; 
  }>
  height?: string
  perspective?: string
  containerSize?: { 
    width: string; 
    height: string 
  }
}

export const Carousel: ComponentConfig<CarouselProps> = {
  fields: {
    title: { type: "text" },
    images: {
      type: "array",
      arrayFields: {
        url: { type: "text" },
        alt: { type: "text" },
        text: { type: "text" }
      }
    },
    height: { type: "text" },
    perspective: { type: "text" },
    containerSize: {
      type: "object",
      objectFields: {
        width: { type: "text" },
        height: { type: "text" }
      }
    },
  },
  defaultProps: {
    title: "Zack",
    images: [
      { url: "/image1.jpg", alt: "Image 1", text: "First Slide" },
      { url: "/image2.jpg", alt: "Image 2", text: "Second Slide" },
      { url: "/image3.jpg", alt: "Image 3", text: "Third Slide" }
    ],
    height: "100vh",
    perspective: "2000px",
    containerSize: {
      width: "300px",
      height: "400px"
    }
  },

  render: ({ title, images, height, perspective = "1000px", containerSize = { width: "80vw", height: "60vh" } }) => {
    const stageRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const imageRefs = useRef<HTMLDivElement[]>([])
    let xPos = 0

    useEffect(() => {
      if (!stageRef.current || !ringRef.current) return
      
      const getBgPos = (i: number) => {
        const rotation = gsap.getProperty(ringRef.current, "rotationY") as number
        return `${100 - gsap.utils.wrap(0, 360, rotation - 180 - i * 36) / 360 * 500}px 0px`
      }

      const initCarousel = () => {
        gsap.set(ringRef.current, { rotationY: 180, cursor: "grab" })
        gsap.set(imageRefs.current, {
          rotateY: (i) => i * -36,
          transformOrigin: "50% 50% 500px",
          z: -500,
          backgroundImage: (i) => `url(${images[i].url})`,
          backgroundPosition: (i) => getBgPos(i),
          backfaceVisibility: "hidden"
        })
      }

      initCarousel()

      const dragStart = (e: MouseEvent | TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        xPos = Math.round(clientX)
        gsap.set(ringRef.current, { cursor: "grabbing" })
        window.addEventListener("mousemove", drag)
        window.addEventListener("touchmove", drag)
        e.stopPropagation()
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
        e.stopPropagation()
      }

      const dragEnd = () => {
        window.removeEventListener("mousemove", drag)
        window.removeEventListener("touchmove", drag)
        gsap.set(ringRef.current, { cursor: "grab" })
      }

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

    return (
      <div ref={stageRef} className="relative h-screen">
        <div className="absolute inset-0 flex items-center text-adaptive-secondary justify-center z-[0]"
             ref={(el) => {
               if (el) {
           const moveTitle = (e: MouseEvent) => {
             const xMove = (e.clientX - window.innerWidth / 2) * 0.1;
             const yMove = (e.clientY - window.innerHeight / 2) * 0.15;
             gsap.to(el, {
               x: xMove,
               y: yMove,
               duration: 1,
               ease: "power2.out"
             });
           };
           
           window.addEventListener('mousemove', moveTitle);
           return () => window.removeEventListener('mousemove', moveTitle);
               }
             }}>
            <h1 className="text-9xl font-display text-adaptive-secondary font-bold pb-64 z-[0]">
              {title}
            </h1>
        </div>
        <div style={{
          perspective,
          width: containerSize.width,
          height: containerSize.height,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"
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
                ref={el => imageRefs.current[i] = el!}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-4xl font-bold text-white bg-black-light/30 z-10 drop-shadow-lg">
                    {image.text}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}