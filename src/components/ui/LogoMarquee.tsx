"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LogoMarqueeProps {
  logos: { url: string; name: string }[];
}

const MAX_SPEED = 1.2;
const AUTO_SPEED = 0.35;

export default function LogoMarquee({ logos }: LogoMarqueeProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const speedRef = useRef(AUTO_SPEED);
  const mouseInside = useRef(false);
  const rafRef = useRef<number>(0);

  if (logos.length === 0) return null;

  const tripled = [...logos, ...logos, ...logos];
  const viewWidth = logos.length; // proxy — real width measured in raf

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width; // 0 (left) to 1 (right)
    const direction = (ratio - 0.5) * 2; // -1 to +1
    speedRef.current = direction * MAX_SPEED;
  }, []);

  const handleMouseEnter = useCallback(() => {
    mouseInside.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseInside.current = false;
    speedRef.current = AUTO_SPEED;
    setHoveredIdx(null);
  }, []);

  useEffect(() => {
    const loop = () => {
      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const firstChild = container.firstElementChild as HTMLElement;
      const singleWidth = firstChild ? firstChild.scrollWidth / 3 : container.clientWidth;

      xRef.current -= speedRef.current;
      if (xRef.current <= -singleWidth) xRef.current += singleWidth;
      if (xRef.current >= singleWidth) xRef.current -= singleWidth;

      container.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
      <div ref={containerRef} className="flex gap-6 will-change-transform" style={{ width: "max-content" }}>
        {tripled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex items-center justify-center h-20 shrink-0 transition-transform duration-300 ease-out"
            style={{ transform: hoveredIdx === i ? "scale(1.35)" : "scale(1)" }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <Image
              src={logo.url}
              alt={logo.name}
              width={160}
              height={64}
              unoptimized={logo.url.endsWith(".png")}
              className="object-contain max-h-16 max-w-[160px] select-none pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
