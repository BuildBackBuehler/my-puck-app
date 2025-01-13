import { useEffect, useRef } from "react";

const AnimatedSvg: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // Ref specifically for an SVG element

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && svgRef.current) {
          svgRef.current.classList.add("animate-fadeInLeft");
        }
      },
      { threshold: 0.5 }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="opacity-0 mx-auto"
    >
      <image href="/LotusWaves.svg" width="100" height="100" />
    </svg>
  );
};

export default AnimatedSvg;