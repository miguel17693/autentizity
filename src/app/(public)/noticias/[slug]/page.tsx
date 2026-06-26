import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { formatDate, renderRichText, stripHtml } from "@/lib/utils";
import type { News, Movement } from "@/lib/types";
import { notFound } from "next/navigation";
import { getNoticiaBySlug, getMovimiento } from "@/lib/data/store";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const noticia = await getNoticiaBySlug(slug);
    if (!noticia) return { title: "Noticia no encontrada" };
    return {
      title: noticia.title,
      description: stripHtml(noticia.excerpt).slice(0, 160),
      alternates: { canonical: `https://autentizity.org/noticias/${noticia.slug}` },
      openGraph: {
        title: noticia.title,
        description: stripHtml(noticia.excerpt).slice(0, 160),
        images: noticia.coverImage ? [{ url: noticia.coverImage, width: 1200, height: 630 }] : [],
        type: "article",
        publishedTime: noticia.publishedAt,
      },
    };
  } catch {
    return { title: "Noticia" };
  }
}

export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let noticia: News | undefined;
  let movimiento: Movement | undefined;
  try {
    noticia = await getNoticiaBySlug(slug);
    if (noticia?.movimientoId) {
      movimiento = await getMovimiento(noticia.movimientoId);
    }
  } catch (e) {
    console.error("NoticiaDetailPage fetch error:", e);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-serif text-3xl text-primary font-light mb-4">Error de conexión</h1>
          <p className="text-text-secondary">No se pudo cargar la noticia. La base de datos no está disponible.</p>
          <Link href="/noticias" className="mt-6 inline-block text-secondary text-sm font-medium hover:underline">← Volver a noticias</Link>
        </div>
      </div>
    );
  }

  if (!noticia) return notFound();

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.title,
    image: noticia.coverImage,
    datePublished: noticia.publishedAt,
    author: { "@type": "Person", name: noticia.author },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
      {/* Hero with cover image */}
      <section className="relative aspect-[16/10] sm:aspect-auto sm:h-[50vh] sm:min-h-[360px] flex items-end">
        <Image
          src={noticia.coverImageHero || noticia.coverImage}
          alt={noticia.title}
          fill
          priority
          className="object-cover sm:hidden"
        />
        <Image
          src={noticia.coverImageHeroDesktop || noticia.coverImageHero || noticia.coverImage}
          alt={noticia.title}
          fill
          priority
          className="object-cover hidden sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-4 right-4 flex gap-2 flex-wrap justify-end z-10">
          {noticia.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium tracking-[0.1em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="relative max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-12 pb-8 sm:pb-12">
          {movimiento && (
            <Link
              href={`/movimientos/${movimiento.slug}`}
              className="inline-block text-[11px] font-medium tracking-[0.1em] uppercase text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 mb-3 hover:bg-white/20 transition-colors"
            >
              Movimiento: {movimiento.title}
            </Link>
          )}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-white font-light leading-[1.1] max-w-3xl">
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
      <article className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-5 sm:px-6 lg:px-12">
          <div
            className="rich-text-content text-lg leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: renderRichText(noticia.excerpt) }}
          />

          {noticia.content && (
            <div
              className="rich-text-content mt-8 font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderRichText(noticia.content) }}
            />
          )}

          {!noticia.content && (
            <div className="mt-12 p-8 bg-surface-alt text-center">
              <p className="text-text-secondary font-light">
                El contenido completo de esta noticia estará disponible próximamente
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
      </article>
    </>
  );
}
