import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import * as noticias from "@/app/api/noticias/route";
import * as noticia from "@/app/api/noticias/[id]/route";
import * as movimiento from "@/app/api/movimientos/[id]/route";
import { cleanupAllImages, cleanupReplacedImages } from "@/lib/data/image-cleanup";
import { validateBody } from "@/lib/api/validation";

const { store, cleanupOrphanImage, revalidatePath } = vi.hoisted(() => ({
  store: {
    getNoticia: vi.fn(),
    createNoticia: vi.fn(),
    updateNoticia: vi.fn(),
    deleteNoticia: vi.fn(),
    getMovimiento: vi.fn(),
    updateMovimiento: vi.fn(),
    setMovimientoEmbajadores: vi.fn(),
    setMovimientoActividades: vi.fn(),
  },
  cleanupOrphanImage: vi.fn(async () => undefined),
  revalidatePath: vi.fn(),
}));
vi.mock("@/lib/data/store", () => store);
vi.mock("@/lib/data/cleanup", () => ({ cleanupOrphanImage }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: async () => null }));
vi.mock("@/lib/auth/session", () => ({ isAdminRequest: async () => true }));

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const blob = (name: string) => `https://x.public.blob.vercel-storage.com/${name}.webp`;
const stored = {
  id: "n1",
  slug: "noticia",
  title: "Noticia",
  status: "published",
  coverImage: blob("cover"),
  coverImageOriginal: blob("original"),
  coverImageHero: "",
  coverImageHeroDesktop: blob("desktop"),
  coverImageCard: blob("card"),
};

type Handler = (request: NextRequest, context: { params: Promise<{ id: string }> }) => Promise<Response>;

function call(handler: Handler, method: string, body?: unknown, id = "n1") {
  const request = new NextRequest("http://localhost/api", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
  return handler(request, { params: Promise.resolve({ id }) });
}

beforeEach(() => {
  vi.resetAllMocks();
  store.getNoticia.mockResolvedValue(stored);
  store.updateNoticia.mockImplementation(async (_id: string, updates: object) => ({ ...stored, ...updates }));
  store.deleteNoticia.mockResolvedValue(true);
  store.createNoticia.mockImplementation(async (item: object) => item);
});

describe("shared content routes", () => {
  it("returns 404 without cleanup or revalidation when DELETE removes nothing", async () => {
    store.deleteNoticia.mockResolvedValueOnce(false);
    const response = await call(noticia.DELETE, "DELETE");
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Not found" });
    expect(cleanupOrphanImage).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("cleans every stored image after a successful DELETE", async () => {
    const response = await call(noticia.DELETE, "DELETE");
    expect(await response.json()).toEqual({ ok: true });
    expect(cleanupOrphanImage.mock.calls).toEqual([
      [blob("cover")], [blob("original")], [blob("desktop")], [blob("card")],
    ]);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("creates items with a UUID id and a slug derived from the title", async () => {
    const response = await call(noticias.POST, "POST", { title: "Ñandú en Acción" });
    expect(response.status).toBe(201);
    const created = await response.json();
    expect(created.id).toMatch(UUID);
    expect(created).toMatchObject({ slug: "nandu-en-accion", author: "AutentiZity", status: "draft", tags: [] });
    expect(store.createNoticia).toHaveBeenCalledWith(created);
  });

  it.each([
    ["missing title", { excerpt: "x" }, "título"],
    ["blank title", { title: "   " }, "título"],
    ["non-array tags", { title: "Ok", tags: "a,b" }, "tags"],
    ["non-boolean featured", { title: "Ok", featured: "yes" }, "featured"],
    ["title without slug characters", { title: "¡¿?!" }, "título"],
  ])("rejects POST with %s", async (_, body, field) => {
    const response = await call(noticias.POST, "POST", body);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain(field);
    expect(store.createNoticia).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a non-object JSON body", async () => {
    for (const body of ["not json", "[1,2]"]) {
      const response = await call(noticias.POST, "POST", body);
      expect(response.status).toBe(400);
    }
    expect(store.createNoticia).not.toHaveBeenCalled();
  });

  it("maps a duplicate slug to 409 with a Spanish message", async () => {
    store.createNoticia.mockRejectedValueOnce(Object.assign(new Error("duplicate key"), { code: "23505" }));
    const response = await call(noticias.POST, "POST", { title: "Repetida" });
    expect(response.status).toBe(409);
    expect((await response.json()).error).toMatch(/Ya existe/);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("keeps the path id on PUT and only cleans replaced or cleared images", async () => {
    const response = await call(noticia.PUT, "PUT", {
      id: "other",
      title: "Editada",
      coverImage: blob("cover"),
      coverImageOriginal: blob("new-original"),
      coverImageCard: "",
    });
    expect(response.status).toBe(200);
    const [id, updates] = store.updateNoticia.mock.calls[0];
    expect(id).toBe("n1");
    expect(updates).not.toHaveProperty("id");
    expect(updates.updatedAt).toEqual(expect.any(String));
    expect(cleanupOrphanImage.mock.calls).toEqual([[blob("original")], [blob("card")]]);
  });

  it("rejects PUT bodies that blank the title", async () => {
    const response = await call(noticia.PUT, "PUT", { title: "" });
    expect(response.status).toBe(400);
    expect(store.updateNoticia).not.toHaveBeenCalled();
  });

  it("only applies whitelisted movement fields and saves relations", async () => {
    store.getMovimiento.mockResolvedValue({ ...stored, id: "m1" });
    store.updateMovimiento.mockImplementation(async (_id: string, updates: object) => ({ ...stored, id: "m1", ...updates }));
    const response = await call(movimiento.PUT as Handler, "PUT", { title: "Mov", slug: "nuevo-slug", embajadorIds: ["e1"] }, "m1");
    expect(response.status).toBe(200);
    expect(store.updateMovimiento).toHaveBeenCalledWith("m1", { title: "Mov" });
    expect(store.setMovimientoEmbajadores).toHaveBeenCalledWith("m1", ["e1"]);
    expect(store.setMovimientoActividades).not.toHaveBeenCalled();
  });
});

describe("image cleanup helpers", () => {
  it("ignores fields that were not submitted", async () => {
    await cleanupReplacedImages(stored, { ...stored, coverImage: "" }, { title: "x" });
    expect(cleanupOrphanImage).not.toHaveBeenCalled();
  });

  it("skips empty URLs and missing items", async () => {
    await cleanupAllImages(undefined);
    await cleanupAllImages({ coverImage: "", coverImageCard: blob("card") });
    expect(cleanupOrphanImage.mock.calls).toEqual([[blob("card")]]);
  });
});

describe("validateBody", () => {
  it("accepts valid and absent optional fields", () => {
    expect(validateBody({ title: "Ok", tags: ["a"] }, { title: "string", tags: "string[]", featured: "boolean" }, { required: ["title"] })).toBeNull();
  });

  it("allows omitting required fields on partial updates", () => {
    expect(validateBody({ featured: true }, { featured: "boolean" }, { required: ["title"], partial: true })).toBeNull();
  });

  it("rejects arrays with non-string items", () => {
    expect(validateBody({ tags: ["a", 1] }, { tags: "string[]" })).toMatch(/lista de textos/);
  });
});
