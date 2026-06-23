import ScrollReveal from "@/components/ui/ScrollReveal";
import Section from "@/components/ui/Section";
import Image from "next/image";
import {
  getEcosistemaSections,
  getAllEcosistemaEntities,
} from "@/lib/data/store";

export const dynamic = "force-dynamic";

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
    <div className="flex items-center justify-center h-20 bg-white rounded-2xl border border-border-light px-6">
      {hasLogo ? (
        <Image src={logo} alt={name ?? ""} width={120} height={48} unoptimized={isPng} className="object-contain max-h-12 max-w-[120px]" />
      ) : (
        <span className="text-text-muted text-xs font-medium tracking-[0.1em] uppercase text-center leading-tight">
          {name ?? "LOGO"}
        </span>
      )}
    </div>
  );
}

function AvatarPlaceholder({ name, logo, description }: { name: string; logo?: string; description?: string }) {
  const hasPhoto = logo != null && logo !== "";
  const isPng = logo?.endsWith(".png");
  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-surface-alt border border-border flex items-center justify-center mb-3 overflow-hidden">
        {hasPhoto ? (
          <Image src={logo} alt={name} width={96} height={96} unoptimized={isPng} className="object-cover w-full h-full" />
        ) : (
          <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        )}
      </div>
      <p className="text-text-secondary text-sm font-light">{name}</p>
      {description && (
        <p className="text-text-muted text-[11px] font-light mt-0.5 italic leading-tight max-w-[120px] mx-auto">{description}</p>
      )}
    </div>
  );
}

// Hardcoded fallback — usado solo si no hay datos en la DB aún
const FALLBACK_SECTIONS: SectionData[] = [
  {
    id: "eco-empresas",
    name: "Empresas Impulsoras",
    slug: "empresas-impulsoras",
    description: "Empresas que no se conforman con la cultura que tienen, sino que construyen la que quieren. Organizaciones que entienden que el cambio real empieza dentro… y se proyecta fuera",
    sort_order: 1,
    entities: [
      { id: "manpower", name: "ManpowerGroup", logo_url: "/logos/manpower.svg", description: "", tags: [], sort_order: 1 },
      { id: "corteingles", name: "El Corte Inglés", logo_url: "/logos/corteingles.svg", description: "", tags: [], sort_order: 2 },
      { id: "msd", name: "MSD", logo_url: "/logos/msd.svg", description: "", tags: [], sort_order: 3 },
      { id: "haleon", name: "Haleon", logo_url: "/logos/haleon.svg", description: "", tags: [], sort_order: 4 },
      { id: "legalitas", name: "Legálitas Fundación", logo_url: "/logos/legalitas.svg", description: "", tags: [], sort_order: 5 },
    ],
  },
  {
    id: "eco-entidades",
    name: "Entidades Colaboradoras",
    slug: "entidades-colaboradoras",
    description: "Organizaciones que promueven el bienestar, la inclusión y entornos de trabajo más humanos. Porque somos personas en todos los ámbitos de nuestra vida, también en nuestros lugares de trabajo",
    sort_order: 2,
    entities: [
      { id: "papageno", name: "PAPAGENO", logo_url: "/logos/papageno.png", description: "", tags: [], sort_order: 1 },
      { id: "fundaciononce", name: "Fundación ONCE", logo_url: "/logos/fundaciononce.png", description: "", tags: [], sort_order: 2 },
      { id: "itgetsbetter", name: "It Gets Better España", logo_url: "/logos/itgetsbetter.png", description: "", tags: [], sort_order: 3 },
      { id: "trabajandoenpositivo", name: "Trabajando en Positivo", logo_url: "/logos/trabajandoenpositivo.png", description: "", tags: [], sort_order: 4 },
    ],
  },
  {
    id: "eco-instituciones",
    name: "Instituciones, Cámaras de Comercio y Asociaciones Corporativas",
    slug: "instituciones",
    description: "Cuando lo público y lo privado dejan de ir en paralelo y empiezan a avanzar juntos, el impacto se multiplica. Aquí es donde nacen los cambios que transforman empresas, ciudades y formas de vivir el trabajo",
    sort_order: 3,
    entities: [
      { id: "aytomadrid", name: "Ayuntamiento de Madrid\n(Área de Familias, Igualdad y Bienestar Social)", logo_url: "/logos/aytomadrid.png", description: "", tags: [], sort_order: 1 },
      { id: "icam", name: "Ilustre Colegio de la Abogacía de Madrid", logo_url: "/logos/icam.png", description: "", tags: [], sort_order: 2 },
      { id: "ccce", name: "Cámara de Comercio Canadá España", logo_url: "/logos/ccce.png", description: "", tags: [], sort_order: 3 },
    ],
  },
];

