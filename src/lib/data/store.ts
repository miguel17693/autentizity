import type { News, Event, Movement, Activity, EcosistemaSection, EcosistemaEntity } from "@/lib/types";
import { getSQL } from "@/lib/data/db";

/*
 * Data store backed by Neon Postgres (via Vercel Storage).
 * Requires DATABASE_URL to be set.
 */

function requireDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Create a Neon database in Vercel Storage and link it to this project."
    );
  }
}

// --- Eventos ---

export async function getEventos(): Promise<Event[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM eventos ORDER BY start_date DESC`;
  return rows.map(rowToEvent);
}

export async function getEventosByMovimiento(movimientoId: string): Promise<Event[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM eventos WHERE movimiento_id = ${movimientoId} ORDER BY start_date DESC`;
  return rows.map(rowToEvent);
}

export async function saveEvento(evento: Event): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO eventos (id, slug, title, description, content, cover_image, start_date, end_date, location, type, tags, organizer, registration_url, featured, status, movimiento_id, updated_at)
    VALUES (${evento.id}, ${evento.slug}, ${evento.title}, ${evento.description}, ${evento.content}, ${evento.coverImage}, ${evento.startDate}, ${evento.endDate}, ${evento.location}, ${evento.type}, ${JSON.stringify(evento.tags)}, ${evento.organizer}, ${evento.registrationUrl}, ${evento.featured}, ${evento.status}, ${evento.movimientoId || null}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      content = EXCLUDED.content,
      cover_image = EXCLUDED.cover_image,
      start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date,
      location = EXCLUDED.location,
      type = EXCLUDED.type,
      tags = EXCLUDED.tags,
      organizer = EXCLUDED.organizer,
      registration_url = EXCLUDED.registration_url,
      featured = EXCLUDED.featured,
      status = EXCLUDED.status,
      movimiento_id = EXCLUDED.movimiento_id,
      updated_at = NOW()
  `;
}

export async function getEvento(id: string): Promise<Event | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM eventos WHERE id = ${id} LIMIT 1`;
  return rows.length ? rowToEvent(rows[0]) : undefined;
}

export async function getEventoBySlug(slug: string): Promise<Event | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM eventos WHERE slug = ${slug} LIMIT 1`;
  return rows.length ? rowToEvent(rows[0]) : undefined;
}

export async function createEvento(evento: Event): Promise<Event> {
  await saveEvento(evento);
  return evento;
}

export async function updateEvento(id: string, updates: Partial<Event>): Promise<Event | null> {
  const existing = await getEvento(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await saveEvento(updated);
  return updated;
}

export async function deleteEvento(id: string): Promise<boolean> {
  requireDB();
  const sql = getSQL();
  const result = await sql`DELETE FROM eventos WHERE id = ${id}`;
  return (result as unknown as { count?: number }).count !== 0;
}

// --- Noticias ---

export async function getNoticias(): Promise<News[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM noticias ORDER BY published_at DESC`;
  return rows.map(rowToNews);
}

export async function getNoticiasByMovimiento(movimientoId: string): Promise<News[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM noticias WHERE movimiento_id = ${movimientoId} ORDER BY published_at DESC`;
  return rows.map(rowToNews);
}

export async function saveNoticia(noticia: News): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO noticias (id, slug, title, excerpt, content, cover_image, tags, author, published_at, updated_at, featured, status, movimiento_id)
    VALUES (${noticia.id}, ${noticia.slug}, ${noticia.title}, ${noticia.excerpt}, ${noticia.content}, ${noticia.coverImage}, ${JSON.stringify(noticia.tags)}, ${noticia.author}, ${noticia.publishedAt}, ${noticia.updatedAt}, ${noticia.featured}, ${noticia.status}, ${noticia.movimientoId || null})
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      cover_image = EXCLUDED.cover_image,
      tags = EXCLUDED.tags,
      author = EXCLUDED.author,
      published_at = EXCLUDED.published_at,
      updated_at = EXCLUDED.updated_at,
      featured = EXCLUDED.featured,
      status = EXCLUDED.status,
      movimiento_id = EXCLUDED.movimiento_id
  `;
}

