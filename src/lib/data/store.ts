import type { News, Event, EcosistemaSection, EcosistemaEntity } from "@/lib/types";
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

export async function saveEvento(evento: Event): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO eventos (id, slug, title, description, content, cover_image, start_date, end_date, location, type, tags, organizer, registration_url, featured, status, updated_at)
    VALUES (${evento.id}, ${evento.slug}, ${evento.title}, ${evento.description}, ${evento.content}, ${evento.coverImage}, ${evento.startDate}, ${evento.endDate}, ${evento.location}, ${evento.type}, ${JSON.stringify(evento.tags)}, ${evento.organizer}, ${evento.registrationUrl}, ${evento.featured}, ${evento.status}, NOW())
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

export async function saveNoticia(noticia: News): Promise<void> {
  requireDB();
  const sql = getSQL();
  await sql`
    INSERT INTO noticias (id, slug, title, excerpt, content, cover_image, tags, author, published_at, updated_at, featured, status)
    VALUES (${noticia.id}, ${noticia.slug}, ${noticia.title}, ${noticia.excerpt}, ${noticia.content}, ${noticia.coverImage}, ${JSON.stringify(noticia.tags)}, ${noticia.author}, ${noticia.publishedAt}, ${noticia.updatedAt}, ${noticia.featured}, ${noticia.status})
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
      status = EXCLUDED.status
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
    INSERT INTO ecosistema_entidades (id, section_id, name, logo_url, description, sort_order, active)
    VALUES (${entity.id}, ${entity.section_id}, ${entity.name}, ${entity.logo_url}, ${entity.description}, ${entity.sort_order}, ${entity.active})
    ON CONFLICT (id) DO UPDATE SET
      section_id = EXCLUDED.section_id,
      name = EXCLUDED.name,
      logo_url = EXCLUDED.logo_url,
      description = EXCLUDED.description,
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
    sort_order: (row.sort_order as number) || 0,
    active: row.active as boolean,
  };
}
