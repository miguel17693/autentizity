import type { EcosistemaSection } from "@/lib/types";

type SectionIdentity = Pick<EcosistemaSection, "id" | "slug">;

export function isCouncilSection(section: SectionIdentity): boolean {
  return section.id === "eco-consejo-consultivo"
    || section.slug === "consejo-consultivo-impacto-social"
    || section.slug === "consejo-consultivo-de-impacto-social";
}

export function isPortraitSection(section: SectionIdentity): boolean {
  return isCouncilSection(section) || section.id === "eco-embajadores" || section.slug === "embajadores";
}

export function getEcosistemaAnchor(section: SectionIdentity): string {
  return isCouncilSection(section) ? "consejo-consultivo-impacto-social" : section.slug;
}
