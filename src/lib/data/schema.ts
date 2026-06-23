/**
 * Database schema initialization.
 * Run via: GET /api/db/setup (protected, admin only)
 */
import { getSQL } from "./db";

export async function initSchema() {
  const sql = getSQL();

  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      start_date TEXT DEFAULT '',
      end_date TEXT DEFAULT '',
      location TEXT DEFAULT '',
      type TEXT DEFAULT 'presencial',
      tags JSONB DEFAULT '[]',
      organizer TEXT DEFAULT '',
      registration_url TEXT DEFAULT '',
      featured BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'draft',
      movimiento_id TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS noticias (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      author TEXT DEFAULT '',
      published_at TEXT DEFAULT '',
      updated_at TEXT DEFAULT '',
      featured BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'draft',
      movimiento_id TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS movimientos (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS actividades (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      featured BOOLEAN DEFAULT false,
      button_text TEXT DEFAULT '',
      button_url TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS movimiento_embajadores (
      id TEXT PRIMARY KEY,
      movimiento_id TEXT NOT NULL REFERENCES movimientos(id) ON DELETE CASCADE,
      entidad_id TEXT NOT NULL REFERENCES ecosistema_entidades(id) ON DELETE CASCADE,
      UNIQUE(movimiento_id, entidad_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS movimiento_actividades (
      id TEXT PRIMARY KEY,
      movimiento_id TEXT NOT NULL REFERENCES movimientos(id) ON DELETE CASCADE,
      actividad_id TEXT NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
      UNIQUE(movimiento_id, actividad_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      page TEXT NOT NULL,
      visible BOOLEAN DEFAULT true
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ecosistema_secciones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ecosistema_entidades (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL REFERENCES ecosistema_secciones(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      logo_url TEXT DEFAULT '',
      description TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      sort_order INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  return { success: true };
}
