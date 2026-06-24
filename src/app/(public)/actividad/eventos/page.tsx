import { Suspense } from "react";
import { cookies } from "next/headers";
import Card from "@/components/ui/Card";
import FilterBar from "@/components/ui/FilterBar";
import { getEventos } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function EventosTodosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";
  const isPreview = isAdmin && cookieStore.get("preview_mode")?.value === "on";

  const allEventos = await getEventos();
  const published = isPreview ? allEventos : allEventos.filter((e) => e.status === "published");

  const allTags = Array.from(new Set(published.flatMap((e) => e.tags))).sort();

  let filtered = published;

  const q = typeof sp.q === "string" ? sp.q : "";
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower)
    );
  }

  const tagsParam = typeof sp.tags === "string" ? sp.tags : "";
  if (tagsParam) {
    const tagList = tagsParam.split(",").filter(Boolean);
    filtered = filtered.filter((e) => tagList.some((t) => e.tags.includes(t)));
  }

  const tipo = typeof sp.tipo === "string" ? sp.tipo : "";
  if (tipo && tipo !== "") {
    filtered = filtered.filter((e) => e.type === tipo);
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const fecha = typeof sp.fecha === "string" ? sp.fecha : "";
  if (fecha === "proximos") {
    filtered = filtered.filter((e) => new Date(e.startDate) >= today);
  } else if (fecha === "pasados") {
    filtered = filtered.filter((e) => new Date(e.startDate) < today);
  } else if (fecha === "este-mes") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    filtered = filtered.filter((e) => {
      const d = new Date(e.startDate);
      return d >= startOfMonth && d <= endOfMonth;
    });
  }

  const hasFilters = !!(q || tagsParam || tipo || fecha);

  return (
    <>
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
            Eventos
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Encuentros, foros y experiencias del ecosistema
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <Suspense>
            <FilterBar variant="eventos" availableTags={allTags} />
          </Suspense>

          <div className="mt-6 text-xs text-text-muted font-light">
            {filtered.length} resultado{filtered.length !== 1 && "s"}
            {hasFilters && " encontrados"}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 -mx-5 sm:mx-0">
            {filtered.length > 0 ? (
              filtered.map((event) => (
                <Card
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  image={event.coverImage}
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
              ))
            ) : (
              <p className="text-text-secondary text-center py-20 font-light col-span-full">
                No se encontraron eventos
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
