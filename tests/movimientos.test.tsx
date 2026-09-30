import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps } from "react";
import type { EcosistemaEntity, EcosistemaSection, Movement } from "@/lib/types";
import MovimientoDetailPage from "@/app/(public)/movimientos/[slug]/page";

import AdminMovimientosPage from "@/app/admin/movimientos/page";

type SelectorProps = { label: string; items: { id: string; label: string }[]; selectedIds: string[]; onChange: (ids: string[]) => void };
const admin = vi.hoisted(() => ({ states: [] as unknown[], setters: [] as ReturnType<typeof vi.fn>[], selectors: [] as SelectorProps[] }));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useState: (initial: unknown) => {
    if (!admin.states.length) return actual.useState(initial);
    const setter = vi.fn();
    admin.setters.push(setter);
    return [admin.states.shift(), setter];
  } };
});
vi.mock("@/components/admin/ImageUpload", () => ({ default: () => null }));
vi.mock("@/components/admin/RichTextEditor", () => ({ default: () => null }));
vi.mock("@/components/admin/MultiSelectCheckbox", () => ({ default: (props: SelectorProps) => {
  admin.selectors.push(props);
  return <fieldset><legend>{props.label}</legend>{props.items.map((item) => <span key={item.id}>{item.label}</span>)}</fieldset>;
} }));

const data = vi.hoisted(() => ({
  getMovimientoBySlug: vi.fn(), getEmbajadoresByMovimiento: vi.fn(),
  getEcosistemaSections: vi.fn(), getActividadesByMovimiento: vi.fn(),
  getNoticiasByMovimiento: vi.fn(), getEventosByMovimiento: vi.fn(),
}));
vi.mock("@/lib/data/store", () => data);
vi.mock("next/image", () => ({ default: ({ fill, priority, unoptimized, ...props }: ComponentProps<"img"> & { fill?: boolean; priority?: boolean; unoptimized?: boolean }) => <img {...props} /> }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));

const sectionNames = ["Embajadores", "Empresas Impulsoras", "Entidades Colaboradoras", "Instituciones", "Cámaras de Comercio", "Asociaciones Corporativas"];
const sections: EcosistemaSection[] = sectionNames.map((name, index) => ({
  id: index === 1 ? "eco-empresas" : `section-${index}`, name, slug: index === 0 ? "embajadores" : `category-${index}`,
  description: "", active: true, sort_order: index,
}));
const entities: EcosistemaEntity[] = sections.map((section, index) => ({
  id: index === 1 ? "eco_5goxc949" : `entity-${index}`, section_id: section.id, name: index === 1 ? "IPSEN" : `Participante ${index}`,
  logo_url: `/fixture-${index}.png`, description: "", tags: [], active: true, sort_order: index,
}));
const movement: Movement = {
  id: "id1785328376756", slug: "de-philadelphia-a-madrid", title: "De Philadelphia a Madrid",
  description: "Descripción de prueba", content: "", coverImage: "/fixture.png", coverImageOriginal: "",
  coverImageHero: "", coverImageHeroDesktop: "", coverImageCard: "", tags: [], status: "published", featured: false,
};
const renderPage = async () => renderToStaticMarkup(await MovimientoDetailPage({ params: Promise.resolve({ slug: movement.slug }) }));

beforeEach(() => {
  vi.clearAllMocks();
  data.getMovimientoBySlug.mockResolvedValue(movement);
  data.getEcosistemaSections.mockResolvedValue(sections);
  data.getEmbajadoresByMovimiento.mockResolvedValue(entities);
  data.getActividadesByMovimiento.mockResolvedValue([]);
  data.getNoticiasByMovimiento.mockResolvedValue([]);
  data.getEventosByMovimiento.mockResolvedValue([]);
});

