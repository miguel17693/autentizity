import Link from "next/link";
import Image from "next/image";
import type { Movement, EcosistemaEntity, Activity, News, Event } from "@/lib/types";
import { notFound } from "next/navigation";
import {
  getMovimientoBySlug,
  getEmbajadoresByMovimiento,
  getActividadesByMovimiento,
  getNoticiasByMovimiento,
  getEventosByMovimiento,
} from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function MovimientoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let movimiento: Movement | undefined;
  let embajadores: EcosistemaEntity[] = [];
  let actividades: Activity[] = [];
  let noticias: News[] = [];
  let eventos: Event[] = [];

  try {
    movimiento = await getMovimientoBySlug(slug);
  } catch (e) {
    console.error("MovimientoDetailPage fetch error:", e);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-serif text-3xl text-primary font-light mb-4">Error de conexión</h1>
          <p className="text-text-secondary">No se pudo cargar el movimiento. La base de datos no está disponible.</p>
          <Link href="/eventos" className="mt-6 inline-block text-accent text-sm font-medium hover:underline">← Volver a actividad</Link>
        </div>
      </div>
    );
  }

  if (!movimiento) return notFound();

  try {
    [embajadores, actividades, noticias, eventos] = await Promise.all([
      getEmbajadoresByMovimiento(movimiento.id).catch(() => []),
      getActividadesByMovimiento(movimiento.id).catch(() => []),
      getNoticiasByMovimiento(movimiento.id).catch(() => []),
      getEventosByMovimiento(movimiento.id).catch(() => []),
    ]);
  } catch {
    // Silent fallback
  }

  const publishedNoticias = noticias.filter((n) => n.status === "published");
  const publishedEventos = eventos.filter((e) => e.status === "published");
  const publishedActividades = actividades.filter((a) => a.status === "published");

  return (
    <>
      {/* Hero with cover image */}
      <section className="relative aspect-[16/10] sm:aspect-auto sm:h-[50vh] sm:min-h-[360px] flex items-end">
        <Image
          src={movimiento.coverImage || "/images/logo-transparent.png"}
          alt={movimiento.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-12 pb-8 sm:pb-12">
          <div className="flex gap-3 mb-4">
            {movimiento.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium tracking-[0.1em] uppercase text-white bg-accent/80 backdrop-blur-sm px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-white font-light leading-[1.1] max-w-3xl">
            {movimiento.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <p className="text-text-body text-lg leading-relaxed font-light">
                {movimiento.description}
              </p>

              {movimiento.content && (
                <div className="mt-8 text-text-body leading-relaxed font-light">
                  {movimiento.content.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div className="mt-10 flex items-center gap-3 flex-wrap">
                {movimiento.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-muted border border-border px-3 py-1.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Back */}
              <div className="mt-12 pt-8 border-t border-border-light">
                <Link
                  href="/eventos#movimientos"
                  className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Volver a actividad
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 order-1 lg:order-2">
              <div className="lg:sticky lg:top-28 space-y-5 sm:space-y-6">
                {/* Contact */}
                <div className="bg-surface-alt p-6 sm:p-8 space-y-5 sm:space-y-6">
                  <h3 className="font-serif text-lg text-primary font-normal tracking-[0.04em]">
                    ¿Quieres participar?
                  </h3>
                  <p className="text-text-secondary text-sm font-light">
                    Ponte en contacto con nosotros para saber más sobre este movimiento.
                  </p>
                  <a
                    href="mailto:comunidad@autentizity.org"
                    className="block w-full text-center px-6 py-3.5 bg-accent text-white rounded-full text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-accent-light transition-all"
                  >
                    Enviar email
                  </a>
                </div>

                {/* Related sections */}
                {embajadores.length > 0 && (
                  <div className="bg-white border border-border-light rounded-2xl p-6 sm:p-8">
                    <h3 className="font-serif text-sm text-primary font-normal tracking-[0.04em] mb-4">
                      Embajadores
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {embajadores.map((emb) => (
                        <div key={emb.id} className="text-center">
                          {emb.logo_url ? (
                            <Image
                              src={emb.logo_url}
                              alt={emb.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover mx-auto border border-border"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-surface-alt border border-border flex items-center justify-center mx-auto">
                              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                            </div>
                          )}
                          <p className="text-xs text-text-secondary mt-1 font-light max-w-[64px] truncate">
                            {emb.name}
                          </p>
                          {emb.description && (
                            <p className="text-[9px] text-text-muted mt-0.5 max-w-[64px] truncate italic">
                              {emb.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Related — full width sections */}
          {(publishedNoticias.length > 0 || publishedEventos.length > 0 || publishedActividades.length > 0) && (
            <div className="mt-16 lg:mt-24 space-y-16">
              {publishedEventos.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="brand-line" />
                    <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Eventos</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publishedEventos.slice(0, 4).map((ev) => (
                      <Link
                        key={ev.id}
                        href={`/eventos/${ev.slug}`}
                        className="group block bg-white border border-border-light rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <Image src={ev.coverImage} alt={ev.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-serif text-base text-primary font-normal group-hover:text-accent transition-colors">
                            {ev.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {publishedNoticias.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="brand-line" />
                    <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Noticias</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publishedNoticias.slice(0, 4).map((n) => (
                      <Link
                        key={n.id}
                        href={`/noticias/${n.slug}`}
                        className="group block bg-white border border-border-light rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <Image src={n.coverImage} alt={n.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-serif text-base text-primary font-normal group-hover:text-accent transition-colors">
                            {n.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {publishedActividades.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="brand-line" />
                    <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Actividades</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publishedActividades.slice(0, 4).map((act) => (
                      <div key={act.id} className="bg-white border border-border-light rounded-2xl overflow-hidden">
                        {act.coverImage && (
                          <div className="relative h-40 overflow-hidden">
                            <Image src={act.coverImage} alt={act.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-serif text-base text-primary font-normal">{act.title}</h4>
                          {act.description && (
                            <p className="text-text-secondary text-sm mt-2 line-clamp-2">{act.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
