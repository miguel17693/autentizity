import Image from "next/image";
import type { Movement } from "@/lib/types";

interface AmbassadorCardProps {
  name: string;
  photoUrl: string;
  description?: string;
  tags: string[];
  movements: Movement[];
}

export default function AmbassadorCard({ name, photoUrl, description, tags, movements }: AmbassadorCardProps) {
  const hasPhoto = photoUrl != null && photoUrl !== "";
  const movementTitle =
    movements.length > 0
      ? movements.map((m) => m.title).join(", ")
      : null;

  return (
    <article className="group h-full rounded-3xl border border-border-light bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border-light bg-surface-alt">
        {hasPhoto ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="w-12 h-12 text-text-muted"
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
          </div>
        )}
      </div>

      <div className="pt-4 text-left">
        <h3 className="font-serif text-lg text-primary font-normal leading-tight">
          {name}
        </h3>

        {description && (
          <p className="mt-1.5 text-sm text-text-secondary font-light leading-relaxed">
            {description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
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
          <p className="mt-3 text-[11px] text-text-muted/80 font-light leading-relaxed">
            {movementTitle}
          </p>
        )}
      </div>
    </article>
  );
}
