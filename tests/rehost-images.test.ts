import sharp from "sharp";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanupOrphanImage } from "@/lib/data/cleanup";
import { rehostExternalImages, type PutFn, type QueryFn } from "@/lib/data/rehost-images";

const { del, sql } = vi.hoisted(() => ({ del: vi.fn(), sql: vi.fn() }));
vi.mock("@vercel/blob", () => ({ del, put: vi.fn() }));
vi.mock("@/lib/data/db", () => ({ getSQL: () => sql }));

const IMGUR = "https://i.imgur.com/I2NP0i4.png";
const BLOB = "https://store.public.blob.vercel-storage.com/eventos/cover.jpg";
const PRODUCTION = { VERCEL_ENV: "production", DATABASE_URL: "postgres://fixture", BLOB_READ_WRITE_TOKEN: "blob-token" };

let png: Uint8Array<ArrayBuffer>;
beforeAll(async () => {
  png = new Uint8Array(await sharp({ create: { width: 4, height: 3, channels: 3, background: "#c33" } }).png().toBuffer());
});

beforeEach(() => vi.clearAllMocks());

type Tables = Record<string, Record<string, string>[]>;

/** In-memory database that understands the scan (UNION of per-column SELECTs) and the per-column UPDATEs. */
function fakeDatabase(tables: Tables) {
  const updates: string[] = [];
  const query = vi.fn<QueryFn>(async (text, params) => {
    const update = text.match(/^UPDATE "(\w+)" SET "(\w+)" = \$1 WHERE "\w+" = \$2 RETURNING id$/);
    if (update) {
      const [, table, column] = update;
      updates.push(`${table}.${column}`);
      const rows = (tables[table] ?? []).filter((row) => row[column] === params[1]);
      for (const row of rows) row[column] = String(params[0]);
      return rows.map(({ id }) => ({ id }));
    }
    // Deliberately ignores the ILIKE filter so the code's own URL checks are exercised.
    return [...text.matchAll(/SELECT (\d+) AS location, "(\w+)" AS url FROM "(\w+)"/g)].flatMap(([, location, column, table]) =>
      (tables[table] ?? []).filter((row) => column in row).map((row) => ({ location: Number(location), url: row[column] })),
    );
  });
  return { query, updates };
}

function imageResponse(body: BodyInit = png, contentType = "image/png") {
  return new Response(body, { headers: { "content-type": contentType } });
}

const blobPut = () =>
  vi.fn<PutFn>(async (pathname) => ({ url: `https://store.public.blob.vercel-storage.com/${pathname.replace(/\.(\w+)$/, "-a1b2.$1")}` }));

