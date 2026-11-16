import type { EcosistemaSection } from "@/lib/types";

type SectionIdentity = Pick<EcosistemaSection, "id" | "slug">;

const COUNCIL_ANCHOR = "consejo-consultivo-impacto-social";
const INSTITUTIONS_ANCHOR = "instituciones";

export function isCouncilSection(section: SectionIdentity): boolean {
  return section.id === "eco-consejo-consultivo"
    || section.slug === "consejo-consultivo-impacto-social"
    || section.slug === "consejo-consultivo-de-impacto-social";
}

export function isInstitutionsSection(section: SectionIdentity): boolean {
  return section.id === "eco-instituciones"
    || section.slug === "instituciones"
    || section.slug === "instituciones-fundaciones-camaras-de-comercio-y-asociaciones-corporativas";
}

export function isPortraitSection(section: SectionIdentity): boolean {
  return isCouncilSection(section) || section.id === "eco-embajadores" || section.slug === "embajadores";
}

export function getEcosistemaAnchor(section: SectionIdentity): string {
  if (isCouncilSection(section)) return COUNCIL_ANCHOR;
  if (isInstitutionsSection(section)) return INSTITUTIONS_ANCHOR;
  return section.slug;
}

/** Extra ids that keep legacy and slug-based links working when the anchor is stable. */
export function getEcosistemaAnchorAliases(section: SectionIdentity): string[] {
  const anchor = getEcosistemaAnchor(section);
  const candidates = isCouncilSection(section)
    ? ["consejo-consultivo-de-impacto-social", section.slug]
    : [section.slug];
  return [...new Set(candidates)].filter((alias) => alias && alias !== anchor);
}
