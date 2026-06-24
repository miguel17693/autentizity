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
  const visibleTags = tags.slice(0, 3);

  return (
    <article className="group h-full w-full max-w-[17rem] overflow-hidden rounded-3xl border border-border-light bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-primary/5 via-surface-alt to-secondary/10">
        {hasPhoto ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="w-14 h-14 text-primary/20"
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
        <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-primary/5 to-transparent opacity-80" />
        <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase text-primary backdrop-blur-sm">
          Embajador/a
        </span>
        {visibleTags.length > 0 && (
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary/85 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 text-left">
        <h3 className="font-serif text-xl text-primary font-normal leading-tight transition-colors group-hover:text-secondary">
          {name}
        </h3>

        {description && (
          <p className="mt-2 text-sm text-text-secondary font-light leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {movementTitle && (
          <div className="mt-4 border-t border-border-light pt-3">
            <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-tertiary">
              Movimientos
            </p>
            <p className="mt-1 text-xs text-text-muted font-light leading-relaxed">
              {movementTitle}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
