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
    <article className="group h-full w-full max-w-[12.5rem] overflow-hidden rounded-2xl border-2 border-secondary bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-alt">
        {hasPhoto ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1280px) 11rem, (min-width: 1024px) 16vw, (min-width: 640px) 28vw, 42vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary/5">
            <svg
              className="w-9 h-9 text-secondary/50"
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
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-3.5 text-left">
        <p className="mb-1 text-[10px] font-medium tracking-[0.14em] uppercase text-tertiary">
          Embajador/a
        </p>
        <h3 className="font-serif text-lg text-primary font-normal leading-tight">
          {name}
        </h3>

        {description && (
          <p className="mt-1.5 text-sm text-text-secondary font-light leading-snug">
            {description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-light border border-secondary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {movementTitle && (
          <p className="mt-2.5 rounded-xl bg-tertiary/10 px-2.5 py-1.5 text-[11px] text-tertiary font-light leading-snug">
            {movementTitle}
          </p>
        )}
      </div>
    </article>
  );
}
