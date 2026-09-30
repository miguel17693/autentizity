import { describe, expect, it } from "vitest";
import { getEcosistemaAnchor, isCouncilSection, isPortraitSection } from "@/lib/ecosistema-sections";

describe("ecosistema section classification", () => {
  it.each([
    { id: "eco-consejo-consultivo", slug: "renamed-council", anchor: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social", anchor: "consejo-consultivo-impacto-social" },
    { id: "fixture-council", slug: "consejo-consultivo-impacto-social", anchor: "consejo-consultivo-impacto-social" },
    { id: "eco-embajadores", slug: "renamed-ambassadors", anchor: "renamed-ambassadors" },
    { id: "fixture-company", slug: "empresas-impulsoras", anchor: "empresas-impulsoras" },
  ])("keeps the navigation anchor stable for $id", (section) => {
    expect(getEcosistemaAnchor(section)).toBe(section.anchor);
  });
  it.each([
    { id: "eco-consejo-consultivo", slug: "renamed-council" },
    { id: "eco-embajadores", slug: "renamed-ambassadors" },
  ])("recognizes portrait section $id after a slug edit", (section) => {
    expect(isPortraitSection(section)).toBe(true);
    expect(isCouncilSection(section)).toBe(section.id === "eco-consejo-consultivo");
  });

  it.each([
    { id: "fixture-company", slug: "empresas-impulsoras", name: "Consejo Consultivo de Impacto Social" },
    { id: "fixture-unrelated", slug: "otro-consejo-consultivo-de-impacto-social", name: "Consejo" },
  ])("does not classify organizations by fuzzy names or slugs: $id", (section) => {
    expect(isCouncilSection(section)).toBe(false);
    expect(isPortraitSection(section)).toBe(false);
  });
  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
  ])("recognizes council $id as people", (section) => {
    expect(isCouncilSection(section)).toBe(true);
    expect(isPortraitSection(section)).toBe(true);
  });
});
