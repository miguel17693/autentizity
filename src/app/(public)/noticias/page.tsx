import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { formatDate, stripHtml } from "@/lib/utils";
import type { News } from "@/lib/types";
import { getNoticias } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";
  const isPreview = isAdmin && cookieStore.get("preview_mode")?.value === "on";
  let noticias: News[] = [];
  let dataError = false;
  try {
    noticias = await getNoticias();
  } catch (e) {
    console.error("NoticiasPage data fetch error:", e);
    dataError = true;
  }
  const items = isPreview ? noticias : noticias.filter((n) => n.status === "published");

  return (
    <>
      {dataError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm text-center py-2 px-4">
          ⚠️ Error conectando con la base de datos. Las noticias no están disponibles temporalmente.
        </div>
      )}
      {/* Hero banner */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-tertiary" />
            <span className="text-tertiary text-[12px] font-medium tracking-[0.15em] uppercase">
              Actualidad
            </span>
            <div className="w-8 h-[1px] bg-tertiary" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em]">
            Noticias
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Toda la actualidad del ecosistema AutentiZity, organizaciones y
            personas que impulsan la autenticidad en sus lugares de trabajo
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          {items.length === 0 ? (
            <p className="text-text-secondary text-center py-20 font-light">
              No hay noticias publicadas todavía
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-8 -mx-5 sm:mx-0">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticias/${item.slug}`}
                  className={`group block bg-white border hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 rounded-2xl ${item.status === "draft" ? "border-secondary border-dashed relative" : "border-border-light"}`}
                >
                  {item.status === "draft" && (
                    <div className="absolute top-4 right-4 z-10 bg-secondary text-white text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1">
                      Borrador
                    </div>
                  )}
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium tracking-[0.1em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-2.5 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-text-muted text-xs font-light mb-2">
                      {formatDate(item.publishedAt)}
                    </p>
                    <h2 className="font-serif text-xl text-primary font-normal leading-tight group-hover:text-secondary transition-colors">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-3">
                      {stripHtml(item.excerpt)}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-secondary text-[12px] font-medium tracking-[0.06em] uppercase">
                      Leer más
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
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
