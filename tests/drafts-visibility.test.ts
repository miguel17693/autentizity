import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createSessionToken } from "@/lib/auth/session";

const store = vi.hoisted(() => ({
  getNoticias: vi.fn(),
  getEventos: vi.fn(),
  getMovimientos: vi.fn(),
  getActividades: vi.fn(),
  getNoticia: vi.fn(),
  getNoticiaBySlug: vi.fn(),
  getMovimiento: vi.fn(),
  getEmbajadoresByMovimiento: vi.fn(),
  getActividadesByMovimiento: vi.fn(),
  getNoticiasByMovimiento: vi.fn(),
  getEventosByMovimiento: vi.fn(),
}));
vi.mock("@/lib/data/store", () => store);

const headers = vi.hoisted(() => ({ draftEnabled: false, session: undefined as string | undefined }));
vi.mock("next/headers", () => ({
  draftMode: async () => ({ isEnabled: headers.draftEnabled }),
  cookies: async () => ({
    get: (name: string) => (name === "admin_session" && headers.session ? { value: headers.session } : undefined),
  }),
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import { GET as listNoticias } from "@/app/api/noticias/route";
import { GET as listEventos } from "@/app/api/eventos/route";
import { GET as listMovimientos } from "@/app/api/movimientos/route";
import { GET as listActividades } from "@/app/api/actividades/route";
import { GET as getNoticiaRoute } from "@/app/api/noticias/[id]/route";
import { GET as getMovimientoRoute } from "@/app/api/movimientos/[id]/route";
import NoticiaDetailPage from "@/app/(public)/noticias/[slug]/page";

const SECRET = "test-session-secret";
const items = [
  { id: "1", slug: "publicada", title: "Publicada", status: "published" },
  { id: "2", slug: "borrador", title: "Borrador", status: "draft" },
  { id: "3", slug: "cancelada", title: "Cancelada", status: "cancelled" },
];

async function request(path: string, admin: boolean) {
  const init = admin ? { headers: { cookie: `admin_session=${await createSessionToken(SECRET)}` } } : {};
  return new NextRequest(`http://localhost${path}`, init);
}

const params = <T extends Record<string, string>>(value: T) => ({ params: Promise.resolve(value) });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SESSION_SECRET", SECRET);
  headers.draftEnabled = false;
  headers.session = undefined;
  for (const fn of [store.getNoticias, store.getEventos, store.getMovimientos, store.getActividades]) {
    fn.mockResolvedValue(items);
  }
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("public list endpoints", () => {
  it.each([
    ["/api/noticias", listNoticias],
    ["/api/eventos", listEventos],
    ["/api/movimientos", listMovimientos],
    ["/api/actividades", listActividades],
  ] as const)("%s hides drafts from visitors but not from admins", async (path, handler) => {
    const visitor = await (await handler(await request(path, false))).json();
    expect(visitor.map((item: { id: string }) => item.id)).toEqual(["1", "3"]);

    const admin = await (await handler(await request(path, true))).json();
    expect(admin).toHaveLength(3);
  });

  it("treats a forged session cookie as a visitor", async () => {
    const forged = new NextRequest("http://localhost/api/noticias", { headers: { cookie: "admin_session=authenticated" } });
    const body = await (await listNoticias(forged)).json();
    expect(body).toHaveLength(2);
  });
});

describe("public detail endpoints", () => {
  it("returns 404 for a draft unless the request has an admin session", async () => {
    store.getNoticia.mockResolvedValue(items[1]);
    expect((await getNoticiaRoute(await request("/api/noticias/2", false), params({ id: "2" }))).status).toBe(404);
    expect((await getNoticiaRoute(await request("/api/noticias/2", true), params({ id: "2" }))).status).toBe(200);
  });

  it("filters draft relations of a published movement for visitors", async () => {
    store.getMovimiento.mockResolvedValue({ id: "m", status: "published" });
    store.getEmbajadoresByMovimiento.mockResolvedValue([]);
    store.getActividadesByMovimiento.mockResolvedValue(items);
    store.getNoticiasByMovimiento.mockResolvedValue(items);
    store.getEventosByMovimiento.mockResolvedValue(items);

    const visitor = await (await getMovimientoRoute(await request("/api/movimientos/m", false), params({ id: "m" }))).json();
    expect(visitor.noticias).toHaveLength(2);
    expect(visitor.eventos).toHaveLength(2);
    expect(visitor.actividades).toHaveLength(2);

    const admin = await (await getMovimientoRoute(await request("/api/movimientos/m", true), params({ id: "m" }))).json();
    expect(admin.noticias).toHaveLength(3);
  });
});

describe("public detail pages", () => {
  beforeEach(() => {
    store.getNoticiaBySlug.mockResolvedValue({ ...items[1], excerpt: "", content: "", tags: [], publishedAt: "2025-01-01" });
  });

  it("returns notFound for a draft outside preview", async () => {
    await expect(NoticiaDetailPage(params({ slug: "borrador" }))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("returns notFound when draft mode is on without a valid admin session", async () => {
    headers.draftEnabled = true;
    headers.session = "authenticated";
    await expect(NoticiaDetailPage(params({ slug: "borrador" }))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders a draft in admin preview", async () => {
    headers.draftEnabled = true;
    headers.session = await createSessionToken(SECRET);
    await expect(NoticiaDetailPage(params({ slug: "borrador" }))).resolves.toBeTruthy();
  });
});
