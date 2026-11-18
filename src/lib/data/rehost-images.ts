import { neon } from "@neondatabase/serverless";
import { put as blobPut } from "@vercel/blob";
import sharp from "sharp";
import { isVercelBlobHost } from "@/lib/images";
import { shouldRunMigrations } from "./migrate";

/**
 * Copies images that the database references on external hosts (e.g. imgur) into
 * Vercel Blob and points every column that used them to the new URL. Runs on every
 * production build after the migrations (scripts/migrate.ts). Best effort and
 * idempotent: failures are only logged, and nothing is ever deleted.
 */

type Env = Record<string, string | undefined>;

/** Parameterized query: `text` uses $1, $2… placeholders bound to `params`. */
export type QueryFn = (text: string, params: unknown[]) => Promise<Record<string, unknown>[]>;

export type PutFn = (
  pathname: string,
  body: Buffer,
  options: { access: "public"; addRandomSuffix: boolean; contentType: string; token?: string; abortSignal?: AbortSignal },
) => Promise<{ url: string }>;

export interface RehostDeps {
  env?: Env;
  /** Defaults to a Neon HTTP connection to DATABASE_URL. */
  query?: QueryFn;
  fetch?: typeof fetch;
  put?: PutFn;
  log?: (message: string) => void;
  warn?: (message: string) => void;
}

export type RehostResult =
  | { status: "skipped" }
  | { status: "failed" }
  | { status: "done"; rehosted: string[]; failed: string[] };

const COVER_COLUMNS = ["cover_image", "cover_image_original", "cover_image_hero", "cover_image_hero_desktop", "cover_image_card"];

/** Every column that stores an image URL. Rich-text HTML (`content`) is deliberately left alone. */
const IMAGE_COLUMNS: readonly { table: string; column: string }[] = [
  ...["eventos", "noticias", "movimientos", "actividades"].flatMap((table) => COVER_COLUMNS.map((column) => ({ table, column }))),
  { table: "ecosistema_entidades", column: "logo_url" },
];

const FORMATS: Record<string, { contentType: string; extension: string }> = {
  png: { contentType: "image/png", extension: "png" },
  jpeg: { contentType: "image/jpeg", extension: "jpg" },
  webp: { contentType: "image/webp", extension: "webp" },
  gif: { contentType: "image/gif", extension: "gif" },
};
const ALLOWED_CONTENT_TYPES = new Set([...Object.values(FORMATS).map((format) => format.contentType), "image/jpg"]);
const MAX_BYTES = 10 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;
const UPLOAD_TIMEOUT_MS = 60_000;
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const PREFIX = "[rehost-images]";

/** Identifiers only ever come from IMAGE_COLUMNS; this guards against a typo turning into SQL. */
function identifier(name: string): string {
  if (!/^[a-z_]+$/.test(name)) throw new Error(`Invalid SQL identifier "${name}"`);
  return `"${name}"`;
}

function neonQuery(databaseUrl: string): QueryFn {
  const sql = neon(databaseUrl);
  return (text, params) => sql.query(text, params);
}

/** Absolute http(s) URL on a host other than Vercel Blob. Relative paths, data: URIs and Blob URLs are not external. */
function isExternalImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !isVercelBlobHost(url.hostname);
  } catch {
    return false;
  }
}

function blobPathname(source: URL, extension: string): string {
  const lastSegment = source.pathname.split("/").filter(Boolean).pop() ?? "";
  const stem = lastSegment.replace(/\.[^.]*$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100);
  return `rehosted/${stem || "image"}.${extension}`;
}

