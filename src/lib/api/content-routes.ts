import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { isAdminRequest } from "@/lib/auth/session";
import { cleanupAllImages, cleanupReplacedImages, type CoverImages } from "@/lib/data/image-cleanup";
import { generateId } from "@/lib/ids";
import { revalidatePublicContent } from "@/lib/revalidate";
import { slugify } from "@/lib/utils";
import { isPubliclyVisible, onlyPublic } from "@/lib/visibility";
import { readJsonBody, validateBody, type BodySchema, type JsonBody } from "./validation";

type ContentItem = CoverImages & { id: string; status: string };
type IdContext = { params: Promise<{ id: string }> };

export interface ContentResource<T extends ContentItem> {
  /** Public API path, used in error logs (e.g. "/api/noticias"). */
  path: string;
  schema: BodySchema;
  list: () => Promise<T[]>;
  get: (id: string) => Promise<T | null | undefined>;
  create: (item: T) => Promise<unknown>;
  update: (id: string, updates: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  /** Builds a new item from a validated POST body, applying defaults. */
  build: (body: JsonBody, base: { id: string; slug: string; now: string }) => T;
  /** Maps a validated PUT body to the fields to update. Defaults to the body without `id`. */
  toUpdates?: (body: JsonBody, now: string) => Partial<T>;
  /** Extra related data merged into GET /[id] responses. */
  withRelated?: (item: T, isAdmin: boolean) => Promise<object>;
  /** Persists M:N relations after create/update. */
  saveRelations?: (id: string, body: JsonBody) => Promise<void>;
  deletedBody: object;
}

const INVALID_JSON = "El cuerpo de la petición debe ser un objeto JSON";
const SLUG_TAKEN = "Ya existe otro contenido con la misma URL (slug). Cambia el título o el slug.";

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === "23505";
}

function withErrorHandling<A extends unknown[]>(label: string, handler: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (isUniqueViolation(err)) return NextResponse.json({ error: SLUG_TAKEN }, { status: 409 });
      console.error(`[${label}]`, err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}

function withoutId(body: JsonBody): JsonBody {
  const { id: _id, ...rest } = body;
  return rest;
}

export function createContentRoutes<T extends ContentItem>(resource: ContentResource<T>) {
  const { path } = resource;
  const toUpdates = resource.toUpdates ?? ((body: JsonBody) => withoutId(body) as Partial<T>);

  const collection = {
    GET: withErrorHandling(`GET ${path}`, async (request: NextRequest) => {
      const items = await resource.list();
      return NextResponse.json((await isAdminRequest(request)) ? items : onlyPublic(items));
    }),

    POST: withErrorHandling(`POST ${path}`, async (request: NextRequest) => {
      const denied = await requireAdmin(request);
      if (denied) return denied;
      const body = await readJsonBody(request);
      if (!body) return badRequest(INVALID_JSON);
      const invalid = validateBody(body, resource.schema, { required: ["title"] });
      if (invalid) return badRequest(invalid);

      const slug = (body.slug as string | undefined) || slugify(body.title as string);
      if (!slug) return badRequest("El título debe contener letras o números");
      const id = generateId();
      const item = resource.build(body, { id, slug, now: new Date().toISOString() });

      await resource.create(item);
      await resource.saveRelations?.(id, body);
      revalidatePublicContent();
      return NextResponse.json(item, { status: 201 });
    }),
  };

  const item = {
    GET: withErrorHandling(`GET ${path}/[id]`, async (request: NextRequest, { params }: IdContext) => {
      const { id } = await params;
      const found = await resource.get(id);
      const isAdmin = await isAdminRequest(request);
      if (!found || (!isPubliclyVisible(found) && !isAdmin)) return notFound();
      if (!resource.withRelated) return NextResponse.json(found);
      return NextResponse.json({ ...found, ...(await resource.withRelated(found, isAdmin)) });
    }),

    PUT: withErrorHandling(`PUT ${path}/[id]`, async (request: NextRequest, { params }: IdContext) => {
      const denied = await requireAdmin(request);
      if (denied) return denied;
      const { id } = await params;
      const body = await readJsonBody(request);
      if (!body) return badRequest(INVALID_JSON);
      const invalid = validateBody(body, resource.schema, { required: ["title"], partial: true });
      if (invalid) return badRequest(invalid);

      const existing = await resource.get(id);
      if (!existing) return notFound();
      const updated = await resource.update(id, toUpdates(body, new Date().toISOString()));
      if (!updated) return notFound();

      await cleanupReplacedImages(existing, updated, body);
      await resource.saveRelations?.(id, body);
      revalidatePublicContent();
      return NextResponse.json(updated);
    }),

    DELETE: withErrorHandling(`DELETE ${path}/[id]`, async (request: NextRequest, { params }: IdContext) => {
      const denied = await requireAdmin(request);
      if (denied) return denied;
      const { id } = await params;
      const existing = await resource.get(id);
      if (!(await resource.remove(id))) return notFound();

      await cleanupAllImages(existing ?? undefined);
      revalidatePublicContent();
      return NextResponse.json(resource.deletedBody);
    }),
  };

  return { collection, item };
}
