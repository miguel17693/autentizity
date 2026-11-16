import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as seedRoute from "@/app/api/db/seed/route";
import { createSessionToken } from "@/lib/auth/session";
import { runMigrations, type MigrationSession } from "@/lib/data/migrate";
import type { Migration, SqlTag } from "@/lib/data/schema";

const { sql } = vi.hoisted(() => ({ sql: vi.fn() }));
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
  sql.mockResolvedValue([]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

/** In-memory stand-in for the database session: records statements and tracks schema_migrations. */
function fakeDatabase(appliedIds: string[] = []) {
  const applied = [...appliedIds];
  const statements: string[] = [];
  const query = vi.fn(async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = strings.join("?").replace(/\s+/g, " ").trim();
    statements.push(text);
    if (text === "SELECT id FROM schema_migrations") return applied.map((id) => ({ id }));
    if (text.startsWith("INSERT INTO schema_migrations")) applied.push(String(values[0]));
    return [];
  });
  const close = vi.fn(async () => {});
  const connect = vi.fn(async (): Promise<MigrationSession> => ({ sql: query, close }));
  return { applied, statements, connect, close };
}

function migration(id: string) {
  return { id, up: vi.fn(async (run: SqlTag) => { await run([`UPDATE ${id}`] as unknown as TemplateStringsArray); }) };
}

const PRODUCTION = { VERCEL_ENV: "production", DATABASE_URL: "postgres://fixture" };

describe("runMigrations", () => {
  it.each([
    ["a local or CI build", {}],
    ["a Vercel preview", { VERCEL_ENV: "preview", DATABASE_URL: "postgres://fixture" }],
    ["vercel dev", { VERCEL_ENV: "development", DATABASE_URL: "postgres://fixture" }],
  ])("skips without connecting on %s", async (_label, env) => {
    const db = fakeDatabase();
    const log = vi.fn();
    expect(await runMigrations({ env, connect: db.connect, migrations: [migration("a")], log })).toEqual({ status: "skipped" });
    expect(db.connect).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("skipping migrations"));
  });

  it.each([
    ["in production", { VERCEL_ENV: "production" }],
    ["when forced with RUN_MIGRATIONS=1", { RUN_MIGRATIONS: "1" }],
  ])("fails without DATABASE_URL %s", async (_label, env) => {
    const db = fakeDatabase();
    await expect(runMigrations({ env, connect: db.connect, migrations: [], log: () => {} })).rejects.toThrow("DATABASE_URL is not set");
    expect(db.connect).not.toHaveBeenCalled();
  });

  it("runs pending migrations in order inside a locked transaction and records their ids", async () => {
    const db = fakeDatabase();
    const first = migration("0001-first");
    const second = migration("0002-second");
    const result = await runMigrations({ env: PRODUCTION, connect: db.connect, migrations: [first, second], log: () => {} });

    expect(result).toEqual({ status: "migrated", applied: ["0001-first", "0002-second"] });
    expect(db.connect).toHaveBeenCalledWith("postgres://fixture");
    expect(db.applied).toEqual(["0001-first", "0002-second"]);
    expect(db.statements.slice(0, 3)).toEqual([
      "BEGIN",
      "SET LOCAL lock_timeout = '60s'",
      "SELECT pg_advisory_xact_lock(hashtext('autentizity.schema_migrations'))",
    ]);
    expect(db.statements[3]).toMatch(/^CREATE TABLE IF NOT EXISTS schema_migrations/);
    const order = ["UPDATE 0001-first", "INSERT INTO schema_migrations (id) VALUES (?)", "UPDATE 0002-second", "INSERT INTO schema_migrations (id) VALUES (?)", "COMMIT"];
    expect(db.statements.slice(-order.length)).toEqual(order);
    expect(db.close).toHaveBeenCalledTimes(1);
  });

  it("skips migrations that were already applied", async () => {
    const db = fakeDatabase(["0001-first"]);
    const first = migration("0001-first");
    const second = migration("0002-second");
    const result = await runMigrations({ env: { RUN_MIGRATIONS: "1", DATABASE_URL: "postgres://fixture" }, connect: db.connect, migrations: [first, second], log: () => {} });

    expect(result).toEqual({ status: "migrated", applied: ["0002-second"] });
    expect(first.up).not.toHaveBeenCalled();
    expect(second.up).toHaveBeenCalledTimes(1);
    expect(db.applied).toEqual(["0001-first", "0002-second"]);
  });

  it("rolls back, does not record the id and rethrows when a migration fails", async () => {
    const db = fakeDatabase();
    const broken: Migration = { id: "0001-broken", up: vi.fn(async () => { throw new Error("SQL failure fixture"); }) };
    const later = migration("0002-later");
    await expect(runMigrations({ env: PRODUCTION, connect: db.connect, migrations: [broken, later], log: () => {} })).rejects.toThrow("SQL failure fixture");
    expect(db.applied).toEqual([]);
    expect(later.up).not.toHaveBeenCalled();
    expect(db.statements).toContain("ROLLBACK");
    expect(db.statements).not.toContain("COMMIT");
    expect(db.close).toHaveBeenCalledTimes(1);
  });

  it("refuses duplicate migration ids before connecting", async () => {
    const db = fakeDatabase();
    await expect(runMigrations({ env: PRODUCTION, connect: db.connect, migrations: [migration("a"), migration("a")], log: () => {} })).rejects.toThrow('Duplicate migration id "a"');
    expect(db.connect).not.toHaveBeenCalled();
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
