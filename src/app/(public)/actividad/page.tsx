import Link from "next/link";
import { cookies } from "next/headers";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { getEventos, getMovimientos, getActividades } from "@/lib/data/store";
import type { Event, Movement, Activity } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ActividadPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";
  const isPreview = isAdmin && cookieStore.get("preview_mode")?.value === "on";

  let eventos: Event[] = [];
  let movimientos: Movement[] = [];
  let actividades: Activity[] = [];
  let dataError = false;

  try {
    eventos = await getEventos();
  } catch (e) {
    console.error("ActividadPage fetch error:", e);
    dataError = true;
  }
  try {
    movimientos = await getMovimientos();
  } catch {
    // fail silently
  }
  try {
    actividades = await getActividades();
  } catch {
    // fail silently
  }

  const eventItems = isPreview ? eventos : eventos.filter((e) => e.status === "published");
  const movItems = isPreview ? movimientos : movimientos.filter((m) => m.status === "published");
  const actItems = isPreview ? actividades : actividades.filter((a) => a.status === "published");

  const previewEvents = eventItems.slice(0, 2);
  const previewMovs = movItems.slice(0, 2);
  const previewActs = actItems.slice(0, 2);

  return (
    <>
      {dataError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm text-center py-2 px-4">
          ⚠️ Error conectando con la base de datos. Los datos no están disponibles temporalmente.
        </div>
      )}

      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-tertiary" />
            <span className="text-tertiary text-[12px] font-medium tracking-[0.15em] uppercase">
              Agenda
            </span>
            <div className="w-8 h-[1px] bg-tertiary" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em]">
            Actividad
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Descubre los próximos encuentros, foros y experiencias del ecosistema AutentiZity
          </p>
        </div>
      </section>

      {/* ============== MOVIMIENTOS ============== */}
      <Section id="act-movimientos">
        <section id="movimientos" className="py-8 sm:py-12 lg:py-16 bg-surface-alt">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
            <Link href="/actividad/movimientos" className="group/header block">
              <div className="brand-line group-hover/header:w-16 transition-all duration-300 mb-4" />
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] inline-flex items-center gap-3 group-hover/header:text-secondary transition-colors">
                Movimientos
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </h2>
              <p className="mt-4 text-text-body text-base font-light max-w-3xl">
                Líneas de acción del ecosistema AutentiZity
              </p>
              <div className="mt-3 h-[2px] w-0 group-hover/header:w-full bg-primary/10 transition-all duration-500 rounded-full" />
            </Link>

            {previewMovs.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-6 -mx-5 sm:mx-0">
                {previewMovs.map((mov) => (
                  <Card
                    key={mov.id}
                    href={`/movimientos/${mov.slug}`}
                    image={mov.coverImage}
                    cardImage={mov.coverImageCard}
                    title={mov.title}
                    description={mov.description}
                    tags={mov.tags}
                    status={mov.status}
                    ctaText="Ver movimiento"
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-secondary col-span-full text-center py-10 font-light">
                No hay movimientos publicados todavía
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/actividad/movimientos"
                className="inline-flex items-center gap-2 text-primary text-[13px] font-medium tracking-[0.08em] uppercase border-b-2 border-primary pb-0.5 hover:text-secondary hover:border-secondary transition-colors"
              >
                Ver todos los movimientos
                <svg className="w-3.5 h-3.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </Section>

      {/* ============== EVENTOS ============== */}
      <Section id="act-eventos">
        <section id="eventos" className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
            <Link href="/actividad/eventos" className="group/header block">
              <div className="brand-line group-hover/header:w-16 transition-all duration-300 mb-4" />
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] inline-flex items-center gap-3 group-hover/header:text-secondary transition-colors">
                Eventos
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </h2>
              <p className="mt-4 text-text-body text-base font-light max-w-3xl">
                Encuentros, foros y experiencias del ecosistema
              </p>
              <div className="mt-3 h-[2px] w-0 group-hover/header:w-full bg-primary/10 transition-all duration-500 rounded-full" />
            </Link>

            {previewEvents.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-6 -mx-5 sm:mx-0">
                {previewEvents.map((event) => (
                  <Card
                    key={event.id}
                    href={`/eventos/${event.slug}`}
                    image={event.coverImage}
                    cardImage={event.coverImageCard}
                    title={event.title}
                    description={event.description}
                    tags={event.tags}
                    badge={event.type}
                    featured={event.featured}
                    date={event.startDate}
                    location={event.location}
                    status={event.status}
                    ctaText="Ver evento"
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-20 font-light">
                No hay eventos publicados todavía
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/actividad/eventos"
                className="inline-flex items-center gap-2 text-primary text-[13px] font-medium tracking-[0.08em] uppercase border-b-2 border-primary pb-0.5 hover:text-secondary hover:border-secondary transition-colors"
              >
                Ver todos los eventos
                <svg className="w-3.5 h-3.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </Section>

      {/* ============== ACTIVIDADES ============== */}
      <Section id="act-actividades">
        <section id="actividades" className="py-8 sm:py-12 lg:py-16 bg-surface-alt">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
            <Link href="/actividad/actividades" className="group/header block">
              <div className="brand-line group-hover/header:w-16 transition-all duration-300 mb-4" />
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] inline-flex items-center gap-3 group-hover/header:text-secondary transition-colors">
                Actividades
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </h2>
              <p className="mt-4 text-text-body text-base font-light max-w-3xl">
                Otras actividades del ecosistema
              </p>
              <div className="mt-3 h-[2px] w-0 group-hover/header:w-full bg-primary/10 transition-all duration-500 rounded-full" />
            </Link>

            {previewActs.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-6 -mx-5 sm:mx-0">
                {previewActs.map((act) => (
                  <Card
                    key={act.id}
                    href={`/actividades/${act.slug}`}
                    image={act.coverImage}
                    cardImage={act.coverImageCard}
                    title={act.title}
                    description={act.description}
                    tags={act.tags}
                    status={act.status}
                    ctaText="Ver actividad"
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-secondary col-span-full text-center py-10 font-light">
                No hay actividades publicadas todavía
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/actividad/actividades"
                className="inline-flex items-center gap-2 text-primary text-[13px] font-medium tracking-[0.08em] uppercase border-b-2 border-primary pb-0.5 hover:text-secondary hover:border-secondary transition-colors"
              >
                Ver todas las actividades
                <svg className="w-3.5 h-3.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </Section>
    </>
  );
}
