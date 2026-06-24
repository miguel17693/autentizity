import Image from "next/image";
import type { Movement } from "@/lib/types";

interface AmbassadorCardProps {
  name: string;
  photoUrl: string;
  tags: string[];
  movements: Movement[];
}

export default function AmbassadorCard({ name, photoUrl, tags, movements }: AmbassadorCardProps) {
  const hasPhoto = photoUrl != null && photoUrl !== "";
  const movementTitle =
    movements.length > 0
      ? movements.map((m) => m.title).join(", ")
      : null;

  return (
    <div className="text-center group">
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-border-light bg-surface-alt mb-3 group-hover:border-accent/30 transition-colors">
        {hasPhoto ? (
          <Image
            src={photoUrl}
            alt={name}
            width={96}
            height={96}
            unoptimized
            className="object-cover w-full h-full"
          />
        ) : (
          <svg
            className="w-10 h-10 text-text-muted m-auto mt-[28px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        )}
      </div>

      <p className="text-text-secondary text-sm font-light mb-1.5 leading-tight">
        {name}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mb-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-surface-alt text-text-muted font-light border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {movementTitle && (
        <p className="text-[11px] text-text-muted/70 font-light leading-tight max-w-[140px] mx-auto">
          {movementTitle}
        </p>
      )}
    </div>
  );
}
