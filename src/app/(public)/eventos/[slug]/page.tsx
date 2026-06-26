import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { formatDate, formatDateTime, renderRichText, stripHtml } from "@/lib/utils";
import type { Event, Movement } from "@/lib/types";
import { notFound } from "next/navigation";
import { getEventoBySlug, getMovimiento } from "@/lib/data/store";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const evento = await getEventoBySlug(slug);
    if (!evento) return { title: "Evento no encontrado" };
    return {
      title: evento.title,
      description: stripHtml(evento.description).slice(0, 160),
      alternates: { canonical: `https://autentizity.org/eventos/${evento.slug}` },
      openGraph: {
        title: evento.title,
        description: stripHtml(evento.description).slice(0, 160),
        images: evento.coverImage ? [{ url: evento.coverImage, width: 1200, height: 630 }] : [],
        type: "article",
      },
    };
  } catch {
    return { title: "Evento" };
  }
}

function getRegistrationLabel(type: string) {
  switch (type) {
    case "virtual":
      return "Unirse por Zoom";
    case "presencial":
      return "Reservar en Eventbrite";
    case "híbrido":
      return "Inscribirse";
    default:
      return "Inscríbete";
  }
}

export default async function EventoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let evento: Event | undefined;
  let movimiento: Movement | undefined;
  try {
    evento = await getEventoBySlug(slug);
    if (evento?.movimientoId) {
      movimiento = await getMovimiento(evento.movimientoId);
    }
  } catch (e) {
    console.error("EventoDetailPage fetch error:", e);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-serif text-3xl text-primary font-light mb-4">Error de conexión</h1>
          <p className="text-text-secondary">No se pudo cargar el evento. La base de datos no está disponible.</p>
          <Link href="/eventos" className="mt-6 inline-block text-secondary text-sm font-medium hover:underline">← Volver a eventos</Link>
        </div>
      </div>
    );
  }

  if (!evento) return notFound();

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.title,
    startDate: evento.startDate,
    endDate: evento.endDate || evento.startDate,
    location: { "@type": "Place", name: evento.location },
    description: stripHtml(evento.description).slice(0, 5000),
    image: evento.coverImage,
    organizer: { "@type": "Organization", name: evento.organizer || "AutentiZity", url: "https://autentizity.org" },
    eventStatus: evento.status === "cancelled" ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {/* Hero with cover image */}
      <section className="relative aspect-[16/10] sm:aspect-auto sm:h-[50vh] sm:min-h-[360px] flex items-end">
        <Image
          src={evento.coverImageHero || evento.coverImage}
          alt={evento.title}
          fill
          priority
          className="object-cover sm:hidden"
        />
        <Image
          src={evento.coverImageHeroDesktop || evento.coverImageHero || evento.coverImage}
          alt={evento.title}
          fill
          priority
          className="object-cover hidden sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-12 pb-8 sm:pb-12">
          {movimiento && (
            <Link
              href={`/movimientos/${movimiento.slug}`}
              className="inline-block text-[11px] font-medium tracking-[0.1em] uppercase text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 mb-3 hover:bg-white/20 transition-colors"
            >
              Movimiento: {movimiento.title}
            </Link>
          )}
          <div className="flex gap-3 mb-4">
            <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-secondary/90 backdrop-blur-sm px-3 py-1.5">
              {evento.type}
            </span>
            {evento.status === "cancelled" && (
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-red-600/80 backdrop-blur-sm px-3 py-1.5">
                Cancelado
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-white font-light leading-[1.1] max-w-3xl">
            {evento.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div
                className="text-text-body text-lg leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: renderRichText(evento.description) }}
              />

              {evento.content && (
                <div
                  className="mt-8 text-text-body leading-relaxed font-light"
                  dangerouslySetInnerHTML={{ __html: renderRichText(evento.content) }}
                />
              )}

              {!evento.content && (
                <div className="mt-12 p-8 bg-surface-alt text-center">
                  <p className="text-text-secondary font-light">
                    Más información sobre este evento estará disponible próximamente
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="mt-10 flex items-center gap-3 flex-wrap">
                {evento.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium tracking-[0.08em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Back */}
              <div className="mt-12 pt-8 border-t border-border-light">
                <Link
                  href="/eventos"
                  className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Volver a eventos
                </Link>
              </div>
            </div>

            {/* Sidebar — event details */}
            <aside className="lg:col-span-1 order-1 lg:order-2">
              <div className="lg:sticky lg:top-28 bg-surface-alt p-6 sm:p-8 space-y-5 sm:space-y-6">
                <h3 className="font-serif text-lg text-primary font-normal tracking-[0.04em]">
                  Detalles
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <div>
                      <p className="text-text-muted text-xs font-light uppercase tracking-[0.06em]">Fecha</p>
                      <p className="text-text-body text-sm font-light mt-0.5">{formatDateTime(evento.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                    <div>
                      <p className="text-text-muted text-xs font-light uppercase tracking-[0.06em]">Ubicación</p>
                      <p className="text-text-body text-sm font-light mt-0.5">{evento.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <div>
                      <p className="text-text-muted text-xs font-light uppercase tracking-[0.06em]">Organiza</p>
                      <p className="text-text-body text-sm font-light mt-0.5">{evento.organizer}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                    <div>
                      <p className="text-text-muted text-xs font-light uppercase tracking-[0.06em]">Modalidad</p>
                      <p className="text-text-body text-sm font-light mt-0.5 capitalize">{evento.type}</p>
                    </div>
                  </div>
                </div>

                {/* Registration CTA */}
                {evento.status !== "cancelled" && evento.registrationUrl && (
                  <a
                    href={evento.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3.5 bg-secondary text-white rounded-full text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-secondary-light transition-all"
                  >
                    {getRegistrationLabel(evento.type)}
                  </a>
                )}

                {evento.status === "cancelled" && (
                  <div className="text-center py-3.5 bg-red-50 text-red-600 text-[13px] font-medium tracking-[0.08em] uppercase">
                    Evento cancelado
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