describe("movement participants", () => {
  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
  ])("renders council $id photos and missing-photo placeholders as people, not company logos", async (identity) => {
    const council = { ...sections[0], ...identity, name: "Consejo Consultivo de Impacto Social", sort_order: 7 };
    data.getEcosistemaSections.mockResolvedValue([...sections, council]);
    data.getEmbajadoresByMovimiento.mockResolvedValue([
      ...entities,
      { ...entities[0], id: "fixture-council-member", section_id: council.id, name: "Miembro con foto", logo_url: "/council-portrait.jpg", description: "Cargo de prueba" },
      { ...entities[0], id: "fixture-council-empty", section_id: council.id, name: "Miembro sin foto", logo_url: "" },
      { ...entities[0], id: "fixture-council-inactive", section_id: council.id, name: "Miembro inactivo", active: false },
    ]);
    const html = await renderPage();
    const photo = html.match(/<img[^>]*alt="Miembro con foto"[^>]*>/)?.[0];
    expect(photo).toContain("rounded-full object-cover");
    expect(photo).not.toContain("object-contain");
    const councilHtml = html.slice(html.indexOf(">Consejo Consultivo de Impacto Social</h3>"));
    expect(councilHtml).toContain("w-12 h-12 rounded-full");
    expect(councilHtml).toContain("M15.75 6a3.75 3.75");
    expect(councilHtml).toContain("Miembro sin foto");
    expect(councilHtml).toContain("Cargo de prueba");
    expect(html).not.toContain("Miembro inactivo");
    expect(html.match(/<img[^>]*alt="IPSEN"[^>]*>/)?.[0]).toContain("object-contain");
    expect(html.match(/<img[^>]*alt="IPSEN"[^>]*>/)?.[0]).not.toContain("rounded-full");
  });

  it("hides inactive entities, inactive sections and unclassified relations without inventing categories", async () => {
    data.getEcosistemaSections.mockResolvedValue([...sections, { ...sections[0], id: "inactive", name: "Sección oculta", active: false }]);
    data.getEmbajadoresByMovimiento.mockResolvedValue([
      ...entities,
      { ...entities[0], id: "hidden-entity", name: "Entidad oculta", active: false },
      { ...entities[0], id: "hidden-section", name: "Miembro oculto", section_id: "inactive" },
      { ...entities[0], id: "orphan", name: "Sin clasificar", section_id: "unknown" },
    ]);
    const html = await renderPage();
    for (const hidden of ["Entidad oculta", "Miembro oculto", "Sección oculta", "Sin clasificar"]) expect(html).not.toContain(hidden);
    expect(html).toContain("IPSEN");
  });

  it("links participation to the existing join page rather than email", async () => {
    const html = await renderPage();
    expect(html).toMatch(/<a[^>]*href="\/unete"[^>]*>Únete<\/a>/);
    expect(html).not.toContain("Enviar email");
    expect(html).not.toContain("mailto:");
  });

  it("offers admin selectors by real section and preserves relations in other sections when editing", () => {
    const inactiveEntity = { ...entities[1], id: "inactive-entity", name: "Empresa inactiva", active: false };
    const unknownEntity = { ...entities[0], id: "orphan", name: "Entidad sin sección", section_id: "unknown" };
    const selectedIds = [entities[0].id, entities[1].id, inactiveEntity.id, unknownEntity.id];
    admin.selectors = [];
    admin.setters = [];
    admin.states = [[], movement, "", false, [], [...entities, inactiveEntity, unknownEntity], sections, [], selectedIds];
    const html = renderToStaticMarkup(<AdminMovimientosPage />);
    for (const name of sectionNames) expect(html).toContain(`<legend>${name}</legend>`);
    expect(html).toContain("Empresa inactiva (inactiva)");
    expect(html).toContain("Sin sección válida");
    expect(html).toContain("Entidad sin sección");
    const companies = admin.selectors.find((selector) => selector.label === "Empresas Impulsoras")!;
    expect(companies.selectedIds).toEqual([entities[1].id, inactiveEntity.id]);
    companies.onChange([inactiveEntity.id]);
    const update = admin.setters[8].mock.calls[0][0];
    const next = typeof update === "function" ? update(selectedIds) : update;
    expect(next).toEqual([entities[0].id, unknownEntity.id, inactiveEntity.id]);
  });

  it("renders the real six section names and keeps company logos out of ambassador portraits", async () => {
    const html = await renderPage();
    for (const name of sectionNames) expect(html).toContain(`>${name}</h3>`);
    const ambassadorGroup = html.slice(html.indexOf(">Embajadores</h3>"), html.indexOf(">Empresas Impulsoras</h3>"));
    expect(ambassadorGroup).toContain("Participante 0");
    expect(ambassadorGroup).not.toContain("IPSEN");
    expect(html.match(/<img[^>]*alt="IPSEN"[^>]*>/)?.[0]).toContain("object-contain");
    expect(html.match(/<img[^>]*alt="IPSEN"[^>]*>/)?.[0]).not.toContain("rounded-full");
    expect(html.match(/<img[^>]*alt="Participante 0"[^>]*>/)?.[0]).toContain("rounded-full object-cover");
  });
});