export async function getNoticia(id: string): Promise<News | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM noticias WHERE id = ${id} LIMIT 1`;
  return rows.length ? rowToNews(rows[0]) : undefined;
}

export async function getNoticiaBySlug(slug: string): Promise<News | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM noticias WHERE slug = ${slug} LIMIT 1`;
  return rows.length ? rowToNews(rows[0]) : undefined;
}

export async function createNoticia(noticia: News): Promise<News> {
  await saveNoticia(noticia);
  return noticia;
}

export async function updateNoticia(id: string, updates: Partial<News>): Promise<News | null> {
  const existing = await getNoticia(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await saveNoticia(updated);
  return updated;
}

export async function deleteNoticia(id: string): Promise<boolean> {
  requireDB();
  const sql = getSQL();
  const result = await sql`DELETE FROM noticias WHERE id = ${id}`;
  return (result as unknown as { count?: number }).count !== 0;
}

// --- Movimientos ---

export async function getMovimientos(): Promise<Movement[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM movimientos ORDER BY created_at DESC`;
  return rows.map(rowToMovement);
}

export async function saveMovimiento(mov: Movement): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO movimientos (id, slug, title, description, content, cover_image, tags, status, featured, updated_at)
    VALUES (${mov.id}, ${mov.slug}, ${mov.title}, ${mov.description}, ${mov.content}, ${mov.coverImage}, ${JSON.stringify(mov.tags)}, ${mov.status}, ${mov.featured}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      content = EXCLUDED.content,
      cover_image = EXCLUDED.cover_image,
      tags = EXCLUDED.tags,
      status = EXCLUDED.status,
      featured = EXCLUDED.featured,
      updated_at = NOW()
  `;
}

export async function getMovimiento(id: string): Promise<Movement | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM movimientos WHERE id = ${id} LIMIT 1`;
  return rows.length ? rowToMovement(rows[0]) : undefined;
}

export async function getMovimientoBySlug(slug: string): Promise<Movement | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM movimientos WHERE slug = ${slug} LIMIT 1`;
  return rows.length ? rowToMovement(rows[0]) : undefined;
}

export async function createMovimiento(mov: Movement): Promise<Movement> {
  await saveMovimiento(mov);
  return mov;
}

export async function updateMovimiento(id: string, updates: Partial<Movement>): Promise<Movement | null> {
  const existing = await getMovimiento(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await saveMovimiento(updated);
  return updated;
}

export async function deleteMovimiento(id: string): Promise<boolean> {
  requireDB();
  const sql = getSQL();
  const result = await sql`DELETE FROM movimientos WHERE id = ${id}`;
  return (result as unknown as { count?: number }).count !== 0;
}

// --- Actividades ---

export async function getActividades(): Promise<Activity[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM actividades ORDER BY created_at DESC`;
  return rows.map(rowToActivity);
}

export async function getActividadesByMovimiento(movimientoId: string): Promise<Activity[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`
    SELECT a.* FROM actividades a
    INNER JOIN movimiento_actividades ma ON a.id = ma.actividad_id
    WHERE ma.movimiento_id = ${movimientoId}
    ORDER BY a.created_at DESC
  `;
  return rows.map(rowToActivity);
}

export async function saveActividad(act: Activity): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO actividades (id, slug, title, description, content, cover_image, tags, status, featured, updated_at)
    VALUES (${act.id}, ${act.slug}, ${act.title}, ${act.description}, ${act.content}, ${act.coverImage}, ${JSON.stringify(act.tags)}, ${act.status}, ${act.featured}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      content = EXCLUDED.content,
      cover_image = EXCLUDED.cover_image,
      tags = EXCLUDED.tags,
      status = EXCLUDED.status,
      featured = EXCLUDED.featured,
      updated_at = NOW()
  `;
}

export async function getActividad(id: string): Promise<Activity | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM actividades WHERE id = ${id} LIMIT 1`;
  return rows.length ? rowToActivity(rows[0]) : undefined;
}

export async function getActividadBySlug(slug: string): Promise<Activity | undefined> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM actividades WHERE slug = ${slug} LIMIT 1`;
  return rows.length ? rowToActivity(rows[0]) : undefined;
}

