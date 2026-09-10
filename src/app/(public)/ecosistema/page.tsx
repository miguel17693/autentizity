import ScrollReveal from "@/components/ui/ScrollReveal";
import Section from "@/components/ui/Section";
import Image from "next/image";
import type { Metadata } from "next";
import AmbassadorCard from "@/components/ui/AmbassadorCard";
import { stripHtml } from "@/lib/utils";
import {
  getEcosistemaSections,
  getAllEcosistemaEntities,
  getAllMovimientosForEmbajadores,
} from "@/lib/data/store";
import type { Movement } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ecosistema",
  description:
    "Empresas, entidades e instituciones que impulsan la autenticidad en el ecosistema AutentiZity.",
  alternates: { canonical: "https://autentizity.org/ecosistema" },
};

/* ============================================
 * ECOSISTEMA — Dinámico desde base de datos.
 * Las secciones y entidades se gestionan desde /admin/ecosistema
 * ============================================ */

interface Entity {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  tags: string[];
  sort_order: number;
}

interface SectionData {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  entities: Entity[];
}

// --- Helpers ---
function LogoPlaceholder({ name, logo }: { name?: string; logo?: string }) {
  const hasLogo = logo != null && logo !== "";
  const isPng = logo?.endsWith(".png");

  return (
    <div className="flex items-center justify-center h-28 bg-white rounded-2xl border-2 border-secondary shadow-sm hover:shadow-md transition-shadow duration-300 p-5">
      {hasLogo ? (
        <Image src={logo} alt={name ?? ""} width={160} height={64} unoptimized={isPng} className="object-contain max-h-16 max-w-[140px]" />
      ) : (
        <span className="text-text-muted text-xs font-medium tracking-[0.1em] uppercase text-center leading-tight">
          {name ?? "LOGO"}
        </span>
      )}
    </div>
  );
}

export default async function EcosistemaPage() {
  let sections: SectionData[] = [];
  let loadError = false;
  let movementsByEntity: Record<string, Movement[]> = {};

  try {
    const dbSections = await getEcosistemaSections();
    if (dbSections.length > 0) {
      const dbEntities = await getAllEcosistemaEntities();

      // Group entities by section_id
      const entitiesBySection: Record<string, Entity[]> = {};
      for (const e of dbEntities) {
        if (!e.active) continue;
        if (!entitiesBySection[e.section_id]) entitiesBySection[e.section_id] = [];
        entitiesBySection[e.section_id].push({
          id: e.id,
          name: e.name,
          logo_url: e.logo_url,
          description: e.description,
          tags: e.tags || [],
          sort_order: e.sort_order,
        });
      }

      sections = dbSections.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        sort_order: s.sort_order,
        entities: (entitiesBySection[s.id] || []).sort((a, b) => a.sort_order - b.sort_order),
      }));

      try {
        movementsByEntity = await getAllMovimientosForEmbajadores();
      } catch {
        // Movements aren't critical — proceed without them
      }
    }
  } catch {
    loadError = true;
    sections = [];
  }

  const isPortraitSection = (section: SectionData) =>
    section.slug === "embajadores" || section.slug === "consejo-consultivo-impacto-social";

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em]">Ecosistema</h1>
        </div>
      </section>

      {loadError && (
        <p role="alert" className="max-w-3xl mx-auto px-5 py-16 text-center text-text-body">
          No se ha podido cargar el ecosistema. Inténtalo de nuevo más tarde.
        </p>
      )}

      {!loadError && sections.length === 0 && (
        <p className="max-w-3xl mx-auto px-5 py-16 text-center text-text-muted">
          Todavía no hay secciones publicadas en el ecosistema.
        </p>
      )}

      {sections.map((sec, idx) => (
        <Section key={sec.id} id={sec.slug}>
          <section
            id={sec.slug}
            className={`py-12 sm:py-16 lg:py-24 ${idx % 2 === 1 ? "bg-surface-alt" : ""}`}
          >
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
              <ScrollReveal>
                <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] max-w-3xl">
                  {sec.name}
                </h2>
                <div className="brand-line mt-4" />
                {sec.description && (
                  <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-3xl">
                    {stripHtml(sec.description)}
                  </p>
                )}
              </ScrollReveal>
              {isPortraitSection(sec) ? (
                sec.entities.length === 0 ? (
                  <p className="mt-10 text-text-muted">Todavía no hay miembros publicados en esta sección.</p>
                ) : (
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                    {sec.entities.map((e) => (
                      <AmbassadorCard
                        key={e.id}
                        name={e.name}
                        photoUrl={e.logo_url}
                        description={e.description}
                        tags={e.tags || []}
                        movements={movementsByEntity[e.id] || []}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sec.entities.map((e) => (
                    <LogoPlaceholder key={e.id} name={e.name} logo={e.logo_url} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </Section>
      ))}
    </>
  );
}
