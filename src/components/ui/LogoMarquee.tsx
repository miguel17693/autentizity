"use client";

import { useState } from "react";
import Image from "next/image";

interface LogoMarqueeProps {
  logos: { url: string; name: string }[];
}

export default function LogoMarquee({ logos }: LogoMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (logos.length === 0) return null;

  const duplicated = [...logos, ...logos];
  const speed = Math.max(logos.length * 6, 20);

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredIdx(null);
      }}
    >
      <div
        className="flex gap-8"
        style={{
          width: "max-content",
          animation: `marquee ${speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {duplicated.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex items-center justify-center h-24 shrink-0 transition-transform duration-300 ease-out"
            style={{
              transform: hoveredIdx === i ? "scale(1.35)" : "scale(1)",
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <Image
              src={logo.url}
              alt={logo.name}
              width={180}
              height={80}
              unoptimized={logo.url.endsWith(".png")}
              className="object-contain max-h-20 max-w-[180px] select-none pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
