import type { ReactNode, ComponentProps, ChangeEvent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EcosistemaPage from "@/app/(public)/ecosistema/page";
import AmbassadorCard from "@/components/ui/AmbassadorCard";
import type { EcosistemaSection } from "@/lib/types";

import AdminEcosistemaPage from "@/app/admin/ecosistema/page";

const state = vi.hoisted(() => ({
  values: [] as unknown[],
  setters: [] as ReturnType<typeof vi.fn>[],
  buttons: [] as ComponentProps<"button">[],
  inputs: [] as ComponentProps<"input">[],
}));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useState: (initial: unknown) => {
    if (!state.values.length) return actual.useState(initial);
    const setter = vi.fn();
    state.setters.push(setter);
    return [state.values.shift(), setter];
  } };
});
vi.mock("react/jsx-dev-runtime", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react/jsx-dev-runtime")>();
  return { ...actual, jsxDEV: (...args: Parameters<typeof actual.jsxDEV>) => {
    const [type, props] = args;
    if (type === "button") state.buttons.push(props as ComponentProps<"button">);
    if (type === "input") state.inputs.push(props as ComponentProps<"input">);
    return actual.jsxDEV(...args);
  } };
});
vi.mock("@/components/admin/ImageUpload", () => ({ default: ({ label, aspect, value }: { label: string; aspect: number; value: string }) => <div data-image-label={label} data-aspect={aspect} data-value={value} /> }));
vi.mock("@/components/admin/MultiSelectCheckbox", () => ({ default: () => null }));

