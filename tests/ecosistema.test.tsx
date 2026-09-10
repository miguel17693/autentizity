import type { ReactNode, ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EcosistemaPage from "@/app/(public)/ecosistema/page";
import AmbassadorCard from "@/components/ui/AmbassadorCard";
import type { EcosistemaSection } from "@/lib/types";

import AdminEcosistemaPage from "@/app/admin/ecosistema/page";

const state = vi.hoisted(() => ({ values: [] as unknown[] }));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useState: (initial: unknown) => actual.useState(state.values.length ? state.values.shift() : initial) };
});
vi.mock("@/components/admin/ImageUpload", () => ({ default: ({ label, aspect, value }: { label: string; aspect: number; value: string }) => <div data-image-label={label} data-aspect={aspect} data-value={value} /> }));
vi.mock("@/components/admin/MultiSelectCheckbox", () => ({ default: () => null }));

const store = vi.hoisted(() => ({
  getEcosistemaSections: vi.fn(),
  getAllEcosistemaEntities: vi.fn(),
  getAllMovimientosForEmbajadores: vi.fn(),
}));
vi.mock("@/lib/data/store", () => store);
vi.mock("@/components/ui/Section", () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/ui/ScrollReveal", () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock("next/image", () => ({ default: ({ fill, unoptimized, ...props }: ComponentProps<"img"> & { fill?: boolean; unoptimized?: boolean }) => <img {...props} data-original={unoptimized} /> }));

const ambassadors: EcosistemaSection = {
  id: "eco-embajadores", name: "Embajadores", slug: "embajadores", description: "Texto administrable", sort_order: 4, active: true,
};

beforeEach(() => {
  state.values = [];
  vi.clearAllMocks();
  store.getEcosistemaSections.mockResolvedValue([]);
  store.getAllEcosistemaEntities.mockResolvedValue([]);
  store.getAllMovimientosForEmbajadores.mockResolvedValue({});
});

describe("Council administration", () => {
  it("uses the existing entity form with square photo uploads for council members", () => {
    const council = { ...ambassadors, id: "eco-consejo-consultivo", name: "Consejo Consultivo de Impacto Social", slug: "consejo-consultivo-impacto-social" };
    state.values = [[council], false, null, false, {}, { section_id: council.id, name: "Miembro de prueba", logo_url: "/portrait-original.jpg" }, false, [], [], ""];
    const html = renderToStaticMarkup(<AdminEcosistemaPage />);
    expect(html).toContain('data-image-label="Foto"');
    expect(html).toContain('data-aspect="1"');
    expect(html).toContain('data-value="/portrait-original.jpg"');
    expect(html).toContain("Añadir miembro");
  });
});

describe("Ambassador portraits", () => {
  it("uses a circular portrait with a thin brand-green ring and original natural colour", () => {
    const html = renderToStaticMarkup(<AmbassadorCard name="Retrato de prueba" photoUrl="/original.jpg" description="Profesión" tags={["Inclusión"]} movements={[]} />);
    expect(html).toMatch(/class="[^"]*aspect-square[^"]*rounded-full[^"]*border border-primary[^"]*"/);
    expect(html).toContain('src="/original.jpg"');
    expect(html).toContain('data-original="true"');
    expect(html).not.toMatch(/gradient|grayscale|sepia/);
    expect(html).toContain("Profesión");
    expect(html).toContain("Inclusión");
  });
});

describe("Ecosistema public data", () => {
  it("respects admin section order including portrait sections", async () => {
    store.getEcosistemaSections.mockResolvedValue([
      { ...ambassadors, id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social", name: "Consejo Consultivo de Impacto Social", sort_order: 1 },
      { ...ambassadors, id: "eco-empresas", slug: "empresas-impulsoras", name: "Empresas Impulsoras", sort_order: 2 },
    ]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html.indexOf('id="consejo-consultivo-impacto-social"')).toBeLessThan(html.indexOf('id="empresas-impulsoras"'));
  });

  it("renders council members as portraits using generic entities and admin text", async () => {
    store.getEcosistemaSections.mockResolvedValue([{ ...ambassadors, id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social", name: "Consejo Consultivo de Impacto Social" }]);
    store.getAllEcosistemaEntities.mockResolvedValue([
      { id: "fixture-member", section_id: "eco-consejo-consultivo", name: "Miembro de prueba", logo_url: "/fixture-portrait.jpg", description: "Universidad de prueba", tags: ["Investigación"], sort_order: 1, active: true },
      { id: "fixture-hidden", section_id: "eco-consejo-consultivo", name: "Miembro oculto", logo_url: "", description: "", tags: [], sort_order: 2, active: false },
    ]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html).toContain('id="consejo-consultivo-impacto-social"');
    expect(html).toContain("<article");
    expect(html).toContain("Universidad de prueba");
    expect(html).toContain("Investigación");
    expect(html).toContain("Texto administrable");
    expect(html).toContain('src="/fixture-portrait.jpg"');
    expect(html).not.toContain("Miembro oculto");
  });

  it("shows an honest empty state without fabricated ambassadors", async () => {
    store.getEcosistemaSections.mockResolvedValue([ambassadors]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html).not.toContain("Embajador/a");
    expect(html).not.toContain("<article");
    expect(html).toContain("Todavía no hay miembros publicados en esta sección.");
    expect(html).toContain("Texto administrable");
  });

  it("distinguishes an empty database from a connection failure", async () => {
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html).toContain("Todavía no hay secciones publicadas en el ecosistema.");
    expect(html).not.toContain('role="alert"');
    expect(html).not.toContain("/logos/");
  });

  it("reports a database error instead of showing fictional logos", async () => {
    store.getEcosistemaSections.mockRejectedValue(new Error("DB unavailable"));
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html).toContain('role="alert"');
    expect(html).toContain("No se ha podido cargar el ecosistema");
    expect(html).not.toContain("ManpowerGroup");
    expect(html).not.toContain("Embajador/a");
    expect(html).not.toContain("DB unavailable");
  });
});
