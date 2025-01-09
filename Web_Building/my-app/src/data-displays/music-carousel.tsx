import { ComponentConfig } from "@measured/puck"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export interface MusicCarouselProps {
  title: string;
  tracks: Array<{
    artist: string
    album: string
    title: string
    coverUrl: string
  }>
  perspective?: string
  containerSize?: {
    width: string
    height: string
  }
  accentColor?: string
}

export const MusicCarousel: ComponentConfig<MusicCarouselProps> = {
  fields: {
    title: { type: "text" },
    tracks: {
      type: "array",
      arrayFields: {
        artist: { type: "text" },
        album: { type: "text" },
        title: { type: "text" },
        coverUrl: { type: "text" }
      }
    },
    perspective: { type: "text" },
    containerSize: {
      type: "object", 
      objectFields: {
        width: { type: "text" },
        height: { type: "text" }
      }
    },
    accentColor: { type: "text" }
  },
  defaultProps: {
    title: "Tristan Rene",
    tracks: [
      {
        artist: "David Bowie",
        album: "Aladdin Sane",
        title: "Watch That Man",
        coverUrl: "https://example.com/aladdin-sane.jpg"
      },
      {
        artist: "Pink Floyd",
        album: "Dark Side of the Moon",
        title: "Time",
        coverUrl: "https://example.com/dark-side.jpg" 
      },
      {
        artist: "Led Zeppelin",
        album: "IV",
        title: "Stairway to Heaven",
        coverUrl: "https://example.com/led-zep-iv.jpg"
      }
    ],
    perspective: "2000px",
    containerSize: {
      width: "300px",
      height: "350px"
    },
    accentColor: "#27ae60"
  },

  render: ({ title, tracks, perspective = "2000px", containerSize = { width: "300px", height: "350px" }, accentColor = "#27ae60" }) => {
    const stageRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef<HTMLDivElement[]>([])
    const titleRef = useRef<HTMLDivElement>(null)
    let xPos = 0

    useEffect(() => {
      if (!stageRef.current || !ringRef.current || !titleRef.current) return

      const initCarousel = () => {
        gsap.set(ringRef.current, { rotationY: 180, cursor: "grab" })
        gsap.set(cardRefs.current, {
          rotateY: (i) => i * -(360 / tracks.length),
          transformOrigin: `50% 50% ${containerSize.width}`,
          z: -parseInt(containerSize.width),
          backfaceVisibility: "hidden"
        })
      }

      const handleMouseMove = (e: MouseEvent) => {
        const xMove = (e.clientX - window.innerWidth / 2) * 0.1
        const yMove = (e.clientY - window.innerHeight / 2) * 0.15
        gsap.to(titleRef.current, {
          x: xMove,
          y: yMove,
          duration: 1,
          ease: "power2.out"
        })
      }

      initCarousel()
      window.addEventListener('mousemove', handleMouseMove)

      const dragStart = (e: MouseEvent | TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        xPos = clientX
        gsap.set(ringRef.current, { cursor: "grabbing" })
        window.addEventListener("mousemove", drag)
        window.addEventListener("touchmove", drag)
      }

      const drag = (e: MouseEvent | TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        gsap.to(ringRef.current, {
          rotationY: `-=${(clientX - xPos) % 360}`,
        })
        xPos = clientX
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
        window.removeEventListener('mousemove', handleMouseMove)
        stageRef.current?.removeEventListener("mousedown", dragStart)
        stageRef.current?.removeEventListener("touchstart", dragStart)
        window.removeEventListener("mouseup", dragEnd)
        window.removeEventListener("touchend", dragEnd)
      }
    }, [tracks, containerSize])

    return (
      <div className="relative h-screen w-full overflow-hidden">
        <div 
          ref={titleRef}
          className="absolute inset-0 pointer-events-none z-[0] text-adaptive-secondary"
          // style={{ zIndex: 0 }}
        >
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-display text-adaptive-secondary font-bold whitespace-nowrap z-[0]">
            {title}
          </h1>
        </div>
        
        <div 
          ref={stageRef}
          style={{
            perspective,
            width: containerSize.width,
            height: containerSize.height,
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1
          }}
        >
          <div 
            ref={ringRef}
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              userSelect: "none"
            }}
          >
            {tracks.map((track, i) => (
              <div
                key={i}
                ref={el => cardRefs.current[i] = el!}
                className="absolute w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    className="absolute inset-0 w-full h-full object-cover z-[1]" 
                    src={track.coverUrl} 
                    alt={`${track.artist} - ${track.album}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-[2]" />
                  <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center">
                    <div 
                      className="w-16 h-16 mb-4 rounded-full cursor-pointer hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <div className="w-0 h-0 ml-1 border-l-[14px] border-y-[10px] border-solid border-white border-y-transparent" />
                    </div>
                    <div className="text-center text-white px-4">
                      <h3 className="text-xl font-bold truncate mb-1">{track.title}</h3>
                      <p className="text-sm opacity-90 truncate">{track.artist}</p>
                      <p className="text-xs opacity-75 truncate">{track.album}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}