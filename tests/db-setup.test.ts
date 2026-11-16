import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as setupRoute from "@/app/api/db/setup/route";
import * as seedRoute from "@/app/api/db/seed/route";
import { createSessionToken } from "@/lib/auth/session";

const { initSchema, revalidatePath, sql } = vi.hoisted(() => ({
  initSchema: vi.fn(),
  revalidatePath: vi.fn(),
  sql: vi.fn(),
}));
vi.mock("@/lib/data/schema", () => ({ initSchema }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/data/db", () => ({ getSQL: () => sql }));

const SECRET = "test-session-secret";

async function adminRequest(path: string, { origin = "http://localhost:3000", session = true } = {}) {
  const headers = new Headers({ host: "localhost:3000" });
  if (origin) headers.set("origin", origin);
  if (session) headers.set("cookie", `admin_session=${await createSessionToken(SECRET)}`);
  return new Request(`http://localhost:3000${path}`, { method: "POST", headers });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SESSION_SECRET", SECRET);
  initSchema.mockResolvedValue({ success: true });
  sql.mockResolvedValue([]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/db/setup", () => {
  it("does not expose a GET handler", () => {
    expect("GET" in setupRoute).toBe(false);
  });

  it("invalidates Ecosistema after a successful migration without waiting for ISR", async () => {
    const response = await setupRoute.POST(await adminRequest("/api/db/setup"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/ecosistema");
    expect(initSchema.mock.invocationCallOrder[0]).toBeLessThan(revalidatePath.mock.invocationCallOrder[0]);
  });

  it("does not invalidate when the migration fails", async () => {
    initSchema.mockRejectedValue(new Error("SQL failure fixture"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await setupRoute.POST(await adminRequest("/api/db/setup"));
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "Error interno del servidor" });
      expect(revalidatePath).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it("rejects requests without an admin session", async () => {
    const response = await setupRoute.POST(await adminRequest("/api/db/setup", { session: false }));
    expect(response.status).toBe(401);
    expect(initSchema).not.toHaveBeenCalled();
  });

  it.each([
    ["a foreign origin", "https://evil.example"],
    ["no origin header", ""],
  ])("rejects cross-site requests with %s", async (_label, origin) => {
    const response = await setupRoute.POST(await adminRequest("/api/db/setup", { origin }));
    expect(response.status).toBe(403);
    expect(initSchema).not.toHaveBeenCalled();
  });
});

describe("/api/db/seed", () => {
  it.each([
    ["NODE_ENV", "production"],
    ["VERCEL_ENV", "production"],
  ])("returns 404 for GET and POST when %s is production", async (name, value) => {
    vi.stubEnv(name, value);
    expect((await seedRoute.GET()).status).toBe(404);
    expect((await seedRoute.POST(await adminRequest("/api/db/seed"))).status).toBe(404);
    expect(sql).not.toHaveBeenCalled();
  });

  it("only accepts POST outside production", async () => {
    const response = await seedRoute.GET();
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    expect(sql).not.toHaveBeenCalled();
  });

  it("requires an admin session outside production", async () => {
    const response = await seedRoute.POST(await adminRequest("/api/db/seed", { session: false }));
    expect(response.status).toBe(401);
    expect(sql).not.toHaveBeenCalled();
  });

  it("seeds mock data for an admin outside production", async () => {
    const response = await seedRoute.POST(await adminRequest("/api/db/seed"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
    expect(sql).toHaveBeenCalled();
  });
});
