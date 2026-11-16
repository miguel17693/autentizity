import type { EcosistemaSection } from "@/lib/types";
import { isCouncilSection, isPortraitSection } from "@/lib/ecosistema-sections";

export function getSectionLabels(section?: EcosistemaSection): { singular: string; plural: string } {
  if (section && isCouncilSection(section)) return { singular: "miembro", plural: "Miembros" };
  if (section && isPortraitSection(section)) return { singular: "embajador", plural: "Embajadores" };
  const map: Record<string, { singular: string; plural: string }> = {
    "empresas-impulsoras": { singular: "empresa", plural: "Empresas" },
    "entidades-colaboradoras": { singular: "entidad", plural: "Entidades" },
    instituciones: { singular: "institución", plural: "Instituciones" },
  };
  return map[section?.slug || ""] || { singular: "entidad", plural: "Entidades" };
}
