"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";

interface LogoMarqueeProps {
  logos: { url: string; name: string }[];
}

const AUTO_SPEED = 0.3;
const FRICTION = 0.96;
const MIN_VELOCITY = 0.1;

export default function LogoMarquee({ logos }: LogoMarqueeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef<number>(0);
  const velocityRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  if (logos.length === 0) return null;

  const tripled = [...logos, ...logos, ...logos];

  useEffect(() => {
    const loop = () => {
      const track = trackRef.current;
      if (!track || isDragging) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const singleWidth = track.scrollWidth / 3;
      let currentX = x.get();

      if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
        currentX += velocityRef.current;
        velocityRef.current *= FRICTION;
      } else {
        currentX += AUTO_SPEED;
        velocityRef.current = 0;
      }

      while (currentX <= -2 * singleWidth) currentX += singleWidth;
      while (currentX >= 0) currentX -= singleWidth;

      x.set(currentX);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDragging, x]);

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={trackRef}
        className="flex gap-6 cursor-grab active:cursor-grabbing will-change-transform"
        style={{ width: "max-content", x }}
        drag="x"
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          const track = trackRef.current;
          if (track) {
            const singleWidth = track.scrollWidth / 3;
            let current = x.get();
            while (current <= -2 * singleWidth) current += singleWidth;
            while (current >= 0) current -= singleWidth;
            x.set(current);
          }
          velocityRef.current = info.velocity.x / 60;
        }}
      >
        {tripled.map((logo, i) => (
          <motion.div
            key={`${logo.name}-${i}`}
            className="flex items-center justify-center h-20 shrink-0"
            whileHover={isDragging ? undefined : { scale: 1.35 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Image
              src={logo.url}
              alt={logo.name}
              width={160}
              height={64}
              unoptimized={logo.url.endsWith(".png")}
              className="object-contain max-h-16 max-w-[160px] select-none pointer-events-none"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