export async function createActividad(act: Activity): Promise<Activity> {
  await saveActividad(act);
  return act;
}

export async function updateActividad(id: string, updates: Partial<Activity>): Promise<Activity | null> {
  const existing = await getActividad(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await saveActividad(updated);
  return updated;
}

export async function deleteActividad(id: string): Promise<boolean> {
  requireDB();
  const sql = getSQL();
  const result = await sql`DELETE FROM actividades WHERE id = ${id}`;
  return (result as unknown as { count?: number }).count !== 0;
}

// --- Relaciones Movimiento-Embajador (M:N) ---

export async function getEmbajadoresByMovimiento(movimientoId: string): Promise<EcosistemaEntity[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`
    SELECT e.* FROM ecosistema_entidades e
    INNER JOIN movimiento_embajadores me ON e.id = me.entidad_id
    WHERE me.movimiento_id = ${movimientoId}
    ORDER BY e.sort_order
  `;
  return rows.map(rowToEcosistemaEntity);
}

export async function setMovimientoEmbajadores(movimientoId: string, entidadIds: string[]): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`DELETE FROM movimiento_embajadores WHERE movimiento_id = ${movimientoId}`;
  for (const entidadId of entidadIds) {
    const id = "me_" + Math.random().toString(36).slice(2, 10);
    await sql`INSERT INTO movimiento_embajadores (id, movimiento_id, entidad_id) VALUES (${id}, ${movimientoId}, ${entidadId})`;
  }
}

// --- Relaciones Movimiento-Actividad (M:N) ---

export async function setMovimientoActividades(movimientoId: string, actividadIds: string[]): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`DELETE FROM movimiento_actividades WHERE movimiento_id = ${movimientoId}`;
  for (const actividadId of actividadIds) {
    const id = "ma_" + Math.random().toString(36).slice(2, 10);
    await sql`INSERT INTO movimiento_actividades (id, movimiento_id, actividad_id) VALUES (${id}, ${movimientoId}, ${actividadId})`;
  }
}

export async function getMovimientosByActividad(actividadId: string): Promise<Movement[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`
    SELECT m.* FROM movimientos m
    INNER JOIN movimiento_actividades ma ON m.id = ma.movimiento_id
    WHERE ma.actividad_id = ${actividadId}
    ORDER BY m.created_at DESC
  `;
  return rows.map(rowToMovement);
}

export async function getMovimientosByEmbajador(entidadId: string): Promise<Movement[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`
    SELECT m.* FROM movimientos m
    INNER JOIN movimiento_embajadores me ON m.id = me.movimiento_id
    WHERE me.entidad_id = ${entidadId}
    ORDER BY m.created_at DESC
  `;
  return rows.map(rowToMovement);
}

// --- Ecosistema Secciones ---

export async function getEcosistemaSections(): Promise<EcosistemaSection[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM ecosistema_secciones WHERE active = true ORDER BY sort_order`;
  return rows.map(rowToEcosistemaSection);
}

export async function getAllEcosistemaSections(): Promise<EcosistemaSection[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM ecosistema_secciones ORDER BY sort_order`;
  return rows.map(rowToEcosistemaSection);
}

export async function getEcosistemaSection(id: string): Promise<EcosistemaSection | null> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM ecosistema_secciones WHERE id = ${id} LIMIT 1`;
  return rows.length ? rowToEcosistemaSection(rows[0]) : null;
}

export async function saveEcosistemaSection(section: EcosistemaSection): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO ecosistema_secciones (id, name, slug, description, sort_order, active)
    VALUES (${section.id}, ${section.name}, ${section.slug}, ${section.description}, ${section.sort_order}, ${section.active})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      slug = EXCLUDED.slug,
      description = EXCLUDED.description,
      sort_order = EXCLUDED.sort_order,
      active = EXCLUDED.active
  `;
}

