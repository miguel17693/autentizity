import * as store from "@/lib/data/store";
import type { Activity, Event, Movement, News } from "@/lib/types";
import { onlyPublic } from "@/lib/visibility";
import { COVER_IMAGE_FIELDS, type CoverImages } from "@/lib/data/image-cleanup";
import { createContentRoutes } from "./content-routes";
import type { BodySchema, JsonBody } from "./validation";

const baseSchema: BodySchema = {
  slug: "string",
  title: "string",
  description: "string",
  content: "string",
  ...Object.fromEntries(COVER_IMAGE_FIELDS.map((field) => [field, "string" as const])),
  tags: "string[]",
  status: "string",
  featured: "boolean",
};

function coverImagesFrom(body: CoverImages) {
  return {
    coverImage: body.coverImage ?? "",
    coverImageOriginal: body.coverImageOriginal ?? "",
    coverImageHero: body.coverImageHero ?? "",
    coverImageHeroDesktop: body.coverImageHeroDesktop ?? "",
    coverImageCard: body.coverImageCard ?? "",
  };
}

function pick(body: JsonBody, fields: readonly string[]): JsonBody {
  return Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));
}

// Store functions are called lazily so test mocks of "@/lib/data/store" apply.
export const noticiasRoutes = createContentRoutes<News>({
  path: "/api/noticias",
  schema: { ...baseSchema, excerpt: "string", author: "string", publishedAt: "string", movimientoId: "string" },
  list: () => store.getNoticias(),
  get: (id) => store.getNoticia(id),
  create: (item) => store.createNoticia(item),
  update: (id, updates) => store.updateNoticia(id, updates),
  remove: (id) => store.deleteNoticia(id),
  build: (body, { id, slug, now }) => {
    const b = body as Partial<News>;
    return {
      id,
      slug,
      title: b.title ?? "",
      excerpt: b.excerpt ?? "",
      content: b.content ?? "",
      ...coverImagesFrom(b),
      tags: b.tags ?? [],
      author: b.author ?? "AutentiZity",
      publishedAt: b.publishedAt ?? now,
      updatedAt: now,
      featured: b.featured ?? false,
      status: b.status ?? "draft",
      movimientoId: b.movimientoId ?? "",
    };
  },
  toUpdates: ({ id: _id, ...body }, now) => ({ ...body, updatedAt: now }) as Partial<News>,
  deletedBody: { ok: true },
});

export const eventosRoutes = createContentRoutes<Event>({
  path: "/api/eventos",
  schema: {
    ...baseSchema,
    startDate: "string",
    endDate: "string",
    location: "string",
    type: "string",
    organizer: "string",
    registrationUrl: "string",
    movimientoId: "string",
  },
  list: () => store.getEventos(),
  get: (id) => store.getEvento(id),
  create: (item) => store.createEvento(item),
  update: (id, updates) => store.updateEvento(id, updates),
  remove: (id) => store.deleteEvento(id),
  build: (body, { id, slug, now }) => {
    const b = body as Partial<Event>;
    return {
      id,
      slug,
      title: b.title ?? "",
      description: b.description ?? "",
      content: b.content ?? "",
      ...coverImagesFrom(b),
      startDate: b.startDate ?? now,
      endDate: b.endDate ?? b.startDate ?? now,
      location: b.location ?? "",
      type: b.type ?? "presencial",
      tags: b.tags ?? [],
      organizer: b.organizer ?? "AutentiZity",
      registrationUrl: b.registrationUrl ?? "",
      featured: b.featured ?? false,
      status: b.status ?? "draft",
      updatedAt: now,
      movimientoId: b.movimientoId ?? "",
    };
  },
  deletedBody: { ok: true },
});

// Movement slugs are not editable after creation.
const MOVEMENT_EDITABLE_FIELDS = ["title", "description", "content", ...COVER_IMAGE_FIELDS, "tags", "status", "featured"];

export const movimientosRoutes = createContentRoutes<Movement>({
  path: "/api/movimientos",
  schema: { ...baseSchema, embajadorIds: "string[]", actividadIds: "string[]" },
  list: () => store.getMovimientos(),
  get: (id) => store.getMovimiento(id),
  create: (item) => store.createMovimiento(item),
  update: (id, updates) => store.updateMovimiento(id, updates),
  remove: (id) => store.deleteMovimiento(id),
  build: (body, { id, slug }) => {
    const b = body as Partial<Movement>;
    return {
      id,
      slug,
      title: b.title ?? "",
      description: b.description ?? "",
      content: b.content ?? "",
      ...coverImagesFrom(b),
      tags: b.tags ?? [],
      status: b.status ?? "draft",
      featured: b.featured ?? false,
    };
  },
  toUpdates: (body) => pick(body, MOVEMENT_EDITABLE_FIELDS) as Partial<Movement>,
  withRelated: async (mov, isAdmin) => {
    const [embajadores, actividades, noticias, eventos] = await Promise.all([
      store.getEmbajadoresByMovimiento(mov.id).catch(() => []),
      store.getActividadesByMovimiento(mov.id).catch(() => []),
      store.getNoticiasByMovimiento(mov.id).catch(() => []),
      store.getEventosByMovimiento(mov.id).catch(() => []),
    ]);
    if (isAdmin) return { embajadores, actividades, noticias, eventos };
    return {
      embajadores,
      actividades: onlyPublic(actividades),
      noticias: onlyPublic(noticias),
      eventos: onlyPublic(eventos),
    };
  },
  saveRelations: async (id, body) => {
    if (body.embajadorIds !== undefined) await store.setMovimientoEmbajadores(id, body.embajadorIds as string[]);
    if (body.actividadIds !== undefined) await store.setMovimientoActividades(id, body.actividadIds as string[]);
  },
  deletedBody: { success: true },
});

export const actividadesRoutes = createContentRoutes<Activity>({
  path: "/api/actividades",
  schema: { ...baseSchema, buttonText: "string", buttonUrl: "string", movimientoIds: "string[]" },
  list: () => store.getActividades(),
  get: (id) => store.getActividad(id),
  create: (item) => store.createActividad(item),
  update: (id, updates) => store.updateActividad(id, updates),
  remove: (id) => store.deleteActividad(id),
  build: (body, { id, slug }) => {
    const b = body as Partial<Activity>;
    return {
      id,
      slug,
      title: b.title ?? "",
      description: b.description ?? "",
      content: b.content ?? "",
      ...coverImagesFrom(b),
      tags: b.tags ?? [],
      status: b.status ?? "draft",
      featured: b.featured ?? false,
      buttonText: b.buttonText ?? "",
      buttonUrl: b.buttonUrl ?? "",
    };
  },
  toUpdates: ({ id: _id, movimientoIds: _movimientoIds, ...body }) => body as Partial<Activity>,
  withRelated: async (act, isAdmin) => {
    const movimientos = await store.getMovimientosByActividad(act.id).catch(() => []);
    return { movimientos: isAdmin ? movimientos : onlyPublic(movimientos) };
  },
  saveRelations: async (id, body) => {
    if (body.movimientoIds !== undefined) await store.setActividadMovimientos(id, body.movimientoIds as string[]);
  },
  deletedBody: { success: true },
});