async function download(url: string, fetchImpl: typeof fetch): Promise<{ buffer: Buffer; format: (typeof FORMATS)[string] }> {
  const response = await fetchImpl(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "image/webp,image/png,image/jpeg,image/gif;q=0.9,*/*;q=0.5" },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  // imgur redirects deleted images to a "removed" placeholder that must not replace the original.
  if (response.redirected && /^\/removed\.[a-z]+$/i.test(new URL(response.url).pathname)) {
    throw new Error(`the image was removed at the source (redirected to ${response.url})`);
  }

  const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) throw new Error(`not a PNG/JPEG/WebP/GIF image (content-type "${contentType || "none"}")`);
  if (Number(response.headers.get("content-length")) > MAX_BYTES) throw new Error("larger than 10 MB");

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength === 0) throw new Error("empty response");
  if (buffer.byteLength > MAX_BYTES) throw new Error("larger than 10 MB");

  let detected: string | undefined;
  try {
    detected = (await sharp(buffer).metadata()).format;
  } catch {
    throw new Error("the downloaded file is not a valid image");
  }
  const format = detected ? FORMATS[detected] : undefined;
  if (!format) throw new Error(`unsupported image format "${detected ?? "unknown"}"`);
  return { buffer, format };
}

export async function rehostExternalImages(deps: RehostDeps = {}): Promise<RehostResult> {
  const { env = process.env, fetch: fetchImpl = fetch, put = blobPut, log = console.log, warn = console.warn } = deps;

  if (!shouldRunMigrations(env)) {
    log(`${PREFIX} skipping (VERCEL_ENV=${env.VERCEL_ENV || "unset"}; it only runs on production deploys or with RUN_MIGRATIONS=1)`);
    return { status: "skipped" };
  }
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    log(`${PREFIX} skipping: DATABASE_URL is not set`);
    return { status: "skipped" };
  }
  const token = env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    warn(`${PREFIX} warning: BLOB_READ_WRITE_TOKEN is not set, skipping (external images stay where they are)`);
    return { status: "skipped" };
  }

  try {
    const query = deps.query ?? neonQuery(databaseUrl);

    // The location is the IMAGE_COLUMNS index, so UPDATEs never take identifiers from data.
    const scan = IMAGE_COLUMNS.map(({ table, column }, index) =>
      `SELECT ${index} AS location, ${identifier(column)} AS url FROM ${identifier(table)} WHERE ${identifier(column)} ILIKE 'http%'`,
    ).join(" UNION ");
    const usages = new Map<string, Set<number>>();
    for (const row of await query(scan, [])) {
      const url = typeof row.url === "string" ? row.url : "";
      const location = Number(row.location);
      if (!IMAGE_COLUMNS[location] || !isExternalImageUrl(url)) continue;
      usages.set(url, (usages.get(url) ?? new Set()).add(location));
    }

    if (usages.size === 0) {
      log(`${PREFIX} no external images, nothing to do`);
      return { status: "done", rehosted: [], failed: [] };
    }
    log(`${PREFIX} found ${usages.size} external image URL(s)`);

    const rehosted: string[] = [];
    const failed: string[] = [];
    for (const [oldUrl, locations] of usages) {
      try {
        const { buffer, format } = await download(oldUrl, fetchImpl);
        const blob = await put(blobPathname(new URL(oldUrl), format.extension), buffer, {
          access: "public",
          addRandomSuffix: true,
          contentType: format.contentType,
          token,
          abortSignal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
        });

        const updated: string[] = [];
        for (const location of locations) {
          const { table, column } = IMAGE_COLUMNS[location];
          const rows = await query(
            `UPDATE ${identifier(table)} SET ${identifier(column)} = $1 WHERE ${identifier(column)} = $2 RETURNING id`,
            [blob.url, oldUrl],
          );
          updated.push(`${table}.${column} (${rows.length})`);
        }
        log(`${PREFIX} ${oldUrl} -> ${blob.url}: ${updated.join(", ")}`);
        rehosted.push(oldUrl);
      } catch (error) {
        warn(`${PREFIX} warning: could not rehost ${oldUrl}, it stays as is: ${error instanceof Error ? error.message : String(error)}`);
        failed.push(oldUrl);
      }
    }

    log(`${PREFIX} rehosted ${rehosted.length}, failed ${failed.length}`);
    return { status: "done", rehosted, failed };
  } catch (error) {
    warn(`${PREFIX} warning: aborted, external images stay where they are: ${error instanceof Error ? error.message : String(error)}`);
    return { status: "failed" };
  }
}