export async function deleteEcosistemaSection(id: string): Promise<boolean> {
  requireDB();
  const sql = getSQL();
  const result = await sql`DELETE FROM ecosistema_secciones WHERE id = ${id}`;
  return (result as unknown as { count?: number }).count !== 0;
}

// --- Ecosistema Entidades ---

export async function getEcosistemaEntities(sectionId: string): Promise<EcosistemaEntity[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM ecosistema_entidades WHERE section_id = ${sectionId} AND active = true ORDER BY sort_order`;
  return rows.map(rowToEcosistemaEntity);
}

export async function getAllEcosistemaEntities(): Promise<EcosistemaEntity[]> {
  requireDB();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM ecosistema_entidades ORDER BY sort_order`;
  return rows.map(rowToEcosistemaEntity);
}

export async function saveEcosistemaEntity(entity: EcosistemaEntity): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO ecosistema_entidades (id, section_id, name, logo_url, description, tags, sort_order, active)
    VALUES (${entity.id}, ${entity.section_id}, ${entity.name}, ${entity.logo_url}, ${entity.description}, ${JSON.stringify(entity.tags)}, ${entity.sort_order}, ${entity.active})
    ON CONFLICT (id) DO UPDATE SET
      section_id = EXCLUDED.section_id,
      name = EXCLUDED.name,
      logo_url = EXCLUDED.logo_url,
      description = EXCLUDED.description,
      tags = EXCLUDED.tags,
      sort_order = EXCLUDED.sort_order,
      active = EXCLUDED.active
  `;
}

export async function deleteEcosistemaEntity(id: string): Promise<boolean> {
  requireDB();
  const sql = getSQL();
  const result = await sql`DELETE FROM ecosistema_entidades WHERE id = ${id}`;
  return (result as unknown as { count?: number }).count !== 0;
}

// --- Row mappers ---

function rowToEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: (row.description as string) || "",
    content: (row.content as string) || "",
    coverImage: (row.cover_image as string) || "",
    startDate: (row.start_date as string) || "",
    endDate: (row.end_date as string) || "",
    location: (row.location as string) || "",
    type: (row.type as Event["type"]) || "presencial",
    tags: (row.tags as string[]) || [],
    organizer: (row.organizer as string) || "",
    registrationUrl: (row.registration_url as string) || "",
    featured: row.featured as boolean,
    status: (row.status as Event["status"]) || "draft",
    movimientoId: (row.movimiento_id as string) || "",
  };
}

function rowToNews(row: Record<string, unknown>): News {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) || "",
    content: (row.content as string) || "",
    coverImage: (row.cover_image as string) || "",
    tags: (row.tags as string[]) || [],
    author: (row.author as string) || "",
    publishedAt: (row.published_at as string) || "",
    updatedAt: (row.updated_at as string) || "",
    featured: row.featured as boolean,
    status: (row.status as News["status"]) || "draft",
    movimientoId: (row.movimiento_id as string) || "",
  };
}

function rowToMovement(row: Record<string, unknown>): Movement {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: (row.description as string) || "",
    content: (row.content as string) || "",
    coverImage: (row.cover_image as string) || "",
    tags: (row.tags as string[]) || [],
    status: (row.status as Movement["status"]) || "draft",
    featured: row.featured as boolean,
  };
}

function rowToActivity(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: (row.description as string) || "",
    content: (row.content as string) || "",
    coverImage: (row.cover_image as string) || "",
    tags: (row.tags as string[]) || [],
    status: (row.status as Activity["status"]) || "draft",
    featured: row.featured as boolean,
  };
}

function rowToEcosistemaSection(row: Record<string, unknown>): EcosistemaSection {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || "",
    sort_order: (row.sort_order as number) || 0,
    active: row.active as boolean,
  };
}

function rowToEcosistemaEntity(row: Record<string, unknown>): EcosistemaEntity {
  return {
    id: row.id as string,
    section_id: row.section_id as string,
    name: row.name as string,
    logo_url: (row.logo_url as string) || "",
    description: (row.description as string) || "",
    tags: (row.tags as string[]) || [],
    sort_order: (row.sort_order as number) || 0,
    active: row.active as boolean,
  };
}
