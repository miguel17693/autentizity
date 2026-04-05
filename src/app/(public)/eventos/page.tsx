import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getEventos(): Promise<Event[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/eventos`, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch {
    const { mockEvents } = await import("@/lib/data/mock");
    return mockEvents;
  }
}

export default async function EventosPage() {
  const eventos = await getEventos();
  const published = eventos.filter((e) => e.status === "published");

  return (
    <>
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
            Eventos
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Descubre los próximos encuentros, foros y experiencias del ecosistema AutentiZity.
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          {published.length === 0 ? (
            <p className="text-text-secondary text-center py-20 font-light">
              No hay eventos publicados todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
              {published.map((event) => (
                <Link
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  className="group block bg-white border border-border-light overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="relative h-56 lg:h-64 overflow-hidden">
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
    </>
  );
}
