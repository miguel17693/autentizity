import type { EcosistemaEntity, EcosistemaSection } from "@/lib/types";

export function groupMovementParticipants(
  entities: EcosistemaEntity[],
  sections: EcosistemaSection[],
) {
  return [...sections]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((section) => ({
      section,
      entities: entities.filter((entity) => entity.section_id === section.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((group) => group.entities.length > 0);
}
