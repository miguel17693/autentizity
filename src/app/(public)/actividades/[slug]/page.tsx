import Link from "next/link";
import Image from "next/image";
import type { Activity, Movement } from "@/lib/types";
import { notFound } from "next/navigation";
import { getActividadBySlug, getMovimientosByActividad } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function ActividadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let actividad: Activity | undefined;
  let movimientos: Movement[] = [];

  try {
    actividad = await getActividadBySlug(slug);
    if (actividad) {
      movimientos = await getMovimientosByActividad(actividad.id).catch(() => []);
    }
  } catch (e) {
    console.error("ActividadDetailPage fetch error:", e);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-serif text-3xl text-primary font-light mb-4">Error de conexión</h1>
          <p className="text-text-secondary">No se pudo cargar la actividad.</p>
          <Link href="/eventos" className="mt-6 inline-block text-accent text-sm font-medium hover:underline">← Volver a actividad</Link>
        </div>
      </div>
    );
  }

  if (!actividad) return notFound();

  const publishedMovimientos = movimientos.filter((m) => m.status === "published");

  return (
    <>
      <section className="relative aspect-[16/10] sm:aspect-auto sm:h-[50vh] sm:min-h-[360px] flex items-end">
        <Image src={actividad.coverImage || "/images/logo-transparent.png"} alt={actividad.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-12 pb-8 sm:pb-12">
          <div className="flex gap-3 mb-4">
            {actividad.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium tracking-[0.1em] uppercase text-white bg-accent/80 backdrop-blur-sm px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-white font-light leading-[1.1] max-w-3xl">{actividad.title}</h1>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-5 sm:px-6 lg:px-12">
          <p className="text-text-body text-lg leading-relaxed font-light">{actividad.description}</p>

          {actividad.content && (
            <div className="mt-8 text-text-body leading-relaxed font-light">
              {actividad.content.split("\n").map((paragraph, i) => <p key={i} className="mb-4">{paragraph}</p>)}
            </div>
          )}

          <div className="mt-10 flex items-center gap-3 flex-wrap">
            {actividad.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-muted border border-border px-3 py-1.5 rounded-full">{tag}</span>
            ))}
          </div>

          {publishedMovimientos.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border-light">
              <div className="flex items-center gap-4 mb-6">
                <div className="brand-line" />
                <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Movimientos relacionados</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedMovimientos.map((mov) => (
                  <Link key={mov.id} href={`/movimientos/${mov.slug}`} className="group block bg-white border border-border-light p-5 hover:shadow-md transition-shadow rounded-2xl">
                    <h3 className="font-serif text-lg text-primary font-normal group-hover:text-accent transition-colors">{mov.title}</h3>
                    <p className="text-text-secondary text-sm mt-2 line-clamp-2">{mov.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-border-light">
            <Link href="/eventos" className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Volver a actividad
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
