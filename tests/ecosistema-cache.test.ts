import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { NextRequest } from "next/server";
import * as sections from "@/app/api/ecosistema/secciones/route";
import * as entities from "@/app/api/ecosistema/entidades/route";

const { store, revalidatePath } = vi.hoisted(() => ({
  store: {
    getAllEcosistemaSections: vi.fn(),
    saveEcosistemaSection: vi.fn(),
    deleteEcosistemaSection: vi.fn(),
    getAllEcosistemaEntities: vi.fn(),
    getEcosistemaEntities: vi.fn(),
    saveEcosistemaEntity: vi.fn(),
    deleteEcosistemaEntity: vi.fn(),
    setEntidadMovimientos: vi.fn(),
    getMovimientosByEmbajador: vi.fn(),
  },
  revalidatePath: vi.fn(),
}));
vi.mock("@/lib/data/store", () => store);
vi.mock("next/cache", () => ({ revalidatePath }));

const section = { id: "section-1", name: "Consejo", slug: "consejo" };
const entity = { id: "entity-1", section_id: section.id, name: "Persona" };

function request(method: string, body: unknown) {
  return new NextRequest("http://localhost/api/ecosistema", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function expectInvalidated() {
  expect(revalidatePath.mock.calls).toEqual([
    ["/ecosistema"],
    ["/movimientos/[slug]", "page"],
  ]);
}

async function expectSuccessfulMutation(
  handler: (request: NextRequest) => Promise<Response>,
  method: string,
  persistence: Mock,
  body: unknown,
  responseBody: unknown = body,
) {
  let completeSave!: () => void;
  persistence.mockImplementationOnce(() => new Promise<void>((resolve) => {
    completeSave = resolve;
  }));
  const responsePromise = handler(request(method, body));
  await vi.waitFor(() => expect(persistence).toHaveBeenCalledTimes(1));
  expect(revalidatePath).not.toHaveBeenCalled();
  completeSave();
  const response = await responsePromise;
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(responseBody);
  expectInvalidated();
}

beforeEach(() => {
  vi.resetAllMocks();
  store.getAllEcosistemaSections.mockResolvedValue([section]);
  store.getAllEcosistemaEntities.mockResolvedValue([entity]);
  store.getEcosistemaEntities.mockResolvedValue([entity]);
  store.getMovimientosByEmbajador.mockResolvedValue([{ id: "movement-1" }]);
});

describe("Ecosistema CRUD cache invalidation", () => {
  const mutations = [
    { route: "sections", method: "POST", handler: sections.POST, persistence: store.saveEcosistemaSection, body: section },
    { route: "sections", method: "PUT", handler: sections.PUT, persistence: store.saveEcosistemaSection, body: section },
    { route: "sections", method: "DELETE", handler: sections.DELETE, persistence: store.deleteEcosistemaSection, body: { id: section.id } },
    { route: "entities", method: "POST", handler: entities.POST, persistence: store.saveEcosistemaEntity, body: { ...entity, movimientoIds: ["movement-1"] } },
    { route: "entities", method: "PUT", handler: entities.PUT, persistence: store.saveEcosistemaEntity, body: { ...entity, movimientoIds: ["movement-1"] } },
    { route: "entities", method: "DELETE", handler: entities.DELETE, persistence: store.deleteEcosistemaEntity, body: { id: entity.id } },
  ];

  it.each(mutations)("$route $method does not invalidate when persistence fails", async ({ method, handler, persistence, body }) => {
    persistence.mockRejectedValueOnce(new Error("Persistence failure fixture"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await handler(request(method, body));
      expect(response.status).toBe(500);
      expect(await response.json()).toHaveProperty("error");
      expect(persistence).toHaveBeenCalledTimes(1);
      expect(store.setEntidadMovimientos).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it.each(mutations)("$route $method does not invalidate invalid input", async ({ method, handler, persistence }) => {
    const response = await handler(request(method, {}));
    expect(response.status).toBe(400);
    expect(await response.json()).toHaveProperty("error");
    expect(persistence).not.toHaveBeenCalled();
    expect(store.setEntidadMovimientos).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    { route: "sections", handler: sections.POST, body: { name: section.name, slug: section.slug } },
    { route: "sections", handler: sections.POST, body: { id: section.id, slug: section.slug } },
    { route: "sections", handler: sections.POST, body: { id: section.id, name: section.name } },
    { route: "entities", handler: entities.POST, body: { section_id: section.id, name: entity.name } },
    { route: "entities", handler: entities.POST, body: { id: entity.id, name: entity.name } },
    { route: "entities", handler: entities.POST, body: { id: entity.id, section_id: section.id } },
  ])("$route POST rejects an individually missing required field without invalidation: $body", async ({ handler, body }) => {
    const response = await handler(request("POST", body));
    expect(response.status).toBe(400);
    expect(store.saveEcosistemaSection).not.toHaveBeenCalled();
    expect(store.saveEcosistemaEntity).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("does not invalidate when sections are read", async () => {
    const response = await sections.GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([section]);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    ["", [entity]],
    ["?section_id=section-1", [entity]],
    ["?entity_id=entity-1", { entity, movimientoIds: ["movement-1"] }],
    ["?section_id=section-1&entity_id=entity-1", { entity, movimientoIds: ["movement-1"] }],
  ])("does not invalidate when entities are read with query %s", async (query, body) => {
    const response = await entities.GET(new NextRequest(`http://localhost/api/ecosistema/entidades${query}`));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(body);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("does not invalidate when an entity is not found", async () => {
    const response = await entities.GET(new NextRequest("http://localhost/api/ecosistema/entidades?entity_id=missing"));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Entidad no encontrada" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    { route: "sections", handler: () => sections.GET(), persistence: store.getAllEcosistemaSections },
    { route: "entities", handler: () => entities.GET(new NextRequest("http://localhost/api/ecosistema/entidades")), persistence: store.getAllEcosistemaEntities },
    { route: "filtered entities", handler: () => entities.GET(new NextRequest("http://localhost/api/ecosistema/entidades?section_id=section-1")), persistence: store.getEcosistemaEntities },
  ])("does not invalidate when reading $route fails", async ({ handler, persistence }) => {
    persistence.mockRejectedValueOnce(new Error("Read failure fixture"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await handler();
      expect(response.status).toBe(500);
      expect(revalidatePath).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it.each([
    ["POST", entities.POST],
    ["PUT", entities.PUT],
  ] as const)("%s invalidates after movement links finish saving", async (method, handler) => {
    let completeLinks!: () => void;
    store.setEntidadMovimientos.mockImplementationOnce(() => new Promise<void>((resolve) => {
      completeLinks = resolve;
    }));
    const responsePromise = handler(request(method, { ...entity, movimientoIds: ["movement-1"] }));
    await vi.waitFor(() => expect(store.setEntidadMovimientos).toHaveBeenCalledWith(entity.id, ["movement-1"]));
    expect(store.saveEcosistemaEntity).toHaveBeenCalledWith(expect.objectContaining(entity));
    expect(revalidatePath).not.toHaveBeenCalled();
    completeLinks();
    const response = await responsePromise;
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(entity);
    expectInvalidated();
  });

  it.each([
    ["POST", entities.POST],
    ["PUT", entities.PUT],
  ] as const)("%s invalidates a persisted entity even if movement linking fails", async (method, handler) => {
    const error = new Error("Relationship persistence failure fixture");
    store.setEntidadMovimientos.mockRejectedValueOnce(error);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      await expectSuccessfulMutation(handler, method, store.saveEcosistemaEntity,
        { ...entity, movimientoIds: ["movement-1"] },
        { ...entity, movimientoError: "Movimientos no guardados. Ejecuta /api/db/setup para crear la tabla." });
      expect(store.setEntidadMovimientos).toHaveBeenCalledWith(entity.id, ["movement-1"]);
      expect(log).toHaveBeenCalledWith(`${method} /api/ecosistema/entidades — setEntidadMovimientos error:`, error);
    } finally {
      log.mockRestore();
    }
  });

  it("invalidates public pages only after an entity is deleted", async () => {
    await expectSuccessfulMutation(entities.DELETE, "DELETE", store.deleteEcosistemaEntity, { id: entity.id }, { success: true });
    expect(store.deleteEcosistemaEntity).toHaveBeenCalledWith(entity.id);
  });

  it("invalidates public pages only after an entity is updated", async () => {
    await expectSuccessfulMutation(entities.PUT, "PUT", store.saveEcosistemaEntity, entity);
    expect(store.setEntidadMovimientos).not.toHaveBeenCalled();
  });

  it("invalidates public pages only after an entity is created", async () => {
    await expectSuccessfulMutation(entities.POST, "POST", store.saveEcosistemaEntity, entity);
    expect(store.setEntidadMovimientos).not.toHaveBeenCalled();
  });

  it("invalidates public pages only after a section is deleted", async () => {
    await expectSuccessfulMutation(sections.DELETE, "DELETE", store.deleteEcosistemaSection, { id: section.id }, { success: true });
    expect(store.deleteEcosistemaSection).toHaveBeenCalledWith(section.id);
  });

  it("invalidates public pages only after a section is updated", async () => {
    await expectSuccessfulMutation(sections.PUT, "PUT", store.saveEcosistemaSection, section);
  });

  it("invalidates public pages only after a section is created", async () => {
    await expectSuccessfulMutation(sections.POST, "POST", store.saveEcosistemaSection, section);
  });
});