export default async function EcosistemaPage() {
  // Fetch from DB; if empty or error, use fallback
  let sections: SectionData[] = FALLBACK_SECTIONS;

  try {
    const dbSections = await getEcosistemaSections();
    if (dbSections.length > 0) {
      const dbEntities = await getAllEcosistemaEntities();

      // Group entities by section_id
      const entitiesBySection: Record<string, Entity[]> = {};
      for (const e of dbEntities) {
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
    }
  } catch {
    // Fallback silently — DB not available or not seeded yet
  }

  // Separate "embajadores" section from logos sections
  const embajadoresSection = sections.find((s) => s.slug === "embajadores");
  const logoSections = sections.filter((s) => s.slug !== "embajadores");

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-tertiary" />
            <span className="text-tertiary text-[12px] font-medium tracking-[0.15em] uppercase">Ecosistema</span>
            <div className="w-8 h-[1px] bg-tertiary" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em]">Ecosistema</h1>
        </div>
      </section>

      {/* Secciones dinámicas de logos */}
      {logoSections.map((sec, idx) => (
        <Section key={sec.id} id={sec.slug}>
          <section
            id={sec.slug}
            className={`py-12 sm:py-16 lg:py-24 ${idx % 2 === 1 ? "bg-surface-alt" : ""}`}
          >
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-4">
                  <div className="brand-line" />
                  <span className="text-tertiary text-[12px] font-medium tracking-[0.15em] uppercase">
                    {sec.name}
                  </span>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] max-w-3xl">
                  {sec.name}
                </h2>
                {sec.description && (
                  <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-3xl">
                    {sec.description}
                  </p>
                )}
              </ScrollReveal>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {sec.entities.map((e) => (
                  <LogoPlaceholder key={e.id} name={e.name} logo={e.logo_url} />
                ))}
              </div>
            </div>
          </section>
        </Section>
      ))}

      {/* Embajadores (sección especial sin logos) */}
      {embajadoresSection && (
        <Section key={embajadoresSection.id} id={embajadoresSection.slug}>
          <section
            id={embajadoresSection.slug}
            className="py-12 sm:py-16 lg:py-24 bg-surface-alt"
          >
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-4">
                  <div className="brand-line" />
                  <span className="text-tertiary text-[12px] font-medium tracking-[0.15em] uppercase">
                    Embajadores
                  </span>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] max-w-3xl">
                  Embajadores
                </h2>
                {embajadoresSection.description && (
                  <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-3xl">
                    {embajadoresSection.description}
                  </p>
                )}
              </ScrollReveal>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {(embajadoresSection.entities.length > 0
                  ? embajadoresSection.entities
                  : Array.from({ length: 8 }, (_, i) => ({
                      id: `emb-${i + 1}`,
                      name: `Embajador/a ${i + 1}`,
                      logo_url: "",
                      description: "",
                      tags: [] as string[],
                      sort_order: i,
                    }))
                ).map((e) => (
                  <AvatarPlaceholder key={e.id} name={e.name} logo={e.logo_url} description={e.description || (e.tags && e.tags.length > 0 ? e.tags.slice(0, 3).join(", ") : undefined)} />
                ))}
              </div>
            </div>
          </section>
        </Section>
      )}
    </>
  );
}
