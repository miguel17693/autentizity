import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import * as noticias from "@/app/api/noticias/route";
import * as noticia from "@/app/api/noticias/[id]/route";
import * as eventos from "@/app/api/eventos/route";
import * as evento from "@/app/api/eventos/[id]/route";
import * as movimientos from "@/app/api/movimientos/route";
import * as movimiento from "@/app/api/movimientos/[id]/route";
import * as actividades from "@/app/api/actividades/route";
import * as actividad from "@/app/api/actividades/[id]/route";
import * as sectionsRoute from "@/app/api/sections/route";

const { store, sections, revalidatePath } = vi.hoisted(() => {
  const item = { id: "1", slug: "item", title: "Item" };
  const found = () => vi.fn(async () => item);
  const ok = () => vi.fn(async () => true);
  return {
    store: {
      createNoticia: ok(), getNoticia: found(), updateNoticia: found(), deleteNoticia: ok(),
      createEvento: ok(), getEvento: found(), updateEvento: found(), deleteEvento: ok(),
      createMovimiento: ok(), getMovimiento: found(), updateMovimiento: found(), deleteMovimiento: ok(),
      setMovimientoEmbajadores: ok(), setMovimientoActividades: ok(),
      createActividad: ok(), getActividad: found(), updateActividad: found(), deleteActividad: ok(),
      setActividadMovimientos: ok(),
    },
    sections: {
      getSections: vi.fn(async () => [{ id: "home-events", label: "Eventos", page: "Home", visible: true }]),
      saveSections: vi.fn(async () => undefined),
    },
    revalidatePath: vi.fn(),
  };
});
vi.mock("@/lib/data/store", () => store);
vi.mock("@/lib/data/sections", () => sections);
vi.mock("@/lib/data/cleanup", () => ({ cleanupOrphanImage: vi.fn(async () => undefined) }));
vi.mock("next/cache", () => ({ revalidatePath }));
// Mutations require an admin session once authorization lands; these tests only cover cache invalidation.
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: async () => null }));
vi.mock("@/lib/auth/session", () => ({ isAdminRequest: async () => true }));

type Handler = (request: NextRequest, context: { params: Promise<{ id: string }> }) => Promise<Response>;

function call(handler: Handler, method: string, body?: unknown) {
  const request = new NextRequest("http://localhost/api", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handler(request, { params: Promise.resolve({ id: "1" }) });
}

beforeEach(() => vi.clearAllMocks());

describe("public pages are revalidated after content mutations", () => {
  it.each([
    ["POST noticia", noticias.POST, "POST", { title: "Nueva" }],
    ["PUT noticia", noticia.PUT, "PUT", { title: "Editada" }],
    ["DELETE noticia", noticia.DELETE, "DELETE", undefined],
    ["POST evento", eventos.POST, "POST", { title: "Nuevo", startDate: "2026-11-20T18:00" }],
    ["PUT evento", evento.PUT, "PUT", { title: "Editado" }],
    ["DELETE evento", evento.DELETE, "DELETE", undefined],
    ["POST movimiento", movimientos.POST, "POST", { title: "Nuevo", embajadorIds: ["e1"], actividadIds: ["a1"] }],
    ["PUT movimiento", movimiento.PUT, "PUT", { title: "Editado", embajadorIds: ["e1"] }],
    ["DELETE movimiento", movimiento.DELETE, "DELETE", undefined],
    ["POST actividad", actividades.POST, "POST", { title: "Nueva", movimientoIds: ["m1"] }],
    ["PUT actividad", actividad.PUT, "PUT", { title: "Editada", movimientoIds: ["m1"] }],
    ["DELETE actividad", actividad.DELETE, "DELETE", undefined],
    ["PUT sections (toggle)", sectionsRoute.PUT, "PUT", { id: "home-events", visible: false }],
    ["PUT sections (list)", sectionsRoute.PUT, "PUT", [{ id: "home-events", visible: false }]],
  ] as [string, Handler, string, unknown][])("%s", async (_, handler, method, body) => {
    const response = await call(handler, method, body);
    expect(response.ok).toBe(true);
    expect(revalidatePath.mock.calls).toEqual([["/", "layout"]]);
  });

  it.each([
    ["PUT noticia", noticia.PUT, "PUT", store.getNoticia],
    ["DELETE evento", evento.DELETE, "DELETE", store.deleteEvento],
    ["PUT movimiento", movimiento.PUT, "PUT", store.getMovimiento],
    ["DELETE actividad", actividad.DELETE, "DELETE", store.deleteActividad],
  ] as [string, Handler, string, ReturnType<typeof vi.fn>][])("does not revalidate when %s finds nothing", async (_, handler, method, lookup) => {
    lookup.mockResolvedValueOnce(null);
    const response = await call(handler, method, { title: "x" });
    expect(response.status).toBe(404);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("does not revalidate when saving fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.createActividad.mockRejectedValueOnce(new Error("db down"));
    const response = await call(actividades.POST as Handler, "POST", { title: "Nueva" });
    consoleError.mockRestore();
    expect(response.status).toBe(500);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("does not revalidate when toggling an unknown section", async () => {
    const response = await call(sectionsRoute.PUT as Handler, "PUT", { id: "missing", visible: false });
    expect(response.status).toBe(404);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
