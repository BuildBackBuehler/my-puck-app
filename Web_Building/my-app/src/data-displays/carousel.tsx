import { ComponentConfig } from "@measured/puck"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export interface CarouselProps {
  images: Array<{ url: string; alt: string }>
  height?: string
  perspective?: string
  containerSize?: { width: string; height: string }
}

export const Carousel: ComponentConfig<CarouselProps> = {
  fields: {
    images: {
      type: "array",
      arrayFields: {
        url: { type: "text" },
        alt: { type: "text" }
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
    }
  },
  defaultProps: {
    images: Array(10).fill({}).map((_, i) => ({
      url: `https://picsum.photos/id/${i + 32}/600/400`,
      alt: `Image ${i + 1}`
    })),
    height: "100vh",
    perspective: "2000px",
    containerSize: {
      width: "300px",
      height: "400px"
    }
  },
  render: ({ images, height, perspective, containerSize }) => {
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

      gsap.timeline()
        .set(ringRef.current, { rotationY: 180, cursor: "grab" })
        .set(imageRefs.current, {
          rotateY: (i) => i * -36,
          transformOrigin: "50% 50% 500px",
          z: -500,
          backgroundImage: (i) => `url(${images[i].url})`,
          backgroundPosition: (i) => getBgPos(i),
          backfaceVisibility: "hidden"
        })
        .from(imageRefs.current, {
          duration: 1.5,
          y: 200,
          opacity: 0,
          stagger: 0.1,
          ease: "expo"
        })
        .add(() => {
          imageRefs.current.forEach(img => {
            img.addEventListener("mouseenter", () => {
              gsap.to(imageRefs.current, {
                opacity: (i, t) => t === img ? 1 : 0.5,
                ease: "power3"
              })
            })
            img.addEventListener("mouseleave", () => {
              gsap.to(imageRefs.current, {
                opacity: 1,
                ease: "power2.inOut"
              })
            })
          })
        }, "-=0.5")

      window.addEventListener("mousedown", dragStart)
      window.addEventListener("touchstart", dragStart)
      window.addEventListener("mouseup", dragEnd)
      window.addEventListener("touchend", dragEnd)

      return () => {
        window.removeEventListener("mousedown", dragStart)
        window.removeEventListener("touchstart", dragStart)
        window.removeEventListener("mouseup", dragEnd)
        window.removeEventListener("touchend", dragEnd)
      }
    }, [images])

    useEffect(() => {
      if (!stageRef.current || !imageRefs.current?.length) return;

      const tl = gsap.timeline()
      
      tl.fromTo(imageRefs.current, {
        opacity: 0
      }, {
        opacity: 1,
        stagger: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          imageRefs.current?.forEach(img => {
            if (!img) return;
            
            img.addEventListener("mouseenter", () => {
              gsap.to(imageRefs.current, {
                opacity: (i, t) => t === img ? 1 : 0.5,
                ease: "power3"
              })
            })
            
            img.addEventListener("mouseleave", () => {
              gsap.to(imageRefs.current, {
                opacity: 1,
                ease: "power2.inOut"
              })
            })
          })
        }
      }, "-=0.5")

      const dragStart = (e: MouseEvent | TouchEvent) => {
        if (!stageRef.current) return;
        // ...existing drag code...
      }

      const dragEnd = () => {
        if (!stageRef.current) return;
        // ...existing drag code...
      }

      window.addEventListener("mousedown", dragStart)
      window.addEventListener("touchstart", dragStart)
      window.addEventListener("mouseup", dragEnd)
      window.addEventListener("touchend", dragEnd)

      return () => {
        window.removeEventListener("mousedown", dragStart)
        window.removeEventListener("touchstart", dragStart)
        window.removeEventListener("mouseup", dragEnd)
        window.removeEventListener("touchend", dragEnd)
        imageRefs.current?.forEach(img => {
          img?.removeEventListener("mouseenter", () => {})
          img?.removeEventListener("mouseleave", () => {})
        })
      }
    }, [images])

    return (
      <div 
        ref={stageRef} 
        style={{ 
          height,
          overflow: "hidden",
          background: "#000"
        }}
      >
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
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}