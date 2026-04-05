import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { News } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getNoticias(): Promise<News[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/noticias`, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch {
    const { mockNews } = await import("@/lib/data/mock");
    return mockNews;
  }
}

export default async function NoticiasPage() {
  const noticias = await getNoticias();
  const published = noticias.filter((n) => n.status === "published");

  return (
    <>
      {/* Hero banner */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
              Actualidad
            </span>
            <div className="w-8 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em] uppercase">
            Noticias
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Toda la actualidad del ecosistema AutentiZity y la transformación de la cultura empresarial.
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          {published.length === 0 ? (
            <p className="text-text-secondary text-center py-20 font-light">
              No hay noticias publicadas todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {published.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticias/${item.slug}`}
                  className="group block bg-white border border-border-light hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium tracking-[0.1em] uppercase text-white bg-accent/80 backdrop-blur-sm px-2.5 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-text-muted text-xs font-light mb-2">
                      {formatDate(item.publishedAt)}
                    </p>
                    <h2 className="font-serif text-xl text-primary font-normal leading-tight group-hover:text-accent transition-colors">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-accent text-[12px] font-medium tracking-[0.06em] uppercase">
                      Leer más
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
