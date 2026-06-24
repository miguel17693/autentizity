import { Suspense } from "react";
import { cookies } from "next/headers";
import Card from "@/components/ui/Card";
import FilterBar from "@/components/ui/FilterBar";
import { getMovimientos } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function MovimientosTodosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";
  const isPreview = isAdmin && cookieStore.get("preview_mode")?.value === "on";

  const allMovimientos = await getMovimientos();
  const published = isPreview
    ? allMovimientos
    : allMovimientos.filter((m) => m.status === "published");

  const allTags = Array.from(new Set(published.flatMap((m) => m.tags))).sort();

  let filtered = published;

  const q = typeof sp.q === "string" ? sp.q : "";
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(lower) ||
        m.description.toLowerCase().includes(lower)
    );
  }

  const tagsParam = typeof sp.tags === "string" ? sp.tags : "";
  if (tagsParam) {
    const tagList = tagsParam.split(",").filter(Boolean);
    filtered = filtered.filter((m) => tagList.some((t) => m.tags.includes(t)));
  }

  const hasFilters = !!(q || tagsParam);

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
            Movimientos Corporativos
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Líneas de acción del ecosistema AutentiZity
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <Suspense>
            <FilterBar variant="movimientos" availableTags={allTags} />
          </Suspense>

          <div className="mt-6 text-xs text-text-muted font-light">
            {filtered.length} resultado{filtered.length !== 1 && "s"}
            {hasFilters && " encontrados"}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 -mx-5 sm:mx-0">
            {filtered.length > 0 ? (
              filtered.map((mov) => (
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
              ))
            ) : (
              <p className="text-text-secondary text-center py-20 font-light col-span-full">
                No se encontraron movimientos
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