const store = vi.hoisted(() => ({
  getEcosistemaSections: vi.fn(),
  getAllEcosistemaEntities: vi.fn(),
  getAllMovimientosForEmbajadores: vi.fn(),
}));
vi.mock("@/lib/data/store", () => store);
vi.mock("@/components/ui/Section", () => ({ default: ({ children, id }: { children: ReactNode; id: string }) => <div data-section-id={id}>{children}</div> }));
vi.mock("@/components/ui/ScrollReveal", () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock("next/image", () => ({ default: ({ fill, unoptimized, ...props }: ComponentProps<"img"> & { fill?: boolean; unoptimized?: boolean }) => <img {...props} data-original={unoptimized} /> }));

const ambassadors: EcosistemaSection = {
  id: "eco-embajadores", name: "Embajadores", slug: "embajadores", description: "Texto administrable", sort_order: 4, active: true,
};

beforeEach(() => {
  state.values = [];
  state.setters = [];
  state.buttons = [];
  state.inputs = [];
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  store.getEcosistemaSections.mockResolvedValue([]);
  store.getAllEcosistemaEntities.mockResolvedValue([]);
  store.getAllMovimientosForEmbajadores.mockResolvedValue({});
});

describe("Council administration", () => {
  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
    { id: "fixture-company", slug: "empresas-impulsoras" },
  ])("preserves the existing slug when renaming section $id through its form handler", (identity) => {
    const section = { ...ambassadors, ...identity };
    state.values = [[section], false, section, false, {}, null, false, [], [], ""];
    renderToStaticMarkup(<AdminEcosistemaPage />);
    const nameInput = state.inputs.find((input) => input.value === section.name);
    nameInput!.onChange!({ target: { value: "Nombre nuevo" } } as ChangeEvent<HTMLInputElement>);
    const update = state.setters[2].mock.calls[0][0];
    expect(update(section)).toEqual({ ...section, name: "Nombre nuevo" });
  });

  it("still generates a slug from the name for new sections", () => {
    const section = { name: "", slug: "", active: true };
    state.values = [[], false, section, false, {}, null, false, [], [], ""];
    renderToStaticMarkup(<AdminEcosistemaPage />);
    const nameInput = state.inputs.find((input) => input.required && !input.className?.includes("font-mono"));
    nameInput!.onChange!({ target: { value: "Nueva sección pública" } } as ChangeEvent<HTMLInputElement>);
    const update = state.setters[2].mock.calls[0][0];
    expect(update(section)).toEqual({ ...section, name: "Nueva sección pública", slug: "nueva-seccion-publica" });
  });

  it.each([
    { id: "eco-embajadores", slug: "embajadores", noun: "embajador", title: "Nuevo embajador", image: "Foto", aspect: "1", description: "Cargo / organización" },
    { id: "fixture-company", slug: "empresas-impulsoras", noun: "empresa", title: "Nueva empresa", image: "Logo", aspect: "3", description: "Descripción (metatexto)" },
    { id: "fixture-collaborator", slug: "entidades-colaboradoras", noun: "entidad", title: "Nueva entidad", image: "Logo", aspect: "3", description: "Descripción (metatexto)" },
    { id: "fixture-institution", slug: "instituciones", noun: "institución", title: "Nueva institución", image: "Logo", aspect: "3", description: "Descripción (metatexto)" },
  ])("preserves the section-specific form vocabulary and image treatment for $slug", (fixture) => {
    const section = { ...ambassadors, id: fixture.id, slug: fixture.slug };
    state.values = [[section], false, null, false, {}, { section_id: section.id }, false, [], [], ""];
    const html = renderToStaticMarkup(<AdminEcosistemaPage />);
    expect(html).toContain(`Añadir ${fixture.noun}`);
    expect(html).toContain(fixture.title);
    expect(html).toContain(fixture.description);
    expect(html).toContain(`data-image-label="${fixture.image}"`);
    expect(html).toContain(`data-aspect="${fixture.aspect}"`);
  });

  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
  ])("confirms deletion using member vocabulary for $id without issuing an API request on cancellation", async (identity) => {
    const council = { ...ambassadors, ...identity };
    const entity = { id: "fixture-member", section_id: council.id, name: "Miembro de prueba", active: true, tags: [], sort_order: 1 };
    state.values = [[council], false, null, false, { [council.id]: [entity] }, null, false, [], [], ""];
    const confirm = vi.fn(() => false);
    const fetch = vi.fn();
    vi.stubGlobal("confirm", confirm);
    vi.stubGlobal("fetch", fetch);
    renderToStaticMarkup(<AdminEcosistemaPage />);
    const remove = state.buttons.find((button) => button.children === "Eliminar" && button.className?.includes("shrink-0"));
    expect(remove).toBeDefined();
    await remove!.onClick!(undefined as never);
    expect(confirm).toHaveBeenCalledWith("¿Eliminar este miembro?");
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social", editing: false },
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social", editing: true },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social", editing: false },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social", editing: true },
  ])("uses person vocabulary in the member form ($id, editing=$editing)", (fixture) => {
    const council = { ...ambassadors, id: fixture.id, slug: fixture.slug };
    const entity = { section_id: council.id, ...(fixture.editing ? { id: "fixture-member" } : {}), description: "Cargo de prueba" };
    state.values = [[council], false, null, false, {}, entity, false, [], [], ""];
    const html = renderToStaticMarkup(<AdminEcosistemaPage />);
    expect(html).toContain(fixture.editing ? "Editar miembro" : "Nuevo miembro");
    expect(html).toContain("Cargo / organización");
    expect(html).toContain('value="Cargo de prueba"');
    expect(html).toContain("/>Activo</label>");
    expect(html).toContain("secciones y participantes");
    expect(html).not.toContain("secciones y logos");
  });

  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
  ])("uses square photo uploads and member actions for council $id", (identity) => {
    const council = { ...ambassadors, ...identity, name: "Consejo Consultivo de Impacto Social" };
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
  it("hides inactive sections even when they still have active participants", async () => {
    store.getEcosistemaSections.mockResolvedValue([{ ...ambassadors, active: false }]);
    store.getAllEcosistemaEntities.mockResolvedValue([
      { id: "fixture-hidden-section", section_id: ambassadors.id, name: "Miembro en sección oculta", active: true, tags: [], sort_order: 1 },
    ]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html).not.toContain("Texto administrable");
    expect(html).not.toContain("Miembro en sección oculta");
    expect(html).not.toContain('data-section-id="embajadores"');
  });

  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
  ])("shows the honest empty council state for $id", async (council) => {
    store.getEcosistemaSections.mockResolvedValue([{ ...ambassadors, ...council }]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html).toContain("Todavía no hay miembros publicados en esta sección.");
    expect(html).not.toContain("<article");
  });

  it("keeps organizations as contained logos rather than portraits", async () => {
    store.getEcosistemaSections.mockResolvedValue([{ ...ambassadors, id: "fixture-company-section", slug: "empresas-impulsoras", name: "Empresas Impulsoras" }]);
    store.getAllEcosistemaEntities.mockResolvedValue([
      { id: "fixture-company", section_id: "fixture-company-section", name: "IPSEN", logo_url: "/fixture-company.png", active: true, tags: [], sort_order: 1 },
    ]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html.match(/<img[^>]*alt="IPSEN"[^>]*>/)?.[0]).toContain("object-contain");
    expect(html).not.toContain("<article");
  });

  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
  ])("exposes unique canonical and legacy council anchors while preserving the visibility wrapper: $id", async (council) => {
    store.getEcosistemaSections.mockResolvedValue([{ ...ambassadors, ...council }]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    expect(ids.filter((id) => id === "consejo-consultivo-impacto-social")).toHaveLength(1);
    expect(ids.filter((id) => id === "consejo-consultivo-de-impacto-social")).toHaveLength(1);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).toContain(`data-section-id="${council.slug}"`);
  });

  it("respects admin section order including portrait sections", async () => {
    store.getEcosistemaSections.mockResolvedValue([
      { ...ambassadors, id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social", name: "Consejo Consultivo de Impacto Social", sort_order: 1 },
      { ...ambassadors, id: "eco-empresas", slug: "empresas-impulsoras", name: "Empresas Impulsoras", sort_order: 2 },
    ]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html.indexOf('id="consejo-consultivo-impacto-social"')).toBeLessThan(html.indexOf('id="empresas-impulsoras"'));
  });

  it.each([
    { id: "eco-consejo-consultivo", slug: "consejo-consultivo-impacto-social" },
    { id: "fixture-manual-council", slug: "consejo-consultivo-de-impacto-social" },
  ])("renders council $id members as portraits using generic entities and admin text", async (council) => {
    store.getEcosistemaSections.mockResolvedValue([{ ...ambassadors, ...council, name: "Consejo Consultivo de Impacto Social" }]);
    store.getAllEcosistemaEntities.mockResolvedValue([
      { id: "fixture-member", section_id: council.id, name: "Miembro de prueba", logo_url: "/fixture-portrait.jpg", description: "Universidad de prueba", tags: ["Investigación"], sort_order: 1, active: true },
      { id: "fixture-hidden", section_id: council.id, name: "Miembro oculto", logo_url: "", description: "", tags: [], sort_order: 2, active: false },
    ]);
    const html = renderToStaticMarkup(await EcosistemaPage());
    expect(html).toContain(`id="${council.slug}"`);
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
