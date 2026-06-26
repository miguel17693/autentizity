"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate, stripHtml } from "@/lib/utils";

export interface CardProps {
  href: string;
  image: string;
  cardImage?: string;
  title: string;
  description: string;
  tags: string[];
  badge?: string;
  featured?: boolean;
  date?: string;
  location?: string;
  status?: string;
  ctaText?: string;
}

export default function Card({
  href,
  image,
  cardImage,
  title,
  description,
  tags,
  badge,
  featured,
  date,
  location,
  status,
  ctaText = "Ver más",
}: CardProps) {
  const isDraft = status === "draft";

  return (
    <Link
      href={href}
      className={`group block bg-white border overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 rounded-2xl ${
        isDraft ? "border-secondary border-dashed" : "border-border-light"
      }`}
    >
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden rounded-2xl">
        {isDraft && (
          <div className="absolute top-4 right-4 z-10 bg-secondary text-white text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1">
            Borrador
          </div>
        )}
        {(cardImage || image) ? (
          <Image
            src={cardImage || image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary" />
        )}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {(badge || featured) && (
          <div className="absolute top-4 left-4 flex gap-2">
            {badge && (
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-secondary/90 backdrop-blur-sm px-3 py-1.5">
                {badge}
              </span>
            )}
            {featured && (
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-3 py-1.5">
                Destacado
              </span>
            )}
          </div>
        )}
        {tags.length > 0 && (
          <div className="absolute bottom-4 right-4 flex gap-2 flex-wrap justify-end">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium tracking-[0.08em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 lg:p-8">
        {date && (
          <div className="flex items-center gap-3 text-text-muted text-xs font-light mb-3">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              {formatDate(date)}
            </span>
            {location && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-muted" />
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  {location}
                </span>
              </>
            )}
          </div>
        )}

        <h2 className="font-serif text-xl lg:text-2xl text-primary font-normal leading-tight group-hover:text-secondary transition-colors">
          {title}
        </h2>

        <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-3">
          {stripHtml(description)}
        </p>

        <div className="mt-5 pt-4 border-t border-border-light flex items-center gap-2 text-secondary text-[12px] font-medium tracking-[0.06em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          {ctaText}
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
