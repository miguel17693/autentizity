import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { formatDate } from "@/lib/utils";
import Section from "@/components/ui/Section";
import type { Event, Movement } from "@/lib/types";
import { getEventos, getMovimientos } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";
  const isPreview = isAdmin && cookieStore.get("preview_mode")?.value === "on";
  let eventos: Event[] = [];
  let movimientos: Movement[] = [];
  let dataError = false;
  try {
    [eventos, movimientos] = await Promise.all([
      getEventos(),
      getMovimientos(),
    ]);
  } catch (e) {
    console.error("EventosPage data fetch error:", e);
    dataError = true;
  }
  const items = isPreview ? eventos : eventos.filter((e) => e.status === "published");
  const movItems = isPreview ? movimientos : movimientos.filter((m) => m.status === "published");

  return (
    <>
      {dataError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm text-center py-2 px-4">
          ⚠️ Error conectando con la base de datos. Los datos no están disponibles temporalmente.
        </div>
      )}
      {/* Hero banner */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
              Agenda
            </span>
            <div className="w-8 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em] uppercase">
            Actividad
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Descubre los próximos encuentros, foros y experiencias del ecosistema AutentiZity
          </p>
        </div>
      </section>

      <Section id="act-eventos">
      {/* Listing */}
      <section id="eventos" className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          {items.length === 0 ? (
            <p className="text-text-secondary text-center py-20 font-light">
              No hay eventos publicados todavía
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 -mx-5 sm:mx-0">
              {items.map((event) => (
                <Link
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  className={`group block bg-white border overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 ${event.status === "draft" ? "border-secondary border-dashed" : "border-border-light"}`}
                >
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    {event.status === "draft" && (
                      <div className="absolute top-4 right-4 z-10 bg-secondary text-white text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1">
                        Borrador
                      </div>
                    )}
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-accent/90 backdrop-blur-sm px-3 py-1.5">
                        {event.type}
                      </span>
                      {event.featured && (
                        <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-3 py-1.5">
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 text-text-muted text-xs font-light mb-3">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {formatDate(event.startDate)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl lg:text-2xl text-primary font-normal leading-tight group-hover:text-accent transition-colors">
                      {event.title}
                    </h2>
                    <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-5 flex items-center gap-3 flex-wrap">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-muted border border-border px-2.5 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      </Section>

      <Section id="act-movimientos">
      {/* ============== MOVIMIENTOS ============== */}
      <section id="movimientos" className="py-12 sm:py-16 lg:py-24 bg-surface-alt">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="brand-line" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
              Movimientos
            </span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
            Movimientos
          </h2>
          <p className="mt-4 text-text-body text-base font-light max-w-3xl">
            Líneas de acción del ecosistema AutentiZity
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {movItems.length > 0 ? (
              movItems.map((mov) => (
                <Link
                  key={mov.id}
                  href={`/movimientos/${mov.slug}`}
                  className="group bg-white border border-border-light p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  {mov.coverImage && (
                    <div className="relative h-32 mb-4 overflow-hidden -mx-6 -mt-6">
                      <Image
                        src={mov.coverImage}
                        alt={mov.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-lg text-primary font-normal group-hover:text-accent transition-colors">
                    {mov.title}
                  </h3>
                  <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-5">
                    {mov.description}
                  </p>
                  {mov.tags.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      {mov.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-muted border border-border px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-border-light flex items-center gap-2 text-accent text-[12px] font-medium tracking-[0.06em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver movimiento
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-text-secondary col-span-full text-center py-10 font-light">
                No hay movimientos publicados todavía
              </p>
            )}
          </div>
        </div>
      </section>
      </Section>
    </>
  );
}