describe("rehostExternalImages", () => {
  it("downloads and uploads an external image once and repoints every column that uses it", async () => {
    const tables: Tables = {
      eventos: [{ id: "legado", cover_image: IMGUR, cover_image_original: IMGUR, cover_image_hero: IMGUR, cover_image_hero_desktop: IMGUR, cover_image_card: IMGUR }],
      noticias: [{ id: "n1", cover_image: IMGUR, cover_image_card: BLOB }],
    };
    const db = fakeDatabase(tables);
    const fetch = vi.fn(async () => imageResponse());
    const put = blobPut();
    const log = vi.fn();
    const warn = vi.fn();

    const result = await rehostExternalImages({ env: PRODUCTION, query: db.query, fetch, put, log, warn });

    const rehostedUrl = "https://store.public.blob.vercel-storage.com/rehosted/I2NP0i4-a1b2.png";
    expect(result).toEqual({ status: "done", rehosted: [IMGUR], failed: [] });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(IMGUR, expect.objectContaining({
      headers: expect.objectContaining({ "User-Agent": expect.stringContaining("Mozilla/5.0") }),
      signal: expect.any(AbortSignal),
    }));
    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenCalledWith("rehosted/I2NP0i4.png", expect.any(Buffer), expect.objectContaining({
      access: "public", addRandomSuffix: true, contentType: "image/png", token: "blob-token",
    }));
    expect(tables.eventos[0]).toEqual({
      id: "legado", cover_image: rehostedUrl, cover_image_original: rehostedUrl, cover_image_hero: rehostedUrl,
      cover_image_hero_desktop: rehostedUrl, cover_image_card: rehostedUrl,
    });
    expect(tables.noticias[0]).toEqual({ id: "n1", cover_image: rehostedUrl, cover_image_card: BLOB });
    expect(warn).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("[rehost-images] rehosted 1, failed 0");
  });

  it("leaves Blob, relative, empty and data: values untouched", async () => {
    const db = fakeDatabase({
      eventos: [{ id: "e1", cover_image: BLOB, cover_image_original: "/images/legado.png", cover_image_card: "" }],
      ecosistema_entidades: [{ id: "eco1", logo_url: "data:image/png;base64,AAAA" }, { id: "eco2", logo_url: "/logos/papageno.png" }],
    });
    const fetch = vi.fn();
    const put = blobPut();

    const result = await rehostExternalImages({ env: PRODUCTION, query: db.query, fetch, put, log: () => {}, warn: () => {} });

    expect(result).toEqual({ status: "done", rehosted: [], failed: [] });
    expect(fetch).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
    expect(db.updates).toEqual([]);
  });

  it("warns and keeps the original URL when a download is unusable, and carries on with the rest", async () => {
    const urls = {
      offline: "https://offline.example/a.png",
      html: "https://imgur.com/I2NP0i4",
      corrupt: "https://cdn.example/corrupt.png",
      good: "https://cdn.example/logos/acme.png",
    };
    const tables: Tables = {
      eventos: [{ id: "e1", cover_image: urls.offline, cover_image_card: urls.html }],
      ecosistema_entidades: [{ id: "eco1", logo_url: urls.corrupt }, { id: "eco2", logo_url: urls.good }],
    };
    const db = fakeDatabase(tables);
    const fetch = vi.fn(async (url: string | URL | Request) => {
      if (url === urls.offline) throw new TypeError("fetch failed");
      if (url === urls.html) return imageResponse("<html></html>", "text/html; charset=utf-8");
      if (url === urls.corrupt) return imageResponse("not really a png");
      return imageResponse();
    });
    const put = blobPut();
    const log = vi.fn();
    const warn = vi.fn();

    const result = await rehostExternalImages({ env: PRODUCTION, query: db.query, fetch, put, log, warn });

    expect(result).toEqual({ status: "done", rehosted: [urls.good], failed: [urls.offline, urls.html, urls.corrupt] });
    expect(put).toHaveBeenCalledTimes(1);
    expect(db.updates).toEqual(["ecosistema_entidades.logo_url"]);
    expect(tables.eventos[0]).toEqual({ id: "e1", cover_image: urls.offline, cover_image_card: urls.html });
    expect(tables.ecosistema_entidades).toEqual([
      { id: "eco1", logo_url: urls.corrupt },
      { id: "eco2", logo_url: "https://store.public.blob.vercel-storage.com/rehosted/acme-a1b2.png" },
    ]);
    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      expect.stringContaining(`could not rehost ${urls.offline}`),
      expect.stringContaining(`could not rehost ${urls.html}`),
      expect.stringContaining(`could not rehost ${urls.corrupt}`),
    ]);
    expect(log).toHaveBeenCalledWith("[rehost-images] rehosted 1, failed 3");
  });

  it("never throws when the database is unreachable", async () => {
    const query = vi.fn<QueryFn>(async () => { throw new Error("connection refused"); });
    const warn = vi.fn();

    await expect(rehostExternalImages({ env: PRODUCTION, query, fetch: vi.fn(), put: blobPut(), log: () => {}, warn }))
      .resolves.toEqual({ status: "failed" });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("connection refused"));
  });

  it.each([
    ["a local or CI build", {}],
    ["a Vercel preview, which shares the production database", { ...PRODUCTION, VERCEL_ENV: "preview" }],
    ["production without a Blob token", { VERCEL_ENV: "production", DATABASE_URL: "postgres://fixture" }],
    ["production without DATABASE_URL", { VERCEL_ENV: "production", BLOB_READ_WRITE_TOKEN: "blob-token" }],
  ])("skips without touching anything on %s", async (_label, env) => {
    const db = fakeDatabase({ eventos: [{ id: "e1", cover_image: IMGUR }] });
    const fetch = vi.fn();
    const put = blobPut();
    const log = vi.fn();
    const warn = vi.fn();

    expect(await rehostExternalImages({ env, query: db.query, fetch, put, log, warn })).toEqual({ status: "skipped" });
    expect(db.query).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
    expect([...log.mock.calls, ...warn.mock.calls].flat()).toEqual([expect.stringContaining("skipping")]);
  });
});

describe("cleanupOrphanImage", () => {
  it("keeps a Blob image that an entity logo still uses", async () => {
    sql.mockImplementation(async (strings: TemplateStringsArray) => (strings.join("?").includes("ecosistema_entidades") ? [{ id: "eco1" }] : []));

    await cleanupOrphanImage(BLOB);

    expect(del).not.toHaveBeenCalled();
  });
});
