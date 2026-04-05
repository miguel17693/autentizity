import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { News } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getNoticiaBySlug(slug: string): Promise<News | undefined> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/noticias`, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    const noticias: News[] = await res.json();
    return noticias.find((n) => n.slug === slug);
  } catch {
    const { mockNews } = await import("@/lib/data/mock");
    return mockNews.find((n) => n.slug === slug);
  }
}

export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);

  if (!noticia) return notFound();

  return (
    <>
      {/* Hero with cover image */}
      <section className="relative h-[40vh] sm:h-[50vh] min-h-[280px] sm:min-h-[360px] flex items-end">
        <Image
          src={noticia.coverImage}
          alt={noticia.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-12 pb-8 sm:pb-12">
          <div className="flex gap-3 mb-4">
            {noticia.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium tracking-[0.1em] uppercase text-white bg-accent/80 backdrop-blur-sm px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-white font-light leading-[1.1] max-w-3xl uppercase">
            {noticia.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-white/50 text-sm font-light">
            <span>{formatDate(noticia.publishedAt)}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{noticia.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-5 sm:px-6 lg:px-12">
          <p className="text-text-body text-lg leading-relaxed font-light">
            {noticia.excerpt}
          </p>

          {noticia.content && (
            <div className="mt-8 prose prose-lg max-w-none font-light text-text-body leading-relaxed">
              {noticia.content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {!noticia.content && (
            <div className="mt-12 p-8 bg-surface-alt text-center">
              <p className="text-text-secondary font-light">
                El contenido completo de esta noticia estará disponible próximamente.
              </p>
            </div>
          )}

          {/* Back */}
          <div className="mt-16 pt-8 border-t border-border-light">
            <Link
              href="/noticias"
              className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Volver a noticias
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
